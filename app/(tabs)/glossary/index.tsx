// app/(tabs)/glossary/index.tsx - Enhanced with better theme integration
import React, { useState, useEffect } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useCert } from '../../../context/CertContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Flashcards from './Flashcards';
import { useTheme } from '../../../context/ThemeContext';
import { ThemedView, ThemedText } from '../../../components/themed';
import {
    GLOSSARY_TERMS,
    GLOSSARY_ACRONYMS_BY_OBJECTIVE,
    GLOSSARY_PORTS,
} from '../../../constants/glossary';
import CourseRedirect from '../../../components/CourseRedirect';

// Dynamic objectives based on selected certification
const getObjectivesForCert = (certName: string | null, tab: 'terms' | 'acronyms' | 'ports') => {
    if (!certName || tab === 'ports') return [];

    if (tab === 'terms') {
        return Object.keys(GLOSSARY_TERMS[certName] || {});
    } else if (tab === 'acronyms') {
        return Object.keys(GLOSSARY_ACRONYMS_BY_OBJECTIVE[certName] || {});
    }

    return [];
};

// Create themed styles using theme values
const createStyles = (theme: any) => ({
    container: {
        flex: 1,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background,
    },

    // Tab Container Styles
    tabContainer: {
        flexDirection: 'row' as const,
        marginBottom: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xs,
        backgroundColor: theme.colors.surfaceVariant,
        ...theme.shadows.small,
    },

    tabButton: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        alignItems: 'center' as const,
        marginHorizontal: theme.spacing.xs,
        transition: 'all 0.2s ease',
    },

    tabButtonActive: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.medium,
        transform: [{ scale: 1.02 }],
    },

    tabButtonInactive: {
        backgroundColor: 'transparent',
    },

    tabText: {
        fontSize: theme.typography.body1.fontSize,
        fontWeight: '600' as const,
        textAlign: 'center' as const,
    },

    tabTextActive: {
        color: theme.colors.textOnPrimary,
    },

    tabTextInactive: {
        color: theme.colors.text,
    },

    // Objective Cards
    objectivesContainer: {
        flex: 1,
    },

    objectiveCard: {
        marginBottom: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        ...theme.shadows.small,
        // Add hover effect simulation
        activeOpacity: 0.8,
    },

    objectiveContent: {
        flex: 1,
    },

    objectiveTitle: {
        ...theme.typography.body1,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },

    objectiveFooter: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
    },

    itemCount: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },

    // Empty state styles
    emptyContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: theme.spacing.xxl,
    },

    emptyText: {
        ...theme.typography.body1,
        color: theme.colors.textMuted,
        textAlign: 'center' as const,
    },

    // View Mode Section
    viewModeContainer: {
        marginBottom: theme.spacing.md,
    },

    viewModeHeader: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.round,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.small,
    },

    selectedObjectiveTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        flex: 1,
    },

    viewModeToggle: {
        flexDirection: 'row' as const,
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xs,
    },

    toggleButton: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center' as const,
        borderRadius: theme.borderRadius.sm,
        marginHorizontal: theme.spacing.xs,
    },

    toggleButtonActive: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.small,
    },

    toggleText: {
        ...theme.typography.body2,
        fontWeight: '600',
    },

    toggleTextActive: {
        color: theme.colors.textOnPrimary,
    },

    toggleTextInactive: {
        color: theme.colors.text,
    },

    // List View Styles
    listContainer: {
        flex: 1,
    },

    listItem: {
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.small,
    },

    listItemTerm: {
        ...theme.typography.body1,
        fontWeight: '700',
        color: theme.colors.primary,
        marginBottom: theme.spacing.xs,
    },

    listItemDefinition: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
});

export default function GlossaryScreen() {
    const { selectedCert } = useCert();
    const { theme } = useTheme();
    const [tab, setTab] = useState<'terms' | 'acronyms' | 'ports'>('terms');
    const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'flashcards'>('list');
    const [flashcards, setFlashcards] = useState<
        { term?: string; acronym?: string; port?: string; definition: string }[]
    >([]);

    // Create styles based on current theme
    const styles = createStyles(theme);

    useEffect(() => {
        if (!selectedCert) return;

        if (tab === 'terms' && selectedObjective) {
            setFlashcards(GLOSSARY_TERMS[selectedCert]?.[selectedObjective] ?? []);
        } else if (tab === 'acronyms' && selectedObjective) {
            setFlashcards(GLOSSARY_ACRONYMS_BY_OBJECTIVE[selectedCert]?.[selectedObjective] ?? []);
        } else if (tab === 'ports') {
            setFlashcards(GLOSSARY_PORTS[selectedCert] ?? []);
            setSelectedObjective('all_ports');
        }
    }, [tab, selectedObjective, selectedCert]);

    if (!selectedCert) {
        return <CourseRedirect />;
    }

    const renderTabButtons = () => (
        <View style={styles.tabContainer}>
            {['terms', 'acronyms', 'ports'].map((t) => {
                const isActive = tab === t;
                return (
                    <Pressable
                        key={t}
                        style={[
                            styles.tabButton,
                            isActive ? styles.tabButtonActive : styles.tabButtonInactive,
                        ]}
                        onPress={() => {
                            setTab(t as any);
                            setSelectedObjective(t === 'ports' ? 'all_ports' : null);
                            setViewMode('list');
                        }}
                    >
                        <ThemedText
                            style={[
                                styles.tabText,
                                isActive ? styles.tabTextActive : styles.tabTextInactive,
                            ]}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </ThemedText>
                    </Pressable>
                );
            })}
        </View>
    );

    const renderObjectiveCards = () => {
        if (tab === 'ports' || selectedObjective) return null;

        // Get dynamic objectives for the current cert and tab
        const objectives = getObjectivesForCert(selectedCert, tab);

        if (objectives.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>
                        No objectives available for {selectedCert} in {tab}.
                    </ThemedText>
                </View>
            );
        }

        return (
            <ScrollView style={styles.objectivesContainer} showsVerticalScrollIndicator={false}>
                {objectives.map((obj) => {
                    const itemCount = tab === 'terms' ?
                        GLOSSARY_TERMS[selectedCert]?.[obj]?.length || 0 :
                        GLOSSARY_ACRONYMS_BY_OBJECTIVE[selectedCert]?.[obj]?.length || 0;

                    return (
                        <Pressable
                            key={obj}
                            style={styles.objectiveCard}
                            onPress={() => setSelectedObjective(obj)}
                        >
                            <View style={styles.objectiveContent}>
                                <ThemedText style={styles.objectiveTitle}>
                                    {obj}
                                </ThemedText>
                                <View style={styles.objectiveFooter}>
                                    <ThemedText style={styles.itemCount}>
                                        {itemCount} {tab === 'terms' ? 'terms' : 'acronyms'}
                                    </ThemedText>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color={theme.colors.textMuted}
                                    />
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        );
    };

    const renderViewModeSelector = () => {
        if (!selectedObjective) return null;

        return (
            <View style={styles.viewModeContainer}>
                <View style={styles.viewModeHeader}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => {
                            setSelectedObjective(null);
                            setViewMode('list');
                        }}
                    >
                        <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
                    </Pressable>

                    <ThemedText style={styles.selectedObjectiveTitle}>
                        {selectedObjective === 'all_ports' ? 'Common Ports' : selectedObjective}
                    </ThemedText>
                </View>

                <View style={styles.viewModeToggle}>
                    {['list', 'flashcards'].map((mode) => (
                        <Pressable
                            key={mode}
                            style={[
                                styles.toggleButton,
                                viewMode === mode ? styles.toggleButtonActive : null,
                            ]}
                            onPress={() => setViewMode(mode as 'list' | 'flashcards')}
                        >
                            <ThemedText
                                style={[
                                    styles.toggleText,
                                    viewMode === mode ? styles.toggleTextActive : styles.toggleTextInactive,
                                ]}
                            >
                                {mode === 'list' ? 'List' : 'Cards'}
                            </ThemedText>
                        </Pressable>
                    ))}
                </View>
            </View>
        );
    };

    const renderListView = () => {
        if (viewMode !== 'list' || !selectedObjective) return null;

        return (
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {flashcards.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                        <ThemedText style={styles.listItemTerm}>
                            {item.term || item.acronym || item.port}
                        </ThemedText>
                        <ThemedText style={styles.listItemDefinition}>
                            {item.definition}
                        </ThemedText>
                    </View>
                ))}
            </ScrollView>
        );
    };

    // Full-screen flashcard mode - hide everything else
    if (selectedObjective && viewMode === 'flashcards') {
        return (
            <Flashcards
                data={flashcards}
                onClose={() => setViewMode('list')}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderTabButtons()}
            {renderObjectiveCards()}
            {renderViewModeSelector()}
            {renderListView()}
        </SafeAreaView>
    );
}