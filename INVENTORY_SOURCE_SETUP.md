# Inventory Source Setup Guide

## Account Creation (Morning Task)

1. Go to: https://www.inventory-source.com
2. Click "Start Free Trial" or "Sign Up"
3. Choose **Music & Entertainment** as your niche
4. Business Info:
   - Business Name: **The Franks Standard**
   - Website: **https://thefranksstandard.com**
   - Description: "Premium music instruments and gear marketplace integrated with FretPilot guitar learning app"

## Supplier Applications

### Top Priority Suppliers (Apply First):
1. **Gibson** - Premium guitars
2. **Fender** - Electric & acoustic guitars, basses
3. **PRS Guitars** - High-end instruments
4. **Yamaha** - Full range (guitars, keyboards, drums, horns)
5. **Roland** - Keyboards, synths, electronic drums
6. **Marshall/Fender Amps** - Amplification
7. **Boss/TC Electronic** - Effects pedals
8. **D'Addario/Ernie Ball** - Strings & accessories

### Application Tips:
- Mention you have an established app with active users (FretPilot)
- Show thefranksstandard.com as proof of professional storefront
- Some suppliers require business license (get one if needed)
- Approval takes 1-3 business days per supplier

## API Credentials Needed

Once approved, get these from Inventory Source dashboard:
- **API Key**
- **API Secret**
- **Webhook URL** (for inventory updates)

Share these credentials securely.

## Product Import Strategy

### Phase 1 - Launch Products (50-100 items):
- Electric Guitars: Gibson, Fender, PRS (10-15 models)
- Acoustic Guitars: Martin, Taylor, Gibson (10-15 models)
- Bass Guitars: Fender, Music Man (5-10 models)
- Amplifiers: Marshall, Fender, Orange (8-12 models)
- Effects Pedals: Boss, TC Electronic, Electro-Harmonix (10-15 models)
- Accessories: Premium strings, picks, cases, cables (10-15 items)

### Phase 2 - Expansion (After First Month):
- Keyboards & Synths (Yamaha, Roland, Korg)
- Drums & Percussion
- DJ Equipment
- Pro Audio (Mics, Interfaces)
- Band & Orchestra Instruments

## Integration Code Structure

Location: `src/services/inventorySourceService.js`

Functions needed:
```javascript
// Fetch products from Inventory Source
async function syncProducts()

// Get real-time inventory count
async function checkStock(productId)

// Submit order to supplier
async function createOrder(orderDetails)

// Get tracking info
async function getOrderStatus(orderId)
```

## Pricing Strategy

**Markup Guidelines:**
- Guitars: 25-30% markup
- Amps: 30-35% markup
- Pedals: 35-40% markup
- Accessories: 40-50% markup

**Example:**
- Gibson Les Paul Standard
  - Cost: $2,200
  - Markup: 27%
  - Price: $2,799
  - Profit: $599 (after $0.50 fee)

## Shipping & Returns

**Shipping:**
- Handled by supplier
- 2-5 business days (USA)
- Tracking provided automatically

**Returns:**
- 30-day return policy (standard)
- Return to supplier (not you)
- Restocking fee: typically 15%

## Monthly Cost Breakdown

**Fixed:**
- Inventory Source: $99/month

**Variable:**
- Per-order fee: $0.50/order
- Payment processing (Stripe): 2.9% + $0.30

**Break-even:**
- 2 guitar sales = $99 covered + profit

## Next Steps

1. ✅ Create Inventory Source account
2. ✅ Apply to top 8 suppliers
3. ✅ Get approved (1-3 days)
4. ✅ Share API credentials
5. ✅ I'll build integration
6. ✅ Import products
7. ✅ Launch store

## Contact

- **Inventory Source Support:** support@inventory-source.com
- **Phone:** Available on their website
- **Live Chat:** During business hours

---

**Status:** Ready to execute tomorrow morning
