import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

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

            // Load enrolled courses from Appwrite
            // Parse the enrolledCourses string array into proper Course objects
            const savedCourses = progress.enrolledCourses || [];

            // If enrolledCourses is stored as string array in Appwrite
            // we need to parse it into Course objects
            let parsedCourses: Course[] = [];

            if (Array.isArray(savedCourses)) {
                parsedCourses = savedCourses.map((courseStr: string, index: number) => {
                    try {
                        // If stored as JSON strings
                        return JSON.parse(courseStr) as Course;
                    } catch {
                        // If stored as simple strings, create Course objects
                        return {
                            id: index + 1,
                            name: courseStr,
                            score: 0,
                            progress: 0,
                            enrolledDate: new Date().toISOString(),
                        };
                    }
                });
            }

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
                saveCoursesToAppwrite(parsedCourses);
            }

            setEnrolledCoursesState(parsedCourses);
            setLoading(false);
        }
    }, [progress]);

    // Helper function to save courses to Appwrite
    const saveCoursesToAppwrite = async (courses: Course[]) => {
        try {
            // Convert Course objects to JSON strings for Appwrite storage
            const coursesAsStrings = courses.map(course => JSON.stringify(course));
            await updateProgressField('enrolledCourses', coursesAsStrings);
        } catch (error) {
            console.error('Failed to save courses to Appwrite:', error);
        }
    };

    // Set selected certification and save to Appwrite
    const setSelectedCert = async (cert: string) => {
        setSelectedCertState(cert);

        try {
            await updateProgressField('currentCert', cert);
        } catch (error) {
            console.error('Failed to save selected cert to Appwrite:', error);
            // Revert local state on error
            setSelectedCertState(selectedCert);
            throw error;
        }
    };

    // Add a new course and save to Appwrite
    const addCourse = async (course: Course) => {
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
            setEnrolledCoursesState(enrolledCourses);
            throw error;
        }
    };

    // Remove a course and update Appwrite
    const removeCourse = async (courseId: number) => {
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
            setEnrolledCoursesState(enrolledCourses);
            throw error;
        }
    };

    // Update course progress and save to Appwrite
    const updateCourseProgress = async (courseName: string, progressValue: number) => {
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
            setEnrolledCoursesState(enrolledCourses);
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