# iOS Build & Submission Checklist (FretPilot)

> Perform these steps on macOS with Xcode and CocoaPods installed.

## 1. Prerequisites

- Apple Developer account (App Store Connect access)
- Xcode (latest stable)
- Command Line Tools installed (`xcode-select --install`)
- Node.js & npm installed
- CocoaPods: `sudo gem install cocoapods`
- Ensure `ios/App/Podfile` exists (already in repo)

## 2. Install Dependencies & Sync

```bash
npm ci
npm run build
npx cap sync ios
```

## 3. Open Workspace

```bash
npx cap open ios
```

This opens Xcode. Use the `.xcworkspace` (Capacitor + Pods).

## 4. Configure App Metadata

In Xcode:

- Set Bundle Identifier: `com.fretpilot.app`
- Team: Your developer team
- Deployment target (e.g., iOS 15.0)
- App Version & Build (align with `package.json`)

## 5. Update Icons & Splash (if changed)

Run resource generation if needed:

```bash
npx capacitor-resources ios --skipUpdate
```

Verify assets in Xcode asset catalogs.

## 6. In‑App Purchase Setup (Future Work)

Currently premium purchases are disabled for iOS (Bitcoin fallback only). To enable native IAP:

1. In App Store Connect → Features → In‑App Purchases.
2. Create products matching Android product IDs (monthly, yearly, lifetime).
3. Integrate StoreKit (or use a Capacitor purchase plugin) and adapt `PremiumGate.vue` for iOS path.
4. Submit for review with proper entitlement description.

## 7. Archive Build

In Xcode:

- Select a Generic iOS Device (or Any iOS Device)
- Product → Archive
- Wait for archive to appear in Organizer

## 8. Validate Archive

In Organizer:

- Select the new archive
- Click "Validate" (fix any issues)

## 9. Upload to App Store Connect

Click "Distribute App" → App Store Connect → Upload.

## 10. App Store Connect Configuration

In App Store Connect:

- Create the App record (if not created yet)
- Provide: Name (FretPilot), Primary language, SKU, Bundle ID
- Add screenshots (iPhone 6.7", 6.5", 5.5", iPad if targeting)
- Add promotional text, description, keywords
- Set pricing (Free or implement subscription later)
- Add support URL & marketing URL
- Configure App Privacy (data you collect; analytics minimal for now)

## 11. TestFlight (Optional)

- Add internal testers
- Submit build to TestFlight

## 12. App Review Notes

Since Bitcoin payments are external and IAP disabled:

- Clarify that digital premium content via card is not purchasable in iOS build yet; only Bitcoin is offered (or remove mention if restricting features).
- Ensure you do NOT link to external purchase pages for digital content—comply with Apple guidelines.

## 13. Post-Approval Steps

- Re-enable subscription logic for iOS through native IAP implementation.
- Update marketing site to reflect iOS availability.

## 14. Versioning

Tag releases using `./tag-release.ps1 -Level patch` from main before building, then increment Xcode version/build to match.

## 15. Troubleshooting

| Issue | Resolution |
|-------|------------|
| Pods fail to install | `pod repo update` then `pod install` |
| Build fails with signing | Ensure correct Team + provisioning profile auto-managed |
| Binary rejected for missing privacy details | Complete App Privacy questionnaire fully |
| Bitcoin feature questioned | Provide explanation: optional decentralized payment for lifetime access; no bypass of IAP for subscription until native IAP integrated. |

## 16. Security Review

- Ensure no live secret keys inside the iOS bundle (only public Stripe key allowed)
- Confirm `.env` is not shipped with private keys

---

**Ready:** After successful upload and App Store configuration you can submit for review.
