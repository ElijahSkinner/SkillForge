// app/(tabs)/glossary/Flashcards.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FlashcardItem = {
    term?: string;
    acronym?: string;
    port?: string;
    definition: string;
};

type Props = {
    data: FlashcardItem[];
    onClose?: () => void;
};

export default function Flashcards({ data, onClose }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);

    if (!data || data.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.message}>No flashcards available.</Text>
            </SafeAreaView>
        );
    }

    const currentCard = data[currentIndex];

    const nextCard = () => {
        setShowDefinition(false);
        setCurrentIndex((prev) => Math.min(prev + 1, data.length - 1));
    };

    const prevCard = () => {
        setShowDefinition(false);
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.flashcardContainer}>
                <Pressable
                    style={styles.flashcard}
                    onPress={() => setShowDefinition((prev) => !prev)}
                >
                    <Text style={styles.flashcardText}>
                        {showDefinition
                            ? currentCard.definition
                            : currentCard.term || currentCard.acronym || currentCard.port}
                    </Text>
                </Pressable>

                <Text style={styles.progress}>
                    {currentIndex + 1} / {data.length}
                </Text>

                <View style={styles.navButtons}>
                    <Pressable
                        style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
                        onPress={prevCard}
                        disabled={currentIndex === 0}
                    >
                        <Text style={styles.navText}>Previous</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.navButton,
                            currentIndex === data.length - 1 && styles.disabledButton,
                        ]}
                        onPress={nextCard}
                        disabled={currentIndex === data.length - 1}
                    >
                        <Text style={styles.navText}>Next</Text>
                    </Pressable>
                </View>

                {onClose && (
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.navText}>Close</Text>
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: { color: '#fff', fontSize: 16 },
    flashcardContainer: {
        width: '90%',
        alignItems: 'center',
    },
    flashcard: {
        width: '100%',
        minHeight: 200,
        backgroundColor: '#1f1f1f',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    flashcardText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
    },
    progress: {
        color: '#aaa',
        marginTop: 12,
    },
    navButtons: {
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        justifyContent: 'space-between',
    },
    navButton: {
        backgroundColor: '#27b0b9',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#555',
    },
    navText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: '#444',
        borderRadius: 8,
    },
});
