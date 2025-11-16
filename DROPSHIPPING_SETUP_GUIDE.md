# 🛒 FretPilot Dropshipping Setup Guide

## Overview
FretPilot is now integrated with multiple dropshipping platforms to sell musical instruments and accessories directly through the app. Customers can purchase products that are automatically fulfilled by our dropshipping suppliers.

---

## 🚀 Supported Dropshipping Platforms

### 1. **Spocket** (Primary for Musical Accessories)
- **Best For**: Guitar strings, picks, capos, straps, pedals, tuners
- **Shipping**: 5-10 days (from USA/EU suppliers) or 7-14 days (China)
- **Products**: Wide variety of guitar accessories and small musical items
- **Integration**: API-based order fulfillment
- **Setup Required**: API key from https://www.spocket.co/integrations/api

### 2. **Printful** (Print-on-Demand Merchandise)
- **Best For**: Branded t-shirts, hoodies, mugs with guitar designs
- **Shipping**: 3-7 days (USA), varies internationally
- **Products**: Custom-printed merchandise with FretPilot branding
- **Integration**: Direct API integration
- **Setup Required**: Store connection at https://www.printful.com/

### 3. **Modalyst** (Optional - Fashion/Lifestyle)
- **Best For**: Music-themed fashion accessories
- **Shipping**: Varies by supplier
- **Products**: Lifestyle items for musicians
- **Integration**: API available
- **Setup Required**: Account at https://modalyst.co/

---

## 📋 How It Works

### For Customers:
1. **Browse Store**: Click "🛒 Store" in FretPilot app
2. **Filter Products**: Choose category (Guitars, Accessories, Studio Gear, etc.)
3. **View Product Details**: 
   - Products marked "Dropship" ship directly from supplier
   - Products marked "Affiliate" redirect to external store (Sweetwater, Amazon)
4. **Add to Cart**: Dropship products can be purchased directly in-app
5. **Checkout**: Choose Credit Card or Bitcoin payment
6. **Automatic Fulfillment**: Orders sent automatically to supplier

### For You (Store Owner):
1. **Zero Inventory**: No need to stock products
2. **Automatic Orders**: When customer pays, order is sent to Spocket/Printful
3. **Supplier Ships**: Supplier packages and ships directly to customer
4. **You Profit**: Difference between retail price and supplier cost
5. **Track Orders**: Use order tracking in the app

---

## 🔧 Setup Instructions

### Step 1: Get API Keys

#### Spocket API Key:
```bash
1. Sign up at https://www.spocket.co/
2. Go to Settings → Integrations → API
3. Generate API key
4. Copy the key
```

#### Printful API Key:
```bash
1. Sign up at https://www.printful.com/
2. Go to Settings → Stores → Add Store
3. Choose "Manual order platform / API"
4. Copy the API key from Store Settings
```

### Step 2: Add Environment Variables

Create or edit `.env` file in your project root:

```env
# Dropshipping Platform API Keys
VITE_PRINTFUL_API_KEY=your_printful_api_key_here
VITE_SPOCKET_API_KEY=your_spocket_api_key_here
VITE_MODALYST_API_KEY=your_modalyst_api_key_here

# Stripe for Payments (if not already set)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Step 3: Import Products from Suppliers

#### Option A: Use Curated Catalog (Current Setup)
The app already has pre-configured dropship products in `MusicStore.vue` with:
- Product IDs 47-54 are dropship items
- Set to use Spocket/Printful suppliers
- Ready to accept orders

#### Option B: Fetch Live Products from API
Uncomment this code in `MusicStore.vue`:

```javascript
onMounted(async () => {
  loadCart()
  
  // Fetch live products from Spocket
  const spocketProducts = await fetchSpocketProducts('musical-instruments')
  
  // Fetch live products from Printful
  const printfulProducts = await fetchPrintfulProducts()
  
  // Merge with existing catalog
  products.value = [
    ...products.value,
    ...spocketProducts.map(formatSpocketProduct),
    ...printfulProducts.map(formatPrintfulProduct)
  ]
})
```

### Step 4: Configure Profit Margins

Edit prices in `dropshippingService.js` or product listings:

```javascript
// Example: 40% markup on supplier cost
const retailPrice = supplierCost * 1.40

// Or set fixed retail prices in MusicStore.vue:
{
  id: 47,
  name: 'Guitar Strings',
  price: 29.99,  // Your retail price
  // Supplier cost: ~$18 = $11.99 profit per sale
  vendor: 'Spocket',
  fulfillment: 'dropship'
}
```

### Step 5: Test Order Flow

1. **Add Test Product**: Add a dropship item to cart
2. **Proceed to Checkout**: Enter shipping information
3. **Payment**: Use Stripe test card `4242 4242 4242 4242`
4. **Verify**: Check console logs for dropship order creation
5. **Check Supplier Dashboard**: Verify order appears in Spocket/Printful

---

## 💰 Pricing & Profit Structure

### Example Product Margins:

| Product | Supplier Cost | Your Price | Profit | Margin |
|---------|--------------|------------|--------|--------|
| Guitar Strings (6-pack) | $18.00 | $29.99 | $11.99 | 40% |
| Guitar Capo | $8.00 | $14.99 | $6.99 | 47% |
| Distortion Pedal | $25.00 | $39.99 | $14.99 | 37% |
| Custom T-Shirt | $12.00 | $24.99 | $12.99 | 52% |
| Guitar Picks (50 pcs) | $5.00 | $12.99 | $7.99 | 62% |

**Recommended Margins:**
- Accessories: 40-60%
- Pedals/Electronics: 30-40%
- Merchandise: 50-70%

---

## 📦 Shipping & Fulfillment

### Shipping Costs:
- **Dropship Items**: $9.99 per item (or configure per supplier)
- **Free Shipping**: Offered on orders over $100
- **International**: Varies by supplier (usually $15-30)

### Delivery Times:
| Supplier | Region | Standard Delivery |
|----------|--------|-------------------|
| Spocket (USA) | USA | 5-7 days |
| Spocket (China) | Worldwide | 7-14 days |
| Printful | USA | 3-5 days |
| Printful | Europe | 5-10 days |
| Printful | International | 10-15 days |

### Tracking:
Orders are automatically tracked using the `trackOrder()` function:

```javascript
// In OrderHistory component
const trackingInfo = await trackOrder(orderId, supplier)
console.log(trackingInfo.trackingNumber)
console.log(trackingInfo.carrier)
console.log(trackingInfo.estimatedDelivery)
```

---

## 🛠️ Technical Implementation

### Files Modified:

1. **`src/services/dropshippingService.js`** (NEW)
   - Integrates Printful, Spocket, Modalyst APIs
   - Handles order creation with suppliers
   - Manages product catalog fetching
   - Calculates shipping costs

2. **`src/components/MusicStore.vue`** (UPDATED)
   - Added 8 dropship products (IDs 47-54)
   - Integrated `createDropshipOrder()` in checkout flow
   - Added dropship order tracking
   - Updated UI to show "Dropship" badge on products

3. **`.env`** (REQUIRED)
   - Add API keys for suppliers

### Order Flow:

```mermaid
Customer → Add to Cart → Checkout → Payment (Stripe)
    ↓
Payment Success → createDropshipOrder()
    ↓
Order sent to Spocket/Printful API
    ↓
Supplier receives order → Packages item → Ships to customer
    ↓
Tracking number returned → Saved in order record
    ↓
Customer receives item
```

---

## 🧪 Testing Checklist

- [ ] Add dropship product to cart
- [ ] Verify "Ships by vendor" text appears
- [ ] Complete checkout with test payment
- [ ] Check console for `createDropshipOrder()` success
- [ ] Verify order appears in supplier dashboard
- [ ] Test order tracking function
- [ ] Verify shipping cost calculation
- [ ] Test Bitcoin payment with dropship items
- [ ] Verify order confirmation email sent

---

## 🚨 Important Notes

### API Rate Limits:
- **Spocket**: 100 requests/minute
- **Printful**: 120 requests/minute
- Cache product data to avoid hitting limits

### Product Availability:
- Check supplier inventory before listing
- Set reasonable stock numbers in your catalog
- Implement out-of-stock notifications

### Returns & Refunds:
- Dropship items have supplier-specific return policies
- Clearly communicate return windows (typically 30 days)
- Process refunds through supplier portal
- Update your Terms of Service accordingly

### Compliance:
- Add proper disclaimers about shipping times
- Disclose dropshipping in Terms of Service
- Ensure product descriptions are accurate
- Follow supplier branding guidelines

---

## 📈 Growth Strategies

### 1. Expand Product Catalog
- Add 50-100 more dropship products
- Focus on high-margin accessories
- Create product bundles (e.g., "Beginner Guitar Starter Pack")

### 2. Optimize Listings
- High-quality product images
- Detailed descriptions with specs
- Customer reviews (import from supplier)
- SEO-friendly product names

### 3. Marketing
- Promote dropship items in lessons (e.g., "Get this capo to practice this song")
- Email campaigns for new products
- Social media showcase of products
- Affiliate links for advanced/expensive gear

### 4. Automation
- Auto-sync inventory from supplier APIs
- Automated price updates
- Bulk product imports
- Order status webhooks

---

## 🆘 Troubleshooting

### Issue: "Dropship order creation failed"
**Solution**: Check API keys in `.env`, verify supplier account is active

### Issue: Products not showing in store
**Solution**: Ensure `fulfillment: 'dropship'` is set in product object

### Issue: Shipping cost incorrect
**Solution**: Review `calculateShipping()` function in `dropshippingService.js`

### Issue: Order not appearing in supplier dashboard
**Solution**: Check API response in console, verify authentication

---

## 📞 Support Contacts

- **Spocket Support**: https://help.spocket.co/
- **Printful Support**: support@printful.com
- **Stripe Support**: https://support.stripe.com/

---

## 🎯 Next Steps

1. ✅ **Get API Keys** from Spocket and Printful
2. ✅ **Add to .env file** and restart dev server
3. ✅ **Test with one product** end-to-end
4. ⬜ **Add more products** to catalog
5. ⬜ **Configure profit margins** for each category
6. ⬜ **Set up product images** (use real photos from suppliers)
7. ⬜ **Launch store** and start selling!

---

**Ready to start selling musical instruments with zero inventory! 🎸🚀**
