// config/AppConfig.ts
import Constants from 'expo-constants';

interface AppConfig {
    appwrite: {
        endpoint: string;
        projectId: string;
        databaseId: string;
        collectionId: string;
    };
    app: {
        name: string;
        version: string;
        deepLinkScheme: string;
        deepLinkUrl: string;
    };
    isDev: boolean;
    isProduction: boolean;
}

// Fallback values for development (never use in production)
const DEV_CONFIG = {
    endpoint: "http://elijahskinner.com/v1",
    projectId: "68c99e72002c3fb21bdf",
    databaseId: "68c9a6a6000cf7733309",
    collectionId: "68c9a6b7002dfd514488"
};

class ConfigService {
    private config: AppConfig;

    constructor() {
        const isDev = __DEV__;
        const isProduction = Constants.expoConfig?.extra?.environment === 'production';

        // Validate required environment variables
        const requiredVars = [
            'EXPO_PUBLIC_APPWRITE_ENDPOINT',
            'EXPO_PUBLIC_APPWRITE_PROJECT_ID',
            'EXPO_PUBLIC_DATABASE_ID',
            'EXPO_PUBLIC_COLLECTION_ID'
        ];

        const missingVars = requiredVars.filter(
            varName => !Constants.expoConfig?.extra?.[varName.replace('EXPO_PUBLIC_', '').toLowerCase()]
        );

        if (missingVars.length > 0 && isProduction) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        this.config = {
            appwrite: {
                endpoint: this.getEnvVar('APPWRITE_ENDPOINT') || (isDev ? DEV_CONFIG.endpoint : ''),
                projectId: this.getEnvVar('APPWRITE_PROJECT_ID') || (isDev ? DEV_CONFIG.projectId : ''),
                databaseId: this.getEnvVar('DATABASE_ID') || (isDev ? DEV_CONFIG.databaseId : ''),
                collectionId: this.getEnvVar('COLLECTION_ID') || (isDev ? DEV_CONFIG.collectionId : ''),
            },
            app: {
                name: this.getEnvVar('APP_NAME') || 'SkillForge',
                version: this.getEnvVar('APP_VERSION') || '1.0.0',
                deepLinkScheme: this.getEnvVar('DEEP_LINK_SCHEME') || 'skillforge',
                deepLinkUrl: this.getEnvVar('DEEP_LINK_URL') || 'https://elijahskinner.com',
            },
            isDev,
            isProduction
        };

        // Log configuration in development
        if (isDev) {
            console.log('App Configuration:', {
                ...this.config,
                appwrite: {
                    ...this.config.appwrite,
                    // Don't log sensitive IDs in production logs
                    endpoint: this.config.appwrite.endpoint,
                    projectId: this.config.appwrite.projectId.slice(0, 8) + '...',
                }
            });
        }
    }

    private getEnvVar(key: string): string {
        // Try Constants.expoConfig.extra first (from app.config.js)
        const value = Constants.expoConfig?.extra?.[key.toLowerCase()] ||
            // Fallback to process.env for web/dev
            process.env[`EXPO_PUBLIC_${key}`];

        return value || '';
    }

    get appwrite() {
        return this.config.appwrite;
    }

    get app() {
        return this.config.app;
    }

    get isDev() {
        return this.config.isDev;
    }

    get isProduction() {
        return this.config.isProduction;
    }

    // Method to validate configuration
    validateConfig(): boolean {
        const { appwrite } = this.config;

        if (!appwrite.endpoint || !appwrite.projectId || !appwrite.databaseId || !appwrite.collectionId) {
            console.error('Invalid Appwrite configuration');
            return false;
        }

        // Validate endpoint format
        try {
            new URL(appwrite.endpoint);
        } catch {
            console.error('Invalid Appwrite endpoint URL');
            return false;
        }

        return true;
    }
}

export const appConfig = new ConfigService();
export default appConfig;