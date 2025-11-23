package com.fretpilot.app;

import android.app.Activity;
import android.util.Log;
import com.android.billingclient.api.*;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONException;
import java.util.ArrayList;
import java.util.List;

/**
 * Capacitor plugin for Google Play Billing integration
 * Handles subscriptions and in-app purchases for FretPilot Studio
 */
@CapacitorPlugin(name = "PlayBilling")
public class PlayBillingPlugin extends Plugin {
    private static final String TAG = "PlayBilling";
    private BillingClient billingClient;
    private boolean isReady = false;

    @Override
    public void load() {
        super.load();
        initializeBillingClient();
    }

    private void initializeBillingClient() {
        Activity activity = getActivity();
        billingClient = BillingClient.newBuilder(activity)
            .setListener(this::handlePurchaseUpdate)
            .enablePendingPurchases()
            .build();

        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    isReady = true;
                    Log.d(TAG, "Billing client ready");
                } else {
                    Log.e(TAG, "Billing setup failed: " + billingResult.getDebugMessage());
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                isReady = false;
                Log.w(TAG, "Billing service disconnected");
                // Implement retry logic if needed
            }
        });
    }

    /**
     * Query available subscription products
     * Call from JS: PlayBilling.queryProducts({ productIds: ['premium_monthly', 'premium_yearly'] })
     */
    @PluginMethod
    public void queryProducts(PluginCall call) {
        if (!ensureReady(call)) return;

        JSArray productIdsArray = call.getArray("productIds");
        if (productIdsArray == null) {
            call.reject("productIds array required");
            return;
        }

        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        try {
            for (int i = 0; i < productIdsArray.length(); i++) {
                String productId = productIdsArray.getString(i);
                productList.add(
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(BillingClient.ProductType.SUBS)
                        .build()
                );
            }
        } catch (JSONException e) {
            call.reject("Invalid productIds format", e);
            return;
        }

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                JSArray products = new JSArray();
                for (ProductDetails details : productDetailsList) {
                    JSObject product = new JSObject();
                    product.put("productId", details.getProductId());
                    product.put("title", details.getTitle());
                    product.put("description", details.getDescription());
                    
                    // Get subscription pricing
                    List<ProductDetails.SubscriptionOfferDetails> offers = details.getSubscriptionOfferDetails();
                    if (offers != null && !offers.isEmpty()) {
                        ProductDetails.SubscriptionOfferDetails offer = offers.get(0);
                        List<ProductDetails.PricingPhase> pricingPhases = offer.getPricingPhases().getPricingPhaseList();
                        if (!pricingPhases.isEmpty()) {
                            ProductDetails.PricingPhase phase = pricingPhases.get(0);
                            product.put("price", phase.getFormattedPrice());
                            product.put("priceAmountMicros", phase.getPriceAmountMicros());
                            product.put("priceCurrencyCode", phase.getPriceCurrencyCode());
                            product.put("billingPeriod", phase.getBillingPeriod());
                        }
                        product.put("offerId", offer.getOfferId());
                        product.put("offerToken", offer.getOfferToken());
                    }
                    products.put(product);
                }
                
                JSObject result = new JSObject();
                result.put("products", products);
                call.resolve(result);
            } else {
                call.reject("Query failed: " + billingResult.getDebugMessage());
            }
        });
    }

    /**
     * Purchase a subscription
     * Call from JS: PlayBilling.purchaseSubscription({ productId: 'premium_monthly', offerToken: '...' })
     */
    @PluginMethod
    public void purchaseSubscription(PluginCall call) {
        if (!ensureReady(call)) return;

        String productId = call.getString("productId");
        String offerToken = call.getString("offerToken");

        if (productId == null || offerToken == null) {
            call.reject("productId and offerToken required");
            return;
        }

        // Store call for callback after purchase flow
        bridge.saveCall(call);

        List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
        
        // Note: You need to query product details first to get ProductDetails object
        // This is a simplified version - in production, cache ProductDetails from queryProducts
        QueryProductDetailsParams.Product product = QueryProductDetailsParams.Product.newBuilder()
            .setProductId(productId)
            .setProductType(BillingClient.ProductType.SUBS)
            .build();

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(List.of(product))
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && !productDetailsList.isEmpty()) {
                ProductDetails productDetails = productDetailsList.get(0);
                
                BillingFlowParams.ProductDetailsParams detailsParams = BillingFlowParams.ProductDetailsParams.newBuilder()
                    .setProductDetails(productDetails)
                    .setOfferToken(offerToken)
                    .build();

                BillingFlowParams flowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(List.of(detailsParams))
                    .build();

                BillingResult launchResult = billingClient.launchBillingFlow(getActivity(), flowParams);
                if (launchResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    call.reject("Purchase flow failed: " + launchResult.getDebugMessage());
                    bridge.releaseCall(call);
                }
            } else {
                call.reject("Product not found");
                bridge.releaseCall(call);
            }
        });
    }

    /**
     * Restore purchases (query active subscriptions)
     */
    @PluginMethod
    public void restorePurchases(PluginCall call) {
        if (!ensureReady(call)) return;

        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.SUBS)
            .build();

        billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                JSArray purchasesArray = new JSArray();
                for (Purchase purchase : purchases) {
                    if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                        JSObject purchaseObj = convertPurchaseToJSObject(purchase);
                        purchasesArray.put(purchaseObj);
                    }
                }
                
                JSObject result = new JSObject();
                result.put("purchases", purchasesArray);
                call.resolve(result);
            } else {
                call.reject("Restore failed: " + billingResult.getDebugMessage());
            }
        });
    }

    /**
     * Acknowledge a purchase (required for subscriptions)
     */
    @PluginMethod
    public void acknowledgePurchase(PluginCall call) {
        if (!ensureReady(call)) return;

        String purchaseToken = call.getString("purchaseToken");
        if (purchaseToken == null) {
            call.reject("purchaseToken required");
            return;
        }

        AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchaseToken)
            .build();

        billingClient.acknowledgePurchase(params, billingResult -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                call.resolve();
            } else {
                call.reject("Acknowledgment failed: " + billingResult.getDebugMessage());
            }
        });
    }

    /**
     * Handle purchase updates from billing flow
     */
    private void handlePurchaseUpdate(BillingResult billingResult, List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                    // Notify JavaScript side
                    JSObject result = convertPurchaseToJSObject(purchase);
                    notifyListeners("purchaseCompleted", result);

                    // Acknowledge if not already acknowledged
                    if (!purchase.isAcknowledged()) {
                        AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
                            .setPurchaseToken(purchase.getPurchaseToken())
                            .build();
                        billingClient.acknowledgePurchase(params, ackResult -> {
                            Log.d(TAG, "Purchase acknowledged: " + purchase.getProducts().get(0));
                        });
                    }
                }
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            notifyListeners("purchaseCanceled", new JSObject());
        } else {
            JSObject error = new JSObject();
            error.put("message", billingResult.getDebugMessage());
            notifyListeners("purchaseError", error);
        }
    }

    private JSObject convertPurchaseToJSObject(Purchase purchase) {
        JSObject obj = new JSObject();
        obj.put("orderId", purchase.getOrderId());
        obj.put("purchaseToken", purchase.getPurchaseToken());
        obj.put("productId", purchase.getProducts().get(0));
        obj.put("purchaseTime", purchase.getPurchaseTime());
        obj.put("acknowledged", purchase.isAcknowledged());
        return obj;
    }

    private boolean ensureReady(PluginCall call) {
        if (!isReady) {
            call.reject("Billing client not ready");
            return false;
        }
        return true;
    }

    @Override
    protected void handleOnDestroy() {
        if (billingClient != null) {
            billingClient.endConnection();
        }
        super.handleOnDestroy();
    }
}
