import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

type Course = {
    id: number;
    name: string;
    score: number;
};

type CertContextType = {
    selectedCert: string;
    setSelectedCert: (cert: string) => void;
    enrolledCourses: Course[];
    addCourse: (course: Course) => void;
};

const CertContext = createContext<CertContextType | null>(null);
export const useCert = (): CertContextType => {
    const context = useContext(CertContext);
    if (!context) throw new Error('useCert must be used within CertProvider');
    return context;
};

export const CertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedCert, setSelectedCertState] = useState<string | null>(null);
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([
        { id: 1, name: 'Security+', score: 70 },
        { id: 2, name: 'AWS Cloud', score: 40 },
    ]);

    useEffect(() => {
        const loadCert = async () => {
            const saved = await AsyncStorage.getItem('selectedCert');
            if (saved) setSelectedCertState(saved);
        };
        loadCert();
    }, []);

    const setSelectedCert = async (cert: string) => {
        setSelectedCertState(cert);
        await AsyncStorage.setItem('selectedCert', cert);
    };

    const addCourse = (course: Course) => {
        setEnrolledCourses([...enrolledCourses, course]);
    };

    return (
        <CertContext.Provider
            value={{ selectedCert, setSelectedCert, enrolledCourses, addCourse }}
        >
            {children}
        </CertContext.Provider>
    );
};
