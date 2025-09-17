
# **SkillForge Wiki (Internal)**

---

## **1. Setup & Installation**

**Steps:**

1. **Clone the repository**

   ```bash
   git clone git@github.com:ElijahSkinner/SkillForge.git
   cd skillforge
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Configure environment**

    * Copy `.env.example` → `.env`
    * Set Appwrite endpoint, project ID, database ID, collection ID, etc.
4. **Start Expo**

   ```bash
   npm run start
   ```

    * For Android: `npm run android`
    * For iOS: `npm run ios`
    * For Web: `npm run web`
5. **Testing**

    * Test login/signup flows using test accounts.
    * Ensure database reads/writes work.

---

## **2. Architecture**

**Overview:** Shows the high-level structure of the app.

**Components:**

* **Frontend:** React Native + Expo, uses Expo Router for navigation.
* **Backend:** Appwrite (Auth, Database, Storage if needed).
* **Context Providers:** `AuthProvider`, `CertProvider`, `ThemeProvider`.
* **Tabs:** `(tabs)` folder contains main navigation (`course`, `glossary`, `quiz`, `profile`, `roadmap`, `today`, `league`).

**Diagrams (Placeholder):**

```
[Mobile App] -- API --> [Appwrite Server]
       |                        |
   Auth / Progress             Database
```

---

## **3. Database Schema**

**Collection:** `user_progress`
**Attributes:**

* `userID` (string, required)
* `currentCert` (string)
* `xp` (integer, default 0)
* `completedLessons` (array of strings)
* `completedModules` (array of strings)
* `maxStreakAllTime` (integer, default 0)
* `currentStreak` (integer, default 0)

---

## **4. Features / Functionality**

**Tabs & Pages Overview:**

| Tab      | Description                                       |
| -------- | ------------------------------------------------- |
| Roadmap  | Displays the user’s learning roadmap and modules  |
| Course   | Select which course/cert to work on               |
| Glossary | Interactive flashcards and term lookup            |
| Quiz     | Questions for selected certifications             |
| Profile  | Shows streak, XP, achievements, and settings link |
| Today    | Recent progress and mistakes                      |
| League   | Leaderboard by XP / score                         |

**Additional Features:**

* Streak tracking and updates.
* User progress saved per account.
* Achievements and badges.

---

## **5. Testing**

**Local Testing:**

* Run app via Expo (web, iOS, Android).
* Test login/signup, progress creation, and updates.

**Automated Tests:**

* TBD / future integration with Jest or Detox.

**Test Accounts:**

* Placeholder account details for dev testing (internal use only).

---

## **6. Troubleshooting / Common Issues**

* **Appwrite 401 Unauthorized:**

    * Ensure correct API endpoint & project ID in `.env`.
    * Verify active session or login.
    * Check if expo is running with or w/o `--tunnel`
* **Expo Tunnel Issues:**

    * Use LAN or localhost mode to test connectivity.
* **GitHub Auto-Push Failures:**

    * SSH key must be added to GitHub account.
    * Ensure WebStorm SSH settings are configured.
    * Set auth to https instead of ssh then login to GitHub in Webstorm
* **Dependencies / NPM Warnings:**

    * Resolve conflicting versions for AsyncStorage, Firebase.

---

## **7. Contribution Guidelines**

* Follow branching strategy: `main` for production, `dev` for development.
* Commit messages:

  ```
  feat: Add login page
  fix: Correct streak update bug
  docs: Update README
  ```
* Pull Request workflow:

    * PRs must pass local build/test.
    * Review and approve before merge.

---

## **8. Roadmap**

* **Short-term:** Decide basic theme, create Network+ content, create xp tracking.
* **Medium-term:** Add friends system, share progress, .
* **Long-term:** Analytics dashboard, additional certifications, push notifications.

---

## **9. Changelog**

* **v1.0.0** - Initial working version with Auth, Roadmap, Profile, Tabs.
* **v1.1.0** - Added Streak tracking, XP updates, Quiz page scaffold.
* **v1.2.0** - UI improvements, Settings and Logout modal.

