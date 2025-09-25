// app/(tabs)/glossary/index.tsx - Professional version
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
                            {
                                backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                                borderColor: theme.colors.borderColor,
                            }
                        ]}
                        onPress={() => {
                            setTab(t as any);
                            setSelectedObjective(t === 'ports' ? 'all_ports' : null);
                            setViewMode('list');
                        }}
                    >
                        <Text style={[
                            styles.tabText,
                            {
                                color: isActive ? theme.colors.textOnPrimary : theme.colors.text,
                                fontWeight: isActive ? '600' : '500'
                            }
                        ]}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );

    const renderObjectiveCards = () => {
        if (tab === 'ports' || selectedObjective) return null;

        return (
            <ScrollView style={styles.objectivesContainer} showsVerticalScrollIndicator={false}>
                {OBJECTIVES.map((obj) => {
                    const itemCount = tab === 'terms' ?
                        GLOSSARY_TERMS[selectedCert]?.[obj]?.length || 0 :
                        GLOSSARY_ACRONYMS_BY_OBJECTIVE[selectedCert]?.[obj]?.length || 0;

                    return (
                        <Pressable
                            key={obj}
                            style={[
                                styles.objectiveCard,
                                {
                                    backgroundColor: theme.colors.surface,
                                    borderColor: theme.colors.borderColor,
                                }
                            ]}
                            onPress={() => setSelectedObjective(obj)}
                        >
                            <View style={styles.objectiveContent}>
                                <Text style={[styles.objectiveTitle, { color: theme.colors.text }]}>
                                    {obj}
                                </Text>
                                <View style={styles.objectiveFooter}>
                                    <Text style={[styles.itemCount, { color: theme.colors.textSecondary }]}>
                                        {itemCount} {tab === 'terms' ? 'terms' : 'acronyms'}
                                    </Text>
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
                        style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
                        onPress={() => {
                            setSelectedObjective(null);
                            setViewMode('list');
                        }}
                    >
                        <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
                    </Pressable>

                    <Text style={[styles.selectedObjectiveTitle, { color: theme.colors.text }]}>
                        {selectedObjective === 'all_ports' ? 'Common Ports' : selectedObjective}
                    </Text>
                </View>

                <View style={styles.viewModeToggle}>
                    {['list', 'flashcards'].map((mode) => (
                        <Pressable
                            key={mode}
                            style={[
                                styles.toggleButton,
                                {
                                    backgroundColor: viewMode === mode ? theme.colors.primary : 'transparent',
                                }
                            ]}
                            onPress={() => setViewMode(mode as 'list' | 'flashcards')}
                        >
                            <Text style={[
                                styles.toggleText,
                                { color: viewMode === mode ? theme.colors.textOnPrimary : theme.colors.text }
                            ]}>
                                {mode === 'list' ? 'List' : 'Cards'}
                            </Text>
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
                    <View
                        key={index}
                        style={[
                            styles.listItem,
                            {
                                backgroundColor: theme.colors.surface,
                                borderColor: theme.colors.borderColor,
                            }
                        ]}
                    >
                        <Text style={[styles.listItemTerm, { color: theme.colors.primary }]}>
                            {item.term || item.acronym || item.port}
                        </Text>
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
        borderRadius: 8,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginHorizontal: 2,
        borderWidth: 1,
    },
    tabText: {
        fontSize: 15,
    },
    objectivesContainer: {
        flex: 1,
    },
    objectiveCard: {
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
        padding: 16,
    },
    objectiveContent: {
        flex: 1,
    },
    objectiveTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    objectiveFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemCount: {
        fontSize: 14,
    },
    viewModeContainer: {
        marginBottom: 16,
    },
    viewModeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedObjectiveTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    viewModeToggle: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '500',
    },
    listContainer: {
        flex: 1,
    },
    listItem: {
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    listItemTerm: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    listItemDefinition: {
        fontSize: 14,
        lineHeight: 20,
    },
});