/**
 * Enable Premium Access for Testing
 * 
 * Run this in your browser console when the app is open to enable premium features
 * 
 * Usage:
 * 1. Open app in browser (localhost or deployed)
 * 2. Press F12 to open DevTools
 * 3. Go to Console tab
 * 4. Paste this code and press Enter
 */

// Enable premium dev flag
localStorage.setItem('fretpilot-flags', JSON.stringify({ 
  'premium-dev': true,
  premium: true 
}));

console.log('✅ Premium access enabled! Reload the page.');
console.log('To disable: localStorage.removeItem("fretpilot-flags")');
