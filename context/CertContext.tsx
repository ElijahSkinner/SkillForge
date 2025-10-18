// context/CertContext.tsx - UPDATED with proper JSON handling for enrolledCourses
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

type Course = {
    id: number;
    name: string;
    score: number;
    enrolledDate?: string;
    lastAccessed?: string;
    progress?: number;
};

type CertContextType = {
    selectedCert: string | null;
    setSelectedCert: (cert: string) => Promise<void>;
    enrolledCourses: Course[];
    addCourse: (course: Course) => Promise<void>;
    removeCourse: (courseId: number) => Promise<void>;
    updateCourseProgress: (courseName: string, progress: number) => Promise<void>;
    loading: boolean;
};

const CertContext = createContext<CertContextType | null>(null);

export const useCert = (): CertContextType => {
    const context = useContext(CertContext);
    if (!context) throw new Error('useCert must be used within CertProvider');
    return context;
};

// ============================================
// HELPER FUNCTIONS FOR COURSE JSON HANDLING
// ============================================

/**
 * Parse enrolledCourses from Appwrite (string array) to Course objects
 */
function parseEnrolledCourses(enrolledCourses: string[] | Course[] | null | undefined): Course[] {
    if (!enrolledCourses || !Array.isArray(enrolledCourses)) {
        return [];
    }

    // If already parsed as Course objects, return as-is
    if (enrolledCourses.length > 0 && typeof enrolledCourses[0] === 'object' && 'name' in enrolledCourses[0]) {
        return enrolledCourses as Course[];
    }

    // Parse string array to Course objects
    return enrolledCourses.map((courseStr, index) => {
        if (typeof courseStr === 'string') {
            try {
                return JSON.parse(courseStr) as Course;
            } catch {
                // If not JSON, create a basic Course object
                return {
                    id: index + 1,
                    name: courseStr,
                    score: 0,
                    progress: 0,
                    enrolledDate: new Date().toISOString(),
                };
            }
        }
        return courseStr as Course;
    });
}

/**
 * Prepare courses for Appwrite (stringify Course objects)
 */
function prepareCoursesForAppwrite(courses: Course[]): string[] {
    return courses.map(course => JSON.stringify(course));
}

// ============================================
// CERT PROVIDER COMPONENT
// ============================================

export const CertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { progress, updateProgressField } = useAuth();
    const [selectedCert, setSelectedCertState] = useState<string | null>(null);
    const [enrolledCourses, setEnrolledCoursesState] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Load data from Appwrite when progress is available
    useEffect(() => {
        if (progress) {
            setLoading(true);

            // Load selected cert from Appwrite
            const savedCert = progress.currentCert || null;
            setSelectedCertState(savedCert);

            // Load and parse enrolled courses from Appwrite
            const savedCourses = progress.enrolledCourses || [];
            let parsedCourses = parseEnrolledCourses(savedCourses);

            // Add default courses if none exist
            if (parsedCourses.length === 0) {
                parsedCourses = [
                    {
                        id: 1,
                        name: 'CompTIA Network+',
                        score: 0,
                        progress: 0,
                        enrolledDate: new Date().toISOString()
                    },
                    {
                        id: 2,
                        name: 'CompTIA Security+',
                        score: 0,
                        progress: 0,
                        enrolledDate: new Date().toISOString()
                    },
                ];

                // Save default courses to Appwrite
                saveCoursesToAppwrite(parsedCourses).catch(err =>
                    console.error('Failed to save default courses:', err)
                );
            }

            setEnrolledCoursesState(parsedCourses);
            setLoading(false);
        }
    }, [progress]);

    // Helper function to save courses to Appwrite
    const saveCoursesToAppwrite = async (courses: Course[]) => {
        try {
            // Convert Course objects to JSON strings for Appwrite storage
            const coursesAsStrings = prepareCoursesForAppwrite(courses);
            await updateProgressField('enrolledCourses', coursesAsStrings);
        } catch (error) {
            console.error('Failed to save courses to Appwrite:', error);
            throw error;
        }
    };

    // Set selected certification and save to Appwrite
    const setSelectedCert = async (cert: string) => {
        const previousCert = selectedCert;
        setSelectedCertState(cert);

        try {
            await updateProgressField('currentCert', cert);
        } catch (error) {
            console.error('Failed to save selected cert to Appwrite:', error);
            // Revert local state on error
            setSelectedCertState(previousCert);
            throw error;
        }
    };

    // Add a new course and save to Appwrite
    const addCourse = async (course: Course) => {
        const previousCourses = enrolledCourses;
        const newCourses = [...enrolledCourses, {
            ...course,
            enrolledDate: course.enrolledDate || new Date().toISOString(),
            progress: course.progress || 0,
        }];

        setEnrolledCoursesState(newCourses);

        try {
            await saveCoursesToAppwrite(newCourses);
        } catch (error) {
            console.error('Failed to add course to Appwrite:', error);
            // Revert local state on error
            setEnrolledCoursesState(previousCourses);
            throw error;
        }
    };

    // Remove a course and update Appwrite
    const removeCourse = async (courseId: number) => {
        const previousCourses = enrolledCourses;
        const newCourses = enrolledCourses.filter(course => course.id !== courseId);
        setEnrolledCoursesState(newCourses);

        try {
            await saveCoursesToAppwrite(newCourses);

            // If the removed course was selected, clear selection
            const removedCourse = enrolledCourses.find(course => course.id === courseId);
            if (removedCourse && selectedCert === removedCourse.name) {
                await setSelectedCert('');
            }
        } catch (error) {
            console.error('Failed to remove course from Appwrite:', error);
            // Revert local state on error
            setEnrolledCoursesState(previousCourses);
            throw error;
        }
    };

    // Update course progress and save to Appwrite
    const updateCourseProgress = async (courseName: string, progressValue: number) => {
        const previousCourses = enrolledCourses;
        const newCourses = enrolledCourses.map(course =>
            course.name === courseName
                ? {
                    ...course,
                    progress: progressValue,
                    lastAccessed: new Date().toISOString()
                }
                : course
        );

        setEnrolledCoursesState(newCourses);

        try {
            await saveCoursesToAppwrite(newCourses);
        } catch (error) {
            console.error('Failed to update course progress in Appwrite:', error);
            // Revert local state on error
            setEnrolledCoursesState(previousCourses);
            throw error;
        }
    };

    return (
        <CertContext.Provider
            value={{
                selectedCert,
                setSelectedCert,
                enrolledCourses,
                addCourse,
                removeCourse,
                updateCourseProgress,
                loading
            }}
        >
            {children}
        </CertContext.Provider>
    );
};