// app/(tabs)/glossary/index.tsx - Enhanced version
import { useTheme } from '../../../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useCert } from '../../../context/CertContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Flashcards from './Flashcards';
import {
    GLOSSARY_TERMS,
    GLOSSARY_ACRONYMS_BY_OBJECTIVE,
    GLOSSARY_PORTS,
} from '../../../constants/glossary';
import CourseRedirect from '../../../components/CourseRedirect';

const OBJECTIVES = [
    '1.0 Networking Concepts',
    '2.0 Network Implementation',
    '3.0 Network Operations',
    '4.0 Network Security',
    '5.0 Network Troubleshooting',
];

export default function GlossaryScreen() {
    const { selectedCert } = useCert();
    const { theme } = useTheme();
    const [tab, setTab] = useState<'terms' | 'acronyms' | 'ports'>('terms');
    const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'flashcards'>('list');
    const [flashcards, setFlashcards] = useState<
        { term?: string; acronym?: string; port?: string; definition: string }[]
    >([]);

    // Update flashcards whenever selectedObjective or tab changes
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

    // Tab buttons with enhanced styling
    const renderTabButtons = () => (
        <View style={styles.tabContainer}>
            {['terms', 'acronyms', 'ports'].map((t, index) => {
                const isActive = tab === t;
                const colors = [theme.colors.primary, theme.colors.accent, theme.colors.success];
                const tabColor = colors[index];

                return (
                    <Pressable
                        key={t}
                        style={[
                            styles.tabButton,
                            {
                                backgroundColor: isActive ? tabColor : theme.colors.surface,
                                borderColor: tabColor,
                                borderWidth: 2,
                            }
                        ]}
                        onPress={() => {
                            setTab(t as any);
                            setSelectedObjective(t === 'ports' ? 'all_ports' : null);
                            setViewMode('list');
                        }}
                    >
                        <Ionicons
                            name={
                                t === 'terms' ? 'library' :
                                    t === 'acronyms' ? 'text' : 'server'
                            }
                            size={20}
                            color={isActive ? theme.colors.textOnPrimary : tabColor}
                        />
                        <Text style={[
                            styles.tabText,
                            {
                                color: isActive ? theme.colors.textOnPrimary : tabColor,
                                fontWeight: isActive ? '700' : '600'
                            }
                        ]}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );

    // Enhanced objective cards
    const renderObjectiveCards = () => {
        if (tab === 'ports' || selectedObjective) return null;

        return (
            <ScrollView style={styles.objectivesContainer} showsVerticalScrollIndicator={false}>
                {OBJECTIVES.map((obj, index) => {
                    const gradientColors = [
                        [theme.colors.primary, theme.colors.primaryLight],
                        [theme.colors.accent, theme.colors.accentLight],
                        [theme.colors.secondary, theme.colors.secondaryLight],
                        [theme.colors.success, '#4ade80'],
                        [theme.colors.warning, '#fbbf24']
                    ];
                    const [startColor, endColor] = gradientColors[index % gradientColors.length];

                    return (
                        <Pressable
                            key={obj}
                            style={[
                                styles.objectiveCard,
                                {
                                    backgroundColor: startColor,
                                    borderColor: endColor,
                                    borderWidth: 2,
                                }
                            ]}
                            onPress={() => setSelectedObjective(obj)}
                        >
                            <View style={styles.objectiveCardContent}>
                                <Ionicons
                                    name="school"
                                    size={24}
                                    color={theme.colors.textOnPrimary}
                                    style={styles.objectiveIcon}
                                />
                                <Text style={[styles.objectiveTitle, { color: theme.colors.textOnPrimary }]}>
                                    {obj}
                                </Text>
                                <View style={[styles.objectiveBadge, { backgroundColor: endColor }]}>
                                    <Text style={[styles.objectiveBadgeText, { color: theme.colors.textOnPrimary }]}>
                                        {tab === 'terms' ?
                                            `${GLOSSARY_TERMS[selectedCert]?.[obj]?.length || 0} terms` :
                                            `${GLOSSARY_ACRONYMS_BY_OBJECTIVE[selectedCert]?.[obj]?.length || 0} acronyms`
                                        }
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        );
    };

    // View mode selector
    const renderViewModeSelector = () => {
        if (!selectedObjective) return null;

        return (
            <View style={styles.viewModeContainer}>
                <Text style={[styles.selectedObjectiveTitle, { color: theme.colors.text }]}>
                    {selectedObjective}
                </Text>
                <View style={styles.viewModeButtons}>
                    {['list', 'flashcards'].map((mode) => (
                        <Pressable
                            key={mode}
                            style={[
                                styles.viewModeButton,
                                {
                                    backgroundColor: viewMode === mode ? theme.colors.primary : theme.colors.surface,
                                    borderColor: theme.colors.primary,
                                }
                            ]}
                            onPress={() => setViewMode(mode as 'list' | 'flashcards')}
                        >
                            <Ionicons
                                name={mode === 'list' ? 'list' : 'card'}
                                size={18}
                                color={viewMode === mode ? theme.colors.textOnPrimary : theme.colors.primary}
                            />
                            <Text style={[
                                styles.viewModeText,
                                { color: viewMode === mode ? theme.colors.textOnPrimary : theme.colors.primary }
                            ]}>
                                {mode === 'list' ? 'List View' : 'Flashcards'}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Pressable
                    style={[styles.backButton, { backgroundColor: theme.colors.secondary }]}
                    onPress={() => {
                        setSelectedObjective(null);
                        setViewMode('list');
                    }}
                >
                    <Ionicons name="arrow-back" size={18} color={theme.colors.textOnPrimary} />
                    <Text style={[styles.backButtonText, { color: theme.colors.textOnPrimary }]}>
                        Back to Topics
                    </Text>
                </Pressable>
            </View>
        );
    };

    // Enhanced list view
    const renderListView = () => {
        if (viewMode !== 'list' || !selectedObjective) return null;

        return (
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {flashcards.map((item, index) => (
                    <View
                        key={index}
                        style={[
                            styles.listItem,
                            {
                                backgroundColor: theme.colors.surface,
                                borderLeftColor: theme.colors.primary,
                            }
                        ]}
                    >
                        <View style={styles.listItemHeader}>
                            <Text style={[styles.listItemTerm, { color: theme.colors.primary }]}>
                                {item.term || item.acronym || item.port}
                            </Text>
                            <View style={[styles.listItemBadge, { backgroundColor: theme.colors.accent }]}>
                                <Text style={[styles.listItemBadgeText, { color: theme.colors.textOnPrimary }]}>
                                    {tab.slice(0, -1).toUpperCase()}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.listItemDefinition, { color: theme.colors.textSecondary }]}>
                            {item.definition}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {renderTabButtons()}
            {renderObjectiveCards()}
            {renderViewModeSelector()}
            {renderListView()}

            {selectedObjective && viewMode === 'flashcards' && (
                <Flashcards
                    data={flashcards}
                    onClose={() => setViewMode('list')}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 8,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    objectivesContainer: {
        flex: 1,
    },
    objectiveCard: {
        marginBottom: 16,
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    objectiveCardContent: {
        alignItems: 'center',
    },
    objectiveIcon: {
        marginBottom: 8,
    },
    objectiveTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    objectiveBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    objectiveBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    viewModeContainer: {
        marginBottom: 16,
    },
    selectedObjectiveTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    viewModeButtons: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    viewModeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 2,
        gap: 6,
    },
    viewModeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        gap: 6,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    listContainer: {
        flex: 1,
    },
    listItem: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    listItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    listItemTerm: {
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
    },
    listItemBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    listItemBadgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    listItemDefinition: {
        fontSize: 14,
        lineHeight: 20,
    },
});