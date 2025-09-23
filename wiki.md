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
| `maxStreakAllTime` | integer | | Highest streak ever achieved |
| `selectedTheme` | string | | UI theme: `forge`, `space`, `ocean` |
| `darkModeEnabled` | boolean | | Light/dark mode preference |
| `enrolledCourses` | array | | JSON strings of enrolled courses |
| `dailyGoalXP` | integer | | Target XP per day (default: 50) |
| `weeklyGoalXP` | integer | | Target XP per week (default: 350) |
| `studyTimeMinutes` | integer | | Total study time tracked |
| `lastActiveDate` | string | | ISO date of last activity |
| `notificationsEnabled` | boolean | | Push notification preference |
| `reminderTime` | string | | Daily reminder time (HH:MM format) |
| `soundEnabled` | boolean | | Audio feedback preference |
| `language` | string | | App language (default: "en") |
| `timezone` | string | | User timezone for streak calculations |
| `achievements` | array | | Unlocked achievement IDs |
| `badgesEarned` | array | | Badge collection |
| `mistakesReview` | array | | Questions marked for review |
| `friendsList` | array | | Connected user IDs |
| `friendRequests` | array | | Pending friend requests |
| `leagueRank` | integer | | Current league position |
| `weeklyXP` | integer | | XP earned this week |

### **Data Relationships**
- **User → Progress:** One-to-one relationship via `userID`
- **Lessons:** Identified by `{cert}_{moduleId}_{lessonIndex}` format
- **Modules:** Identified by `{cert}_{moduleId}` format
- **Courses:** Stored as JSON strings in `enrolledCourses` array

### **Sample Data Structure**
```json
{
  "userID": "64f8a1b2c3d4e5f6789012",
  "currentCert": "CompTIA Network+",
  "xp": 1250,
  "completedLessons": [
    "CompTIA Network+_1_1",
    "CompTIA Network+_1_2",
    "CompTIA Network+_1_3"
  ],
  "completedModules": [],
  "currentStreak": 7,
  "maxStreakAllTime": 15,
  "selectedTheme": "forge",
  "darkModeEnabled": true,
  "dailyGoalXP": 75,
  "reminderTime": "19:00",
  "notificationsEnabled": true,
  "lastActiveDate": "2025-09-23T10:30:00.000Z"
}
```

---

## **4. Features & Functionality**

### **Core Learning System**

| Feature | Status | Description |
|---------|--------|-------------|
| **Authentication** | ✅ Complete | Email/password with Appwrite |
| **Roadmap** | ✅ Complete | Visual module progression |
| **Quiz System** | ✅ Complete | Multiple question types |
| **Progress Tracking** | ✅ Complete | XP, streaks, completion |
| **Glossary** | ✅ Complete | Flashcards and term lookup |
| **Themes** | ✅ Complete | 3 themes with light/dark modes |

### **Tab Navigation Overview**

| Tab | Route | Purpose | Key Features |
|-----|-------|---------|--------------|
| **Roadmap** | `/(tabs)/roadmap` | Main learning interface | Module tiles, progress rings, lesson selection |
| **Glossary** | `/(tabs)/glossary` | Study tools | Flashcards, terms, acronyms, ports |
| **Today** | `/(tabs)/today` | Daily review | Quick actions, mistake review, recent progress |
| **League** | `/(tabs)/league` | Competition | XP leaderboards, league tiers |
| **Profile** | `/(tabs)/profile` | User stats | Streaks, achievements, overview |

### **Quiz System Architecture**
- **Question Types:** Multiple choice, true/false, fill-blank, drag-drop, scenarios
- **Quiz Structure:** Domain-based organization (1.1, 1.2, etc.)
- **Dual Quizzes:** QuizA and QuizB for each objective
- **Progress Integration:** XP rewards, completion tracking
- **Navigation:** Dynamic routing via `[objective]/[quizType]`

### **Streak & Gamification**
- **Daily Streaks:** Automatic tracking with timezone support
- **XP System:** Points for lesson completion and quiz performance
- **League System:** 10-tier ranking from Copper to Mithril
- **Background Service:** Streak maintenance and notifications
- **Smart Reminders:** Context-aware study prompts

### **Theme System**
- **Multi-Theme Support:** Forge (fire/steel), Space (cosmic), Ocean (marine)
- **Light/Dark Modes:** Complete color schemes for each theme
- **Persistent Settings:** Theme preferences saved to database
- **Dynamic Switching:** Real-time theme changes without restart

---

## **5. Development Workflows**

### **Adding New Content**

1. **New Quiz Questions**
   ```typescript
   // constants/quizData.ts
   export const DOMAIN_X_QUIZZES: Record<string, QuizType> = {
     "X.Y": {
       quizA: {
         title: "Topic Name - Quiz A",
         questions: [/* question objects */]
       }
     }
   }
   ```

2. **New Lessons**
   ```typescript
   // constants/lessonContent.ts
   export const LESSON_CONTENT: Record<string, any> = {
     "X.Y": {
       title: "Lesson Title",
       objective: "Learning objective",
       content: {/* lesson content */}
     }
   }
   ```

3. **New Certifications**
   ```typescript
   // constants/certs.ts
   export const CERTS_ROADMAP: Record<string, ModuleType[]> = {
     'New Certification': [/* modules array */]
   }
   ```

### **Testing Procedures**

**Local Testing Checklist:**
- [ ] Authentication flow (login/signup/logout)
- [ ] Progress persistence across app restarts
- [ ] Theme switching and persistence
- [ ] Quiz completion and XP updates
- [ ] Streak tracking and notifications
- [ ] Cross-platform compatibility (iOS/Android/Web)

**Device Testing:**
```bash
# iOS Simulator
npm run ios

# Android Emulator  
npm run android

# Physical Device (requires Expo Go app)
npm start
# Scan QR code with device
```

### **Deployment Process**

1. **Development Build**
   ```bash
   eas build --profile development --platform all
   ```

2. **Preview Build**
   ```bash
   eas build --profile preview --platform all
   ```

3. **Production Build**
   ```bash
   eas build --profile production --platform all
   ```

4. **App Store Submission**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

---

## **6. Troubleshooting Guide**

### **Common Development Issues**

**Authentication Errors (401 Unauthorized):**
```bash
# Check Appwrite configuration
echo $EXPO_PUBLIC_APPWRITE_ENDPOINT
echo $EXPO_PUBLIC_APPWRITE_PROJECT_ID

# Verify network connectivity
curl -v $EXPO_PUBLIC_APPWRITE_ENDPOINT/health

# Clear Expo cache
npx expo start --clear
```

**Database Connection Issues:**
- Verify collection exists and has correct attributes
- Check user permissions in Appwrite console
- Ensure database ID matches environment variables
- Validate query syntax and indexes

**Theme Loading Problems:**
- Check theme file imports in `ThemeContext.tsx`
- Verify asset paths in theme definitions
- Clear React Native cache: `npx react-native start --reset-cache`

**Quiz Navigation Errors:**
- Ensure quiz data exists for requested objective
- Check dynamic route parameter parsing
- Verify quiz type (quizA/quizB) is valid

**Streak Calculation Issues:**
- Check timezone configuration in user profile
- Verify `lastActiveDate` format (ISO string)
- Review background service initialization
- Test notification permissions

### **Performance Optimization**

**Memory Management:**
- Monitor component re-renders with React DevTools
- Optimize large lists with `FlatList` and `getItemLayout`
- Implement image caching for theme assets
- Use `useMemo` and `useCallback` for expensive calculations

**Bundle Size Reduction:**
- Enable Hermes JavaScript engine
- Remove unused dependencies
- Optimize image assets (WebP format)
- Implement code splitting for quiz content

---

## **7. API Integration**

### **Appwrite Services Used**

**Authentication Service:**
```typescript
// User registration with email verification
account.create(ID.unique(), email, password, name)
account.createVerification(verificationUrl)

// Session management  
account.createEmailPasswordSession(email, password)
account.get() // Get current user
account.deleteSession("current") // Logout
```

**Database Service:**
```typescript
// Progress document operations
databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), data)
databases.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, updates)
databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal("userID", userId)])
```

**Real-time Subscriptions:**
```typescript
// Listen for progress updates
client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, 
  (response) => {
    // Handle real-time updates
  }
)
```

### **External Services Integration**

**Notification Service:**
- Expo Notifications for cross-platform push notifications
- Background task scheduling for streak reminders
- Permission handling and notification settings

**Analytics (Future):**
- User engagement tracking
- Learning pattern analysis
- Performance metrics collection

---

## **8. Security & Privacy**

### **Data Protection**
- **Encryption:** All API communication over HTTPS/WSS
- **Authentication:** Secure session tokens with expiration
- **Data Validation:** Input sanitization and type checking
- **Privacy:** Minimal data collection, user consent required

### **Security Best Practices**
- Environment variables for sensitive configuration
- No hardcoded credentials in source code
- Regular dependency updates and security audits
- User data anonymization in analytics

---

## **9. Contribution Guidelines**

### **Code Standards**
- **TypeScript:** Strict mode enabled, proper type definitions
- **Naming:** camelCase for variables, PascalCase for components
- **File Structure:** Feature-based organization with clear boundaries
- **Comments:** JSDoc for complex functions, inline for clarity

### **Git Workflow**
```bash
# Feature development
git checkout -b feat/quiz-timer-functionality
git commit -m "feat: Add configurable quiz timer"
git push origin feat/quiz-timer-functionality

# Bug fixes
git checkout -b fix/streak-calculation-timezone
git commit -m "fix: Correct streak calculation for different timezones"
```

### **Pull Request Process**
1. **Feature branch** from `main`
2. **Test thoroughly** on multiple platforms
3. **Update documentation** for new features
4. **Request review** from team members
5. **Merge** after approval and CI passes

---

## **10. Project Roadmap**

### **Current Version: 1.2.0**
- ✅ Complete authentication system
- ✅ Interactive roadmap with progress tracking
- ✅ Comprehensive quiz system (5 question types)
- ✅ Multi-theme system with persistence
- ✅ Streak tracking and gamification
- ✅ Glossary with flashcards

### **Version 1.3.0 (Next Release)**
- [ ] Push notifications and background services
- [ ] Enhanced quiz explanations and references
- [ ] Performance optimizations for large datasets
- [ ] Accessibility improvements (screen readers, high contrast)
- [ ] Additional Network+ content (domains 3-5)

### **Version 1.5.0 (Q1 2025)**
- [ ] Second certification track (CompTIA Security+)
- [ ] Social features (friends, study groups)
- [ ] AI-powered study recommendations
- [ ] Offline mode with background sync
- [ ] Advanced analytics dashboard

### **Version 2.0.0 (Q2 2025)**
- [ ] Multiple certification programs
- [ ] Adaptive learning algorithms
- [ ] Corporate training features
- [ ] Advanced reporting and insights
- [ ] White-label customization options

---

## **11. Changelog**

### **v1.2.0 (September 2025)**
- **Added:** Complete quiz system with 5 question types
- **Added:** Dynamic quiz routing and navigation
- **Added:** Comprehensive Network+ Domain 1 content
- **Added:** Background streak service with smart notifications
- **Added:** Multi-theme system (Forge, Space, Ocean)
- **Improved:** Performance optimizations for large datasets
- **Fixed:** Theme persistence across app restarts
- **Fixed:** Streak calculation edge cases

### **v1.1.0 (August 2025)**
- **Added:** User authentication with Appwrite
- **Added:** Progress tracking and XP system
- **Added:** Basic roadmap interface
- **Added:** Profile management and settings
- **Added:** League system with tier rankings

### **v1.0.0 (July 2025)**
- **Initial planning** with core functionality
- Basic navigation and UI framework
- Firebase and GitHub configuration
- Simple progress tracking

---

*For technical support or questions, consult the main README.md or create an issue in the GitHub repository.*