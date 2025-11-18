# Store Configuration - Choose Your Business Model

## Current Status: AFFILIATE MODE (No Direct Sales)

Your store currently redirects to other retailers (Sweetwater, Amazon). You earn commissions but don't handle inventory or shipping.

---

## Option 1: Keep Affiliate Model (Easiest - Current Setup)

### What You Need:
1. Join affiliate programs and get YOUR links:
   - Sweetwater Partners: https://www.sweetwater.com/dealerzone/
   - Amazon Associates: https://affiliate-program.amazon.com
   - Guitar Center Affiliates: https://www.guitarcenter.com/Affiliates-Program.gc

2. Replace placeholder URLs in `src/components/MusicStore.vue`:
   ```javascript
   affiliateUrl: 'https://sweetwater.sjv.io/c/YOUR_TRACKING_ID/product_id'
   ```

### Pros:
- ✅ No inventory to manage
- ✅ No shipping headaches
- ✅ No customer service (vendor handles it)
- ✅ Zero startup cost

### Cons:
- ❌ Low commission (3-8% typically)
- ❌ No control over pricing
- ❌ Customers leave your site

---

## Option 2: Dropshipping (Best of Both Worlds)

### What You Need:
1. Sign up with dropship suppliers:
   - **Printful** (custom merch): https://www.printful.com
   - **Spocket** (general products): https://www.spocket.co  
   - **Inventory Source** (music gear): https://www.inventorysource.com

2. Get API keys from each supplier

3. Add to Vercel environment variables:
   ```
   PRINTFUL_API_KEY=your_key_here
   SPOCKET_API_KEY=your_key_here
   ```

4. Update products in MusicStore.vue:
   ```javascript
   {
     id: 1,
     fulfillment: 'dropship',  // Changed from 'affiliate'
     vendor: 'Printful',
     // Remove affiliateUrl
   }
   ```

### Pros:
- ✅ You set the prices (higher margins: 20-50%)
- ✅ Your branding (customers buy from YOU)
- ✅ Supplier handles fulfillment automatically
- ✅ Scale without warehouse

### Cons:
- ⚠️ Need to handle customer support
- ⚠️ Supplier approval can take 1-2 weeks
- ⚠️ Slightly more complex setup

---

## Option 3: Self-Fulfillment (Full Control)

### What You Need:
1. Physical inventory/warehouse space
2. Shipping materials and process
3. Payment processing (already set up with Stripe)

4. Update products:
   ```javascript
   {
     id: 1,
     fulfillment: 'fretpilot',  // Changed from 'affiliate'
     stock: 25,                  // Your actual inventory
     // Remove affiliateUrl
   }
   ```

### Pros:
- ✅ Highest profit margins (30-60%)
- ✅ Complete control over quality
- ✅ Direct customer relationships
- ✅ Faster shipping (if local)

### Cons:
- ❌ Need startup capital for inventory
- ❌ Storage/warehouse costs
- ❌ Shipping logistics
- ❌ Risk of unsold inventory

---

## Recommended Path for Quick Start:

### Phase 1: Affiliate Links (Week 1)
- Replace placeholder URLs with YOUR affiliate links
- Start earning commissions immediately
- Zero risk, zero investment

### Phase 2: Add Dropshipping (Week 2-4)  
- Sign up with Printful for custom FretPilot merch
- Add 5-10 dropship products alongside affiliates
- Test the fulfillment process

### Phase 3: Scale (Month 2+)
- Add Inventory Source for music gear dropshipping
- Consider self-fulfilling best-sellers for higher margins
- Expand product catalog based on sales data

---

## Quick Action Steps:

### To Make Money Today (Affiliate):
1. Sign up for Sweetwater Partners (instant approval)
2. Get your tracking URL
3. Find the 50+ places in MusicStore.vue with `affiliateUrl: 'https://sweetwater.com'`
4. Replace with: `affiliateUrl: 'https://sweetwater.sjv.io/c/YOUR_ID/product_id'`
5. Deploy and start earning 3-5% commissions

### To Sell Your Own Products (Dropship):
1. Sign up for Printful (5 min)
2. Create custom FretPilot t-shirts, mugs, etc.
3. Get API key
4. Add to Vercel: `PRINTFUL_API_KEY=...`
5. Add products to store with `fulfillment: 'dropship'`
6. Orders auto-fulfill when customers buy

---

## Sample Product Configuration:

```javascript
// AFFILIATE (current setup - just needs YOUR links)
{
  id: 1,
  name: 'Fender Stratocaster',
  price: 1299.99,
  fulfillment: 'affiliate',
  vendor: 'Sweetwater',
  affiliateUrl: 'https://sweetwater.sjv.io/c/YOUR_ID/fender-strat',
  // Customer clicks, goes to Sweetwater, you earn 4%
}

// DROPSHIP (you sell, supplier ships)
{
  id: 2,
  name: 'FretPilot Logo T-Shirt',
  price: 29.99,
  fulfillment: 'dropship',
  vendor: 'Printful',
  printfulProductId: '12345',
  // Customer buys from YOU, Printful ships, you earn ~$15
}

// SELF-FULFILL (you stock and ship)
{
  id: 3,
  name: 'Premium Guitar Picks (10-pack)',
  price: 12.99,
  fulfillment: 'fretpilot',
  stock: 500,
  // Customer buys from YOU, YOU ship, you earn ~$10
}
```

---

## Need Help Deciding?

**Start with Affiliate** if:
- You have zero budget
- You want to test the market first
- You don't want to handle support

**Go with Dropshipping** if:
- You want to build a real brand
- You're okay with 1-2 weeks setup time
- You want 20-50% margins

**Choose Self-Fulfillment** if:
- You have startup capital ($5k+)
- You want maximum profit
- You can handle logistics

---

## Files to Edit:

1. **src/components/MusicStore.vue** - Product catalog
2. **Vercel Environment Variables** - API keys
3. **src/services/dropshippingService.js** - Already set up, just needs API keys

---

*Once you decide, follow the PRODUCTION_SETUP.md guide for full deployment steps.*
