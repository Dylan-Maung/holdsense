# HoldSense

AI-powered route reading app for bouldering that analyzes holds and suggests sequences tailored to individual climber anthropometry.

## 🎯 Problem

Climbers struggle with route reading, especially when:
- Climbing alone without beta suggestions
- Working on newly set routes with no existing beta
- Finding sequences that work for their body proportions

## 💡 Solution

HoldSense provides instant, personalized route analysis using computer vision and ML.

## 🚀 Current Status

**MVP Development - v1.0**

### ✅ Completed
- [x] Project setup and development environment
- [x] Google OAuth authentication
- [x] JWT session management

### 🔄 Next Up
- [ ] Firebase integration (Firestore + Storage)
- [ ] User profile management
- [ ] Photo capture and upload
- [ ] Hold tagging interface
- [ ] Route storage and analysis

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Expo Router API routes
- **Auth:** Google OAuth
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage (photos), Expo SecureStore (mobile tokens)
- **Future:** TensorFlow.js for ML inference

## 📱 Installation
```bash
git clone https://github.com/Dylan-Maung/holdsense.git
cd holdsense
npm install
npm start
```

Scan QR code with Expo Go app to run on your device.

## 🙏 Acknowledgments

- OAuth authentication implementation based on Expo OAuth tutorial
  - Tutorial: https://www.youtube.com/watch?v=V2YdhR1hVNw
  - Code: https://github.com/betomoedano/expo-oauth-example

- Route protection structure based on Expo Router Auth Flow:
  - Tutorial: https://www.youtube.com/watch?v=yNaOaR2kIa0
  - Code: https://github.com/kadikraman/expo-router-example/tree/main/5-auth
```

## 📄 License

MIT
