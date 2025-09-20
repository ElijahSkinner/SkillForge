export type QuizQuestion =
    | {
    id: number;
    type: "multiple-choice";
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}
    | {
    id: number;
    type: "true-false";
    question: string;
    correct: boolean;
    explanation: string;
}
    | {
    id: number;
    type: "fill-blank";
    question: string;
    correct: string[];
    explanation: string;
}
    | {
    id: number;
    type: "drag-drop";
    question: string;
    items: { id: string; text: string }[];
    targets: { id: string; text: string; correct: string }[];
    explanation: string;
}
    | {
    id: number;
    type: "scenario";
    question: string;
    options: string[];
    correct: number;
    explanation: string;
};

export interface QuizData {
    title: string;
    questions: QuizQuestion[];
}

export interface QuizType {
    quizA: QuizData;
    quizB: QuizData;
}

export const DOMAIN_1_QUIZZES: Record<string, QuizType> = {
    "1.1": {
        quizA: {
            title: "OSI Model Fundamentals - Quiz A",
            questions: [
                {
                    id: 1,
                    type: "multiple-choice",
                    question: "Which OSI layer is responsible for routing packets between different networks?",
                    options: [
                        "Layer 2 - Data Link",
                        "Layer 3 - Network",
                        "Layer 4 - Transport",
                        "Layer 5 - Session"
                    ],
                    correct: 1,
                    explanation: "Layer 3 (Network) handles logical addressing and routing between different networks using IP addresses."
                },
                {
                    id: 2,
                    type: "multiple-choice",
                    question: "At which layer would you troubleshoot a problem with a damaged Ethernet cable?",
                    options: [
                        "Layer 1 - Physical",
                        "Layer 2 - Data Link",
                        "Layer 3 - Network",
                        "Layer 4 - Transport"
                    ],
                    correct: 0,
                    explanation: "Layer 1 (Physical) deals with the actual physical medium including cables, connectors, and electrical signals."
                },
                {
                    id: 3,
                    type: "drag-drop",
                    question: "Match each OSI layer with its primary function:",
                    items: [
                        { id: "layer7", text: "Application" },
                        { id: "layer4", text: "Transport" },
                        { id: "layer3", text: "Network" },
                        { id: "layer1", text: "Physical" }
                    ],
                    targets: [
                        { id: "function1", text: "Provides network services to applications", correct: "layer7" },
                        { id: "function2", text: "Ensures reliable data delivery", correct: "layer4" },
                        { id: "function3", text: "Handles routing and logical addressing", correct: "layer3" },
                        { id: "function4", text: "Manages electrical signals and physical medium", correct: "layer1" }
                    ],
                    explanation: "Each OSI layer has specific responsibilities: Application (L7) provides services, Transport (L4) ensures reliability, Network (L3) handles routing, Physical (L1) manages the physical medium."
                },
                {
                    id: 4,
                    type: "multiple-choice",
                    question: "Which layer is responsible for encryption and compression?",
                    options: [
                        "Layer 5 - Session",
                        "Layer 6 - Presentation",
                        "Layer 7 - Application",
                        "Layer 4 - Transport"
                    ],
                    correct: 1,
                    explanation: "Layer 6 (Presentation) handles data formatting, encryption, compression, and character encoding."
                },
                {
                    id: 5,
                    type: "true-false",
                    question: "The Data Link layer uses MAC addresses for addressing.",
                    correct: true,
                    explanation: "Layer 2 (Data Link) uses MAC addresses for physical addressing within the same network segment."
                },
                {
                    id: 6,
                    type: "multiple-choice",
                    question: "TCP and UDP operate at which OSI layer?",
                    options: [
                        "Layer 3 - Network",
                        "Layer 4 - Transport",
                        "Layer 5 - Session",
                        "Layer 2 - Data Link"
                    ],
                    correct: 1,
                    explanation: "TCP and UDP are transport layer protocols that provide different levels of reliability and service."
                },
                {
                    id: 7,
                    type: "fill-blank",
                    question: "Layer __ manages sessions between applications and handles session establishment and termination.",
                    correct: ["5", "five", "session"],
                    explanation: "Layer 5 (Session) manages communication sessions between applications."
                },
                {
                    id: 8,
                    type: "multiple-choice",
                    question: "When data travels down the OSI stack for transmission, what happens at each layer?",
                    options: [
                        "Data is decrypted",
                        "Headers are removed",
                        "Headers are added (encapsulation)",
                        "Data is compressed"
                    ],
                    correct: 2,
                    explanation: "During transmission, each layer adds its own header (and sometimes trailer) to the data in a process called encapsulation."
                },
                {
                    id: 9,
                    type: "scenario",
                    question: "A user cannot access a website. The network cable is connected, the switch shows a link light, but the user cannot ping the default gateway. Which OSI layers should you check first?",
                    options: [
                        "Layers 1 and 2 only",
                        "Layers 3 and 4 only",
                        "Layers 1, 2, and 3",
                        "Layer 7 only"
                    ],
                    correct: 2,
                    explanation: "Since physical connectivity exists but Layer 3 (ping) fails, check Physical (cable quality), Data Link (switch config), and Network (IP configuration)."
                },
                {
                    id: 10,
                    type: "multiple-choice",
                    question: "Which layer would handle the HTTP protocol?",
                    options: [
                        "Layer 6 - Presentation",
                        "Layer 7 - Application",
                        "Layer 5 - Session",
                        "Layer 4 - Transport"
                    ],
                    correct: 1,
                    explanation: "HTTP is an application layer protocol that provides web services to applications and users."
                }
            ]
        },
        quizB: {
            title: "OSI Model Advanced - Quiz B",
            questions: [
                {
                    id: 1,
                    type: "multiple-choice",
                    question: "Which layer adds the source and destination MAC addresses to frames?",
                    options: [
                        "Layer 1 - Physical",
                        "Layer 2 - Data Link",
                        "Layer 3 - Network",
                        "Layer 4 - Transport"
                    ],
                    correct: 1,
                    explanation: "Layer 2 (Data Link) adds MAC addresses to create frames for local network delivery."
                },
                {
                    id: 2,
                    type: "scenario",
                    question: "A network administrator can ping local devices but cannot reach the internet. Which layers are likely functioning correctly?",
                    options: [
                        "Layers 1-2 only",
                        "Layers 1-3 locally",
                        "All layers",
                        "Layers 4-7 only"
                    ],
                    correct: 1,
                    explanation: "Local ping works (Layers 1-3 functional locally), but internet access suggests routing or higher layer issues."
                },
                {
                    id: 3,
                    type: "drag-drop",
                    question: "Order these protocols by their OSI layer (lowest to highest):",
                    items: [
                        { id: "http", text: "HTTP" },
                        { id: "tcp", text: "TCP" },
                        { id: "ip", text: "IP" },
                        { id: "ethernet", text: "Ethernet" }
                    ],
                    targets: [
                        { id: "layer2", text: "Layer 2", correct: "ethernet" },
                        { id: "layer3", text: "Layer 3", correct: "ip" },
                        { id: "layer4", text: "Layer 4", correct: "tcp" },
                        { id: "layer7", text: "Layer 7", correct: "http" }
                    ],
                    explanation: "Ethernet operates at Layer 2, IP at Layer 3, TCP at Layer 4, and HTTP at Layer 7."
                }
            ]
        }
    },
    "1.2": {
        quizA: {
            title: "Network Appliances & Functions - Quiz A",
            questions: [
                {
                    id: 1,
                    type: "multiple-choice",
                    question: "What is the primary function of a router?",
                    options: [
                        "Forward traffic within the same network using MAC addresses",
                        "Route traffic between different networks using IP addresses",
                        "Filter traffic based on security policies",
                        "Provide wireless connectivity"
                    ],
                    correct: 1,
                    explanation: "Routers operate at Layer 3 and route traffic between different networks using IP addresses."
                }
            ]
        },
        quizB: {
            title: "Network Appliances Advanced - Quiz B",
            questions: [
                {
                    id: 1,
                    type: "scenario",
                    question: "A company's web application is experiencing slow response times during peak hours. Which appliance would best address this issue?",
                    options: [
                        "Firewall",
                        "Load balancer",
                        "Router",
                        "Switch"
                    ],
                    correct: 1,
                    explanation: "A load balancer can distribute traffic across multiple web servers, improving response times and availability."
                }
            ]
        }
    }
};