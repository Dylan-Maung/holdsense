# HoldSense

AI-powered route reading app for bouldering that analyzes holds and suggests sequences tailored to individual climber anthropometry.

## 🎯 Problem

Climbers struggle with route reading, especially when:
- Climbing alone without beta suggestions
- **Working on newly set gym routes** - most routes never get community beta
  - Commercial gyms reset routes on average every 4-8 weeks
  - By the time someone uploads beta, routes are already gone
  - Only popular grades get beta documented
  - Standardized boards (Kilter, Tension, Moon) have good coverage but gym routes don't
- **Beta doesn't account for body type differences**
  - What works for tall climbers may not work for shorter climbers
  - Ape index significantly affects reachability
  - Existing beta is one-size-fits-all

## 💡 Solution

HoldSense provides **instant, personalized** beta for any route using computer vision and ML. 

No waiting for community uploads. No hoping someone at your gym climbs it first. No trying to adapt beta meant for different body types.

## 🚀 Current Status

**MVP Development - v1.0**

### ✅ Completed
- [x] Google OAuth authentication
- [x] JWT session management
- [x] Firebase integration (Firestore + Storage)
- [x] Multi-step route documentation flow
- [x] Photo upload and storage
- [x] Hold metadata tagging (type, usage, orientation, color, etc.)
- [x] Wall metadata tagging (angle, top out, etc.)
- [x] Hold position mapping on wall images
- [x] Route storage and retrieval

### 🔄 In Progress
- [ ] LLM integration for beta generation (placeholder before custom model)

### 📋 Upcoming
- [ ] Refine position accuracy/validation
- [ ] Computer vision for automatic hold detection
- [ ] User correction interface for Computer Vision predictions
- [ ] Custom ML model training on collected data
- [ ] Visual step-by-step beta display

### 🔮 Future Enhancements
- [ ] User profile editing
- [ ] In-app photo capture (currently upload only)
- [ ] Community beta sharing
- [ ] Achievement tracking & progression analytics
  - Grade progression over time
  - Send distribution by grade
  - Personal records & milestones


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
  - Tutorial: https://www.youtube.com/watch?v=zHZjJDTTHJg
  - Code: https://github.com/kadikraman/expo-router-example/tree/main/6-protected-routes
```

## 📄 License

MIT
