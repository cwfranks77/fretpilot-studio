# FretPilot – Complete AI Guitar Learning Platform

**AI-Powered Video Lessons • Practice Tracking • Music Store • Live Jam Companion**

FretPilot is a comprehensive guitar learning application featuring AI-powered video lessons with real-time pose detection, personalized practice plans, an integrated music store, and a tiered subscription model. Built with Vue 3, Capacitor, and Node.js.

---

## ✨ Key Features

### 🎓 AI Video Lessons
- **Real-time pose detection** - Computer vision analyzes hand position
- **Adaptive difficulty** - AI adjusts lesson complexity based on performance
- **Interactive hotspots** - Contextual tips appear at key moments
- **Personalized recommendations** - AI suggests next lessons
- **Custom lesson plans** - AI-generated curriculum (Pro tier)
- **Offline downloads** - Practice anywhere (Premium+)

### 🎯 Practice & Training
- **FretPilot Trainer** - Interactive fretboard learning
- **AI Lesson Generator** - Custom practice routines
- **Practice Analyzer** - Identifies weaknesses
- **Jam Companion** - AI backing tracks
- **Mistake Heatmap** - Visual problem areas

### 🛒 Music Store
- Integrated e-commerce (FretPilot-fulfilled, dropship, affiliate)
- Stripe payment processing
- Order tracking and history

### 🎼 Essential Tools
- Metronome, tuner, chord library, scale explorer

---

## 💰 Subscription Tiers

- **Free**: 3 lessons/day, basic features
- **Premium ($9.99/mo)**: Unlimited lessons, AI analysis, pose detection, offline downloads
- **Pro ($19.99/mo)**: Custom lesson plans, 1-on-1 coaching, priority support, certificates

---

## 🚀 Quick Start

### Development
```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Start backend API
cd server
node index.js
```

Visit `http://localhost:5173`

### Build for Android
```powershell
# Build web app
npm run build

# Sync to Capacitor
npx cap sync android

# Build APK
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📂 Project Structure

```
fretpilot/
├── src/
│   ├── components/          # Vue components
│   │   ├── AIVideoLessons.vue
│   │   ├── FretPilotTrainer.vue
│   │   ├── MusicStore.vue
│   │   └── ...
│   ├── services/            # Business logic
│   │   ├── subscriptionService.js
│   │   ├── orderService.js
│   │   └── ...
│   └── App.vue
├── server/
│   └── index.js            # Express API
├── android/                # Android native
└── DEPLOYMENT_GUIDE.md     # Complete deployment docs
```

---

## 🛠️ Tech Stack

- **Vue 3** - Frontend framework
- **Vite** - Build tool
- **Capacitor** - Mobile wrapper
- **Node.js + Express** - Backend API
- **Stripe** - Payments
- **TensorFlow.js** (planned) - AI pose detection

---

## 🔐 Environment Setup

Create `.env` file:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Server
PORT=5175
NODE_ENV=development

# Optional
OPENAI_API_KEY=...
```

---

## 📖 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete setup, deployment, and scaling guide
- **[LAUNCH_GUIDE.md](./LAUNCH_GUIDE.md)** - Feature walkthrough and launch checklist

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

Copyright © 2025 FretPilot. All rights reserved.

---

## 📞 Support

- **Users**: support@fretpilot.com
- **Developers**: developer@fretpilot.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/fretpilot/issues)

---

**Made with ❤️ by musicians, for musicians**

🎸 Start your guitar journey today with FretPilot! 🎸