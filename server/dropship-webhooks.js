/**
 * Dropshipping Webhook Handlers
 * Handle order status updates from Spocket, Printful, and other suppliers
 */

const express = require('express')
const router = express.Router()

// ==========================================
// SPOCKET WEBHOOKS
// ==========================================

/**
 * Spocket Order Status Update
 * Triggered when order status changes (shipped, delivered, etc.)
 */
router.post('/webhooks/spocket/order-status', async (req, res) => {
  try {
    const { order_id, status, tracking_number, carrier } = req.body
    
    console.log('Spocket webhook received:', {
      order_id,
      status,
      tracking_number,
      carrier
    })
    
    // Update order in your database
    // await updateOrderStatus(order_id, {
    //   status,
    //   tracking_number,
    //   carrier,
    //   updated_at: new Date()
    // })
    
    // Send customer notification email
    if (status === 'shipped' && tracking_number) {
      // await sendShippingNotification(order_id, tracking_number, carrier)
      console.log(`Order ${order_id} shipped with tracking: ${tracking_number}`)
    }
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Spocket webhook error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Spocket Product Update
 * Triggered when product price or availability changes
 */
router.post('/webhooks/spocket/product-update', async (req, res) => {
  try {
    const { product_id, price, in_stock } = req.body
    
    console.log('Spocket product update:', {
      product_id,
      price,
      in_stock
    })
    
    // Update product in your database
    // await updateProduct(product_id, { price, in_stock })
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Spocket product webhook error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ==========================================
// PRINTFUL WEBHOOKS
// ==========================================

/**
 * Printful Order Status Update
 * Triggered when order status changes
 */
router.post('/webhooks/printful/order-status', async (req, res) => {
  try {
    const { type, data } = req.body
    
    console.log('Printful webhook received:', { type })
    
    switch (type) {
      case 'package_shipped':
        const { order_id, shipment } = data
        console.log(`Order ${order_id} shipped:`, shipment)
        
        // Update order with tracking
        // await updateOrderStatus(order_id, {
        //   status: 'shipped',
        //   tracking_number: shipment.tracking_number,
        //   carrier: shipment.carrier,
        //   tracking_url: shipment.tracking_url
        // })
        
        // Notify customer
        // await sendShippingNotification(order_id, shipment)
        break
        
      case 'package_delivered':
        console.log(`Order ${data.order_id} delivered`)
        // await updateOrderStatus(data.order_id, { status: 'delivered' })
        break
        
      case 'order_failed':
        console.error(`Order ${data.order_id} failed:`, data.reason)
        // Handle failed order - refund customer, send notification
        break
        
      case 'order_canceled':
        console.log(`Order ${data.order_id} canceled`)
        // await updateOrderStatus(data.order_id, { status: 'canceled' })
        break
    }
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Printful webhook error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ==========================================
// STRIPE WEBHOOKS (Payment Confirmation)
// ==========================================

/**
 * Stripe Payment Success
 * Triggered when customer completes payment
 * This is where you should create the dropship order
 */
router.post('/webhooks/stripe/payment-success', async (req, res) => {
  const sig = req.headers['stripe-signature']
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      
      console.log('Payment successful for session:', session.id)
      
      // Get order details from session metadata
      const cartItems = JSON.parse(session.metadata.cart)
      const customerInfo = {
        email: session.customer_email,
        name: session.customer_details.name,
        address: session.customer_details.address
      }
      
      // Filter dropship items
      const dropshipItems = cartItems.filter(item => item.fulfillment === 'dropship')
      
      if (dropshipItems.length > 0) {
        // Import dropshipping service (server-side version)
        const { createDropshipOrder } = require('../services/dropshippingService')
        
        // Create orders with suppliers
        const result = await createDropshipOrder({
          items: dropshipItems,
          customer: customerInfo,
          shippingAddress: customerInfo.address,
          paymentMethod: 'card'
        })
        
        if (result.success) {
          console.log('Dropship orders created:', result.orders)
          
          // Save order to database with dropship order IDs
          // await saveOrder({
          //   stripe_session_id: session.id,
          //   customer: customerInfo,
          //   items: cartItems,
          //   dropship_orders: result.orders,
          //   total: session.amount_total / 100,
          //   status: 'paid'
          // })
        } else {
          console.error('Dropship order creation failed:', result.error)
          // Handle failure - notify admin, refund customer, etc.
        }
      }
    }
    
    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    res.status(400).json({ error: error.message })
  }
})

// ==========================================
// ORDER TRACKING API
// ==========================================

/**
 * Get Order Tracking Info
 * Called from frontend to display tracking to customer
 */
router.get('/api/orders/:orderId/tracking', async (req, res) => {
  try {
    const { orderId } = req.params
    
    // Get order from database
    // const order = await getOrder(orderId)
    
    // Mock response for testing
    const order = {
      id: orderId,
      status: 'shipped',
      tracking_number: 'TN1234567890',
      carrier: 'USPS',
      tracking_url: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=TN1234567890',
      estimated_delivery: '2025-11-23',
      items: [
        {
          name: 'Guitar Strings 6-Pack',
          quantity: 1,
          supplier: 'Spocket',
          supplier_order_id: 'SPK-12345'
        }
      ]
    }
    
    res.json(order)
  } catch (error) {
    console.error('Tracking lookup error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get All Customer Orders
 * Display order history in app
 */
router.get('/api/orders/history/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params
    
    // Query database for customer's orders
    // const orders = await getOrdersByCustomer(customerId)
    
    // Mock response
    const orders = [
      {
        id: 'ORD-001',
        date: '2025-11-15',
        total: 79.97,
        status: 'delivered',
        items: [
          { name: 'Guitar Capo', quantity: 1, price: 14.99 },
          { name: 'Guitar Strings', quantity: 2, price: 29.99 }
        ]
      },
      {
        id: 'ORD-002',
        date: '2025-11-16',
        total: 39.99,
        status: 'shipped',
        tracking_number: 'TN9876543210',
        items: [
          { name: 'Distortion Pedal', quantity: 1, price: 39.99 }
        ]
      }
    ]
    
    res.json(orders)
  } catch (error) {
    console.error('Order history error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ==========================================
// WEBHOOK SETUP VERIFICATION
// ==========================================

/**
 * Test endpoint to verify webhooks are working
 */
router.get('/webhooks/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Webhook endpoint is active',
    endpoints: {
      spocket_order_status: '/webhooks/spocket/order-status',
      spocket_product_update: '/webhooks/spocket/product-update',
      printful_order_status: '/webhooks/printful/order-status',
      stripe_payment_success: '/webhooks/stripe/payment-success'
    }
  })
})

module.exports = router

// ==========================================
// SETUP INSTRUCTIONS
// ==========================================

/*
To set up webhooks in your suppliers:

1. SPOCKET:
   - Go to Spocket dashboard → Settings → Webhooks
   - Add webhook URL: https://yourdomain.com/webhooks/spocket/order-status
   - Select events: Order Shipped, Order Delivered
   - Add webhook URL: https://yourdomain.com/webhooks/spocket/product-update
   - Select events: Product Updated

2. PRINTFUL:
   - Go to Printful dashboard → Settings → Webhooks
   - Add webhook URL: https://yourdomain.com/webhooks/printful/order-status
   - Select events: package_shipped, package_delivered, order_failed, order_canceled

3. STRIPE:
   - Go to Stripe dashboard → Developers → Webhooks
   - Add endpoint: https://yourdomain.com/webhooks/stripe/payment-success
   - Select event: checkout.session.completed
   - Copy webhook signing secret to .env as STRIPE_WEBHOOK_SECRET

4. TEST:
   - Visit: https://yourdomain.com/webhooks/test
   - Should return { status: 'ok' }
   - Use Stripe CLI to test webhooks locally:
     stripe listen --forward-to localhost:3000/webhooks/stripe/payment-success
*/
