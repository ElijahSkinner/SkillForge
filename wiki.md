# **SkillForge Wiki (Internal)**

*Last Updated: September 2025*

---

## **1. Setup & Installation**

### **Development Environment Setup**

1. **Prerequisites**
   ```bash
   # Required tools
   node --version  # v18+ required
   npm --version   # Latest stable
   expo --version  # Expo CLI
   ```

2. **Clone & Install**
   ```bash
   git clone git@github.com:ElijahSkinner/SkillForge.git
   cd SkillForge
   npm install
   ```

3. **Environment Configuration**
    - Copy `.env.example` → `.env`
    - Configure Appwrite settings:
      ```env
      EXPO_PUBLIC_APPWRITE_ENDPOINT=http://your-ip:80/v1
      EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
      EXPO_PUBLIC_DATABASE_ID=your_database_id  
      EXPO_PUBLIC_COLLECTION_ID=your_collection_id
      ```

4. **Appwrite Database Setup**
    - Create `user_progress` collection
    - Configure attributes (see Database Schema section)
    - Set up authentication (email/password)
    - Enable real-time subscriptions

5. **Development Server**
   ```bash
   npm start           # Start Expo dev server
   npm run android     # Android emulator
   npm run ios         # iOS simulator  
   npm run web         # Web browser
   ```

### **Common Setup Issues**
- **Network connectivity:** Use `--tunnel` flag for remote device testing
- **Appwrite CORS:** Add your development domains to Appwrite console
- **iOS Simulator:** Requires Xcode on macOS
- **Android Emulator:** Requires Android Studio setup

---

## **2. Architecture Overview**

### **High-Level Architecture**
```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Mobile App    │ ←→ │   Appwrite   │ ←→ │    Database     │
│  (React Native)│    │   Backend    │    │ (user_progress) │
└─────────────────┘    └──────────────┘    └─────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│                Context Providers                            │
│  • AuthContext (Authentication & Progress)                 │
│  • ThemeContext (UI Themes & Persistence)                  │  
│  • CertContext (Course Management)                         │
└─────────────────────────────────────────────────────────────┘
```

### **App Structure**
```
app/
├── (auth)/                 # Authentication flow
│   ├── home.tsx           # Login/signup interface
│   ├── verify-email.tsx   # Email verification
│   └── forgot-password.tsx # Password reset
├── (tabs)/                # Main app navigation
│   ├── roadmap/          # Learning roadmap
│   ├── glossary/         # Study tools
│   ├── today/            # Daily review
│   ├── league/           # Leaderboards
│   └── profile/          # User profile
├── quiz/                 # Quiz system
│   └── [objective]/      # Dynamic quiz routes
└── settings/             # App configuration
```

### **Navigation Flow**
1. **Unauthenticated:** `/(auth)/home` → Login/Signup
2. **Authenticated:** `/(tabs)/roadmap` → Main app
3. **Course Selection:** `/(tabs)/course` → Pick certification
4. **Learning:** `/(tabs)/roadmap` → Module progression
5. **Study Tools:** `/(tabs)/glossary` → Flashcards & terms

---

## **3. Database Schema**

### **Primary Collection: `user_progress`**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `userID` | string | ✓ | Appwrite user account ID |
| `currentCert` | string | | Selected certification name |
| `xp` | integer | | Total experience points |
| `completedLessons` | array | | Array of lesson IDs: `[cert_moduleId_lessonIndex]` |
| `completedModules` | array | | Array of module IDs: `[cert_moduleId]` |
| `currentStreak` | integer | | Current daily study streak |
| `maxStreakAllTime` | integer | |