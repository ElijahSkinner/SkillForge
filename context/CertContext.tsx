type Course = {
    id: number;
    name: string;
    score: number;
};

type CertContextType = {
    selectedCert: string | null;
    setSelectedCert: (cert: string) => void;
    enrolledCourses: Course[];
    addCourse: (course: Course) => void;
};

const CertContext = certContext<CertContextType | null>(null);

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
        setEnrolledCourses((prev) => [...prev, course]);
    };

    return (
        <CertContext.Provider value={{ selectedCert, setSelectedCert, enrolledCourses, addCourse }}>
            {children}
        </CertContext.Provider>
    );
};
