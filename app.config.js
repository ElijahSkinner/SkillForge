// app.config.js
import 'dotenv/config';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export default {
    "expo": {
        "name": "SkillForge",
        "slug": "skillforge",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/images/new-logo.png",
        "scheme": process.env.EXPO_PUBLIC_DEEP_LINK_SCHEME || "skillforge",
        "userInterfaceStyle": "automatic",
        "newArchEnabled": true,
        "privacy": "unlisted",
        "platforms": ["ios", "android", "web"],

        // iOS Configuration
        "ios": {
            "supportsTablet": true,
            "bundleIdentifier": "com.elijahskinner.skillforge",
            "buildNumber": "1.0.0",
            "infoPlist": {
                "NSCameraUsageDescription": "This app uses the camera to scan QR codes for quick course access.",
                "NSLocationWhenInUseUsageDescription": "Location is used to provide personalized study recommendations."
            }
        },

        // Android Configuration
        "android": {
            "adaptiveIcon": {
                "backgroundColor": "#E6F4FE",
                "foregroundImage": "./assets/images/android-icon-foreground.png",
                "backgroundImage": "",
                "monochromeImage": "./assets/images/android-icon-monochrome.png"
            },
            "package": "com.elijahskinner.skillforge",
            "versionCode": 1,
            "edgeToEdgeEnabled": true,
            "predictiveBackGestureEnabled": false,
            "permissions": [
                "android.permission.INTERNET",
                "android.permission.SYSTEM_ALERT_WINDOW",
                "android.permission.VIBRATE",
                "android.permission.RECEIVE_BOOT_COMPLETED",
                "android.permission.SCHEDULE_EXACT_ALARM"
            ]
        },

        // Web Configuration
        "web": {
            "output": "static",
            "favicon": "./assets/images/favicon.png",
            "bundler": "metro"
        },

        // Plugins
        "plugins": [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/new-logo.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#ffffff",
                    "dark": {
                        "backgroundColor": "#000000"
                    }
                }
            ],
            [
                "expo-notifications",
                {
                    "icon": "./assets/images/notification-icon.png",
                    "color": "#ffffff",
                    "sounds": ["./assets/sounds/notification.wav"]
                }
            ]
        ],

        // Experiments
        "experiments": {
            "typedRoutes": true,
            "reactCompiler": true
        },

        // Updates and Builds
        "updates": {
            "url": "https://u.expo.dev/68c99e72-002c-3fb2-1bdf" // You'll get this when setting up EAS
        },

        // Runtime version for updates
        "runtimeVersion": {
            "policy": "sdkVersion"
        },

        // Extra configuration passed to the app
        "extra": {
            "environment": IS_PRODUCTION ? "production" : "development",
            "appwrite_endpoint": process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
            "appwrite_project_id": process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
            "database_id": process.env.EXPO_PUBLIC_DATABASE_ID,
            "collection_id": process.env.EXPO_PUBLIC_COLLECTION_ID,
            "app_name": process.env.EXPO_PUBLIC_APP_NAME || "SkillForge",
            "app_version": process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0",
            "deep_link_scheme": process.env.EXPO_PUBLIC_DEEP_LINK_SCHEME || "skillforge",
            "deep_link_url": process.env.EXPO_PUBLIC_DEEP_LINK_URL || "https://elijahskinner.com",
            "eas": {
                "projectId": "81ebdcb7-ef55-4ae8-a4b3-d00815a2eb9e"
            }
        }
    }
};