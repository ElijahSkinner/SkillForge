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
export const DOMAIN_1_QUIZZES: Record<string, QuizType>  = {
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
                },
                {
                    id: 4,
                    type: "multiple-choice",
                    question: "What is the main difference between Layer 6 and Layer 7?",
                    options: [
                        "Layer 6 handles routing, Layer 7 handles switching",
                        "Layer 6 handles data formatting, Layer 7 provides application services",
                        "Layer 6 handles sessions, Layer 7 handles encryption",
                        "There is no functional difference"
                    ],
                    correct: 1,
                    explanation: "Layer 6 (Presentation) formats data for the application, while Layer 7 (Application) provides network services to applications."
                },
                {
                    id: 5,
                    type: "true-false",
                    question: "SSL/TLS encryption primarily operates at the Transport layer.",
                    correct: false,
                    explanation: "SSL/TLS primarily operates at the Presentation layer (Layer 6), though it's implemented between Transport and Application layers."
                },
                {
                    id: 6,
                    type: "multiple-choice",
                    question: "Which process occurs when data moves UP the OSI stack (receiving)?",
                    options: [
                        "Encapsulation - headers are added",
                        "De-encapsulation - headers are removed",
                        "Encryption - data is secured",
                        "Compression - data is reduced"
                    ],
                    correct: 1,
                    explanation: "When receiving, data moves up the stack and each layer removes its header (de-encapsulation)."
                },
                {
                    id: 7,
                    type: "fill-blank",
                    question: "The _______ layer is responsible for establishing, managing, and terminating connections between applications.",
                    correct: ["session", "Session", "layer 5", "Layer 5"],
                    explanation: "The Session layer (Layer 5) manages communication sessions between applications."
                },
                {
                    id: 8,
                    type: "multiple-choice",
                    question: "At which layer would you configure VLANs?",
                    options: [
                        "Layer 1 - Physical",
                        "Layer 2 - Data Link",
                        "Layer 3 - Network",
                        "Layer 4 - Transport"
                    ],
                    correct: 1,
                    explanation: "VLANs are configured at Layer 2 (Data Link) as they segment broadcast domains within the same physical network."
                },
                {
                    id: 9,
                    type: "scenario",
                    question: "An application works fine locally but fails when accessing a remote server. The network connection is stable. Which layers should you investigate?",
                    options: [
                        "Layers 1-3 only",
                        "Layers 4-7 only",
                        "Layer 7 only",
                        "All layers equally"
                    ],
                    correct: 1,
                    explanation: "Since lower layers work (stable connection), focus on Transport through Application layers for application-specific issues."
                },
                {
                    id: 10,
                    type: "multiple-choice",
                    question: "Which layer handles flow control and error recovery?",
                    options: [
                        "Layer 2 - Data Link",
                        "Layer 3 - Network",
                        "Layer 4 - Transport",
                        "Layer 5 - Session"
                    ],
                    correct: 2,
                    explanation: "Layer 4 (Transport) provides flow control, error recovery, and reliable data delivery through protocols like TCP."
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
                },
                {
                    id: 2,
                    type: "multiple-choice",
                    question: "Which device would you use to segment a LAN into multiple collision domains?",
                    options: [
                        "Hub",
                        "Router",
                        "Switch",
                        "Firewall"
                    ],
                    correct: 2,
                    explanation: "Switches create separate collision domains for each port, while hubs create one large collision domain."
                },
                {
                    id: 3,
                    type: "drag-drop",
                    question: "Match each device with its primary operating layer:",
                    items: [
                        { id: "switch", text: "Switch" },
                        { id: "router", text: "Router" },
                        { id: "hub", text: "Hub" },
                        { id: "firewall", text: "Firewall" }
                    ],
                    targets: [
                        { id: "layer1", text: "Layer 1 (Physical)", correct: "hub" },
                        { id: "layer2", text: "Layer 2 (Data Link)", correct: "switch" },
                        { id: "layer3", text: "Layer 3 (Network)", correct: "router" },
                        { id: "multilayer", text: "Multiple Layers", correct: "firewall" }
                    ],
                    explanation: "Switches create separate collision domains for each port, while hubs create one large collision domain."
                },
                {
                    id: 4,
                    type: "true-false",
                    question: "An IDS (Intrusion Detection System) can automatically block detected threats.",
                    correct: false,
                    explanation: "IDS only detects and alerts on threats. IPS (Intrusion Prevention System) can actively block threats."
                },
                {
                    id: 5,
                    type: "multiple-choice",
                    question: "What is the main purpose of a load balancer?",
                    options: [
                        "Route traffic between networks",
                        "Filter malicious traffic",
                        "Distribute incoming requests across multiple servers",
                        "Provide wireless access"
                    ],
                    correct: 2,
                    explanation: "Load balancers distribute incoming network traffic across multiple backend servers to ensure availability and performance."
                },
                {
                    id: 6,
                    type: "scenario",
                    question: "Your company needs to provide internet access to guest users while keeping them isolated from the corporate network. Which device would be most appropriate?",
                    options: [
                        "Router with NAT",
                        "Switch with VLANs",
                        "Firewall with zone-based policies",
                        "Load balancer"
                    ],
                    correct: 2,
                    explanation: "A firewall with zone-based policies can create separate security zones for guests and corporate users."
                },
                {
                    id: 7,
                    type: "fill-blank",
                    question: "A _______ acts as an intermediary between clients and servers, often providing caching and content filtering.",
                    correct: ["proxy", "proxy server"],
                    explanation: "A proxy server acts as an intermediary, forwarding requests and often providing additional services like caching."
                },
                {
                    id: 8,
                    type: "multiple-choice",
                    question: "What is the difference between NAS and SAN?",
                    options: [
                        "NAS is faster than SAN",
                        "NAS provides file-level access, SAN provides block-level access",
                        "NAS is more expensive than SAN",
                        "There is no difference"
                    ],
                    correct: 1,
                    explanation: "NAS provides file-level storage access over the network, while SAN provides block-level storage access."
                },
                {
                    id: 9,
                    type: "multiple-choice",
                    question: "Which function helps prevent routing loops by limiting packet lifetime?",
                    options: [
                        "QoS (Quality of Service)",
                        "VPN (Virtual Private Network)",
                        "TTL (Time To Live)",
                        "CDN (Content Delivery Network)"
                    ],
                    correct: 2,
                    explanation: "TTL (Time To Live) decrements at each hop and prevents routing loops by dropping packets when TTL reaches zero."
                },
                {
                    id: 10,
                    type: "multiple-choice",
                    question: "What is the primary benefit of a CDN (Content Delivery Network)?",
                    options: [
                        "Improved security through encryption",
                        "Reduced latency by caching content closer to users",
                        "Better routing between networks",
                        "Increased bandwidth capacity"
                    ],
                    correct: 1,
                    explanation: "CDNs cache content at edge locations closer to users, reducing latency and improving performance."
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
                },
                {
                    id: 2,
                    type: "multiple-choice",
                    question: "What is the key difference between a managed and unmanaged switch?",
                    options: [
                        "Managed switches are faster",
                        "Managed switches support VLANs and configuration options",
                        "Unmanaged switches are more secure",
                        "There is no functional difference"
                    ],
                    correct: 1,
                    explanation: "Managed switches offer configuration options like VLANs, QoS, and port management, while unmanaged switches operate with fixed configurations."
                },
                {
                    id: 3,
                    type: "true-false",
                    question: "A wireless controller is necessary for all wireless access point deployments.",
                    correct: false,
                    explanation: "Autonomous access points can operate independently, while lightweight access points require a wireless controller."
                },
                {
                    id: 4,
                    type: "drag-drop",
                    question: "Match each appliance with its primary security function:",
                    items: [
                        { id: "firewall", text: "Firewall" },
                        { id: "ids", text: "IDS" },
                        { id: "ips", text: "IPS" },
                        { id: "proxy", text: "Proxy" }
                    ],
                    targets: [
                        { id: "block", text: "Blocks traffic based on rules", correct: "firewall" },
                        { id: "detect", text: "Detects and alerts on threats", correct: "ids" },
                        { id: "prevent", text: "Actively prevents threats", correct: "ips" },
                        { id: "filter", text: "Content filtering and caching", correct: "proxy" }
                    ]
                },
                {
                    id: 5,
                    type: "multiple-choice",
                    question: "Which technology allows multiple virtual appliances to run on a single physical server?",
                    options: [
                        "Load balancing",
                        "Virtualization",
                        "Clustering",
                        "Redundancy"
                    ],
                    correct: 1,
                    explanation: "Virtualization allows multiple virtual appliances (like virtual firewalls or routers) to run on a single physical server."
                },
                {
                    id: 6,
                    type: "fill-blank",
                    question: "_______ prioritizes network traffic to ensure critical applications receive adequate bandwidth and low latency.",
                    correct: ["QoS", "Quality of Service"],
                    explanation: "Quality of Service (QoS) prioritizes traffic based on application requirements and business policies."
                },
                {
                    id: 7,
                    type: "scenario",
                    question: "Your network monitoring shows unusual traffic patterns suggesting a potential security breach. Which appliance would provide detailed analysis of this traffic?",
                    options: [
                        "Router with access lists",
                        "IDS with packet analysis",
                        "Load balancer with health checks",
                        "Switch with port mirroring"
                    ],
                    correct: 1,
                    explanation: "An IDS with packet analysis capabilities can examine traffic patterns and detect potential security threats."
                },
                {
                    id: 8,
                    type: "multiple-choice",
                    question: "What is the primary advantage of using a VPN concentrator?",
                    options: [
                        "Faster internet speeds",
                        "Better wireless coverage",
                        "Secure remote access to corporate networks",
                        "Improved local network performance"
                    ],
                    correct: 2,
                    explanation: "VPN concentrators provide secure, encrypted connections for remote users to access corporate networks over the internet."
                },
                {
                    id: 9,
                    type: "true-false",
                    question: "PoE (Power over Ethernet) switches can provide power to wireless access points through the network cable.",
                    correct: true,
                    explanation: "PoE switches can provide both data and power to compatible devices like wireless access points, IP phones, and cameras through Ethernet cables."
                },
                {
                    id: 10,
                    type: "multiple-choice",
                    question: "In a spine-leaf data center architecture, which appliances typically function as spine devices?",
                    options: [
                        "Access switches",
                        "High-performance Layer 3 switches/routers",
                        "Firewalls",
                        "Load balancers"
                    ],
                    correct: 1,
                    explanation: "Spine devices in a spine-leaf architecture are typically high-performance Layer 3 switches or routers that interconnect all leaf switches."
                }
            ]
        }
    },

    // Continue with quizzes for objectives 1.3 through 1.8...
    "1.3": {
        quizA: {
            title: "Cloud Concepts & Connectivity - Quiz A",
            questions: [
                {
                    id: 1,
                    type: "multiple-choice",
                    question: "What does NFV (Network Functions Virtualization) primarily accomplish?",
                    options: [
                        "Virtualizes server hardware",
                        "Virtualizes network services traditionally run on dedicated hardware",
                        "Provides cloud storage",
                        "Manages virtual machines"
                    ],
                    correct: 1,
                    explanation: "NFV virtualizes network functions like firewalls, load balancers, and routers that traditionally required dedicated hardware appliances."
                },
                {
                    id: 2,
                    type: "drag-drop",
                    question: "Match each service model with its description:",
                    items: [
                        {id: "saas", text: "SaaS"},
                        {id: "paas", text: "PaaS"},
                        {id: "iaas", text: "IaaS"}
                    ],
                    targets: [
                        {id: "software", text: "Complete applications (Office 365, Gmail)", correct: "saas"},
                        {id: "platform", text: "Development platforms and tools", correct: "paas"},
                        {id: "infrastructure", text: "Virtual machines and storage", correct: "iaas"}
                    ]
                },
                {
                    id: 3,
                    type: "true-false",
                    question: "A VPC (Virtual Private Cloud) provides an isolated environment within a public cloud.",
                    correct: true,
                    explanation: "A VPC creates a logically isolated section of a public cloud where you can launch resources in a virtual network you define."
                },
                {
                    id: 4,
                    type: "multiple-choice",
                    question: "What is the primary function of an Internet Gateway in a cloud environment?",
                    options: [
                        "Provide outbound-only internet access",
                        "Enable bidirectional internet connectivity for VPC resources",
                        "Connect multiple VPCs together",
                        "Provide DNS resolution services"
                    ],
                    correct: 1,
                    explanation: "An Internet Gateway provides bidirectional internet connectivity, allowing resources in a VPC to communicate with the internet."
                },
                {
                    id: 5,
                    type: "scenario",
                    question: "Your company wants to provide internet access to private cloud instances without exposing them to inbound internet traffic. Which solution is most appropriate?",
                    options: [
                        "Internet Gateway",
                        "NAT Gateway",
                        "VPN Gateway",
                        "Direct Connect"
                    ],
                    correct: 1,
                    explanation: "A NAT Gateway allows outbound internet access from private instances while preventing inbound connections from the internet."
                }
            ]
        },
        quizB: {
            title: "Cloud Concepts Advanced - Quiz B",
            questions: [
                // Additional questions for 1.3 Quiz B would go here
                {
                    id: 1,
                    type: "multiple-choice",
                    question: "Which deployment model combines both public and private cloud resources?",
                    options: [
                        "Public cloud",
                        "Private cloud",
                        "Hybrid cloud",
                        "Community cloud"
                    ],
                    correct: 2,
                    explanation: "Hybrid cloud combines public and private cloud resources, allowing data and applications to be shared between them."
                }
                // ... more questions
            ]
        },

        "1.4": {
            quizA: {
                title: "Ports, Protocols & Traffic Types - Quiz A",
                questions: [
                    {
                        id: 1,
                        type: "multiple-choice",
                        question: "Which port is used by HTTPS traffic?",
                        options: ["80", "443", "22", "25"],
                        correct: 1,
                        explanation: "HTTPS uses port 443 for secure web traffic, while HTTP uses port 80."
                    },
                    {
                        id: 2,
                        type: "drag-drop",
                        question: "Match each protocol with its default port:",
                        items: [
                            {id: "ssh", text: "SSH"},
                            {id: "ftp", text: "FTP"},
                            {id: "dns", text: "DNS"},
                            {id: "smtp", text: "SMTP"}
                        ],
                        targets: [
                            {id: "port22", text: "Port 22", correct: "ssh"},
                            {id: "port21", text: "Port 21", correct: "ftp"},
                            {id: "port53", text: "Port 53", correct: "dns"},
                            {id: "port25", text: "Port 25", correct: "smtp"}
                        ]
                    },
                    {
                        id: 3,
                        type: "true-false",
                        question: "TCP provides guaranteed delivery of data packets.",
                        correct: true,
                        explanation: "TCP is a connection-oriented protocol that provides reliable, ordered delivery of data with error checking and retransmission."
                    },
                    {
                        id: 4,
                        type: "multiple-choice",
                        question: "Which traffic type sends data to all devices in a broadcast domain?",
                        options: ["Unicast", "Multicast", "Broadcast", "Anycast"],
                        correct: 2,
                        explanation: "Broadcast traffic is sent to all devices within the same broadcast domain (subnet)."
                    },
                    {
                        id: 5,
                        type: "scenario",
                        question: "A video streaming application needs to prioritize performance over reliability. Which protocol would be most appropriate?",
                        options: ["TCP", "UDP", "ICMP", "GRE"],
                        correct: 1,
                        explanation: "UDP is connectionless and faster than TCP, making it suitable for real-time applications like video streaming where speed is more important than guaranteed delivery."
                    },
                    {
                        id: 6,
                        type: "fill-blank",
                        question: "_______ is used for secure file transfers and operates on port 22.",
                        correct: ["SFTP", "SSH", "Secure File Transfer Protocol"],
                        explanation: "SFTP (Secure File Transfer Protocol) uses SSH on port 22 for secure file transfers."
                    },
                    {
                        id: 7,
                        type: "multiple-choice",
                        question: "What is the primary purpose of ICMP?",
                        options: [
                            "File transfer",
                            "Web browsing",
                            "Network diagnostics and error reporting",
                            "Email delivery"
                        ],
                        correct: 2,
                        explanation: "ICMP (Internet Control Message Protocol) is used for network diagnostics (ping, traceroute) and error reporting."
                    },
                    {
                        id: 8,
                        type: "multiple-choice",
                        question: "Which IPSec component provides encryption?",
                        options: ["AH (Authentication Header)", "ESP (Encapsulating Security Payload)", "IKE (Internet Key Exchange)", "GRE"],
                        correct: 1,
                        explanation: "ESP (Encapsulating Security Payload) provides both encryption and authentication, while AH only provides authentication."
                    },
                    {
                        id: 9,
                        type: "true-false",
                        question: "Multicast traffic is sent from one sender to multiple specific receivers.",
                        correct: true,
                        explanation: "Multicast allows one sender to transmit data to multiple receivers who have joined a specific multicast group."
                    },
                    {
                        id: 10,
                        type: "multiple-choice",
                        question: "Which port does RDP (Remote Desktop Protocol) use by default?",
                        options: ["3389", "1433", "5060", "514"],
                        correct: 0,
                        explanation: "RDP uses port 3389 for remote desktop connections to Windows systems."
                    }
                ]
            },
            quizB: {
                title: "Ports, Protocols & Traffic Advanced - Quiz B",
                questions: [
                    {
                        id: 1,
                        type: "scenario",
                        question: "Your firewall logs show traffic on port 1433. What type of service is likely running on the destination server?",
                        options: ["Web server", "Database server", "Mail server", "DNS server"],
                        correct: 1,
                        explanation: "Port 1433 is the default port for Microsoft SQL Server, indicating a database service."
                    },
                    {
                        id: 2,
                        type: "multiple-choice",
                        question: "What is the key difference between SMTP (port 25) and SMTPS (port 587)?",
                        options: [
                            "SMTPS is faster",
                            "SMTPS provides encryption",
                            "SMTP is more reliable",
                            "No functional difference"
                        ],
                        correct: 1,
                        explanation: "SMTPS (port 587) provides encrypted email transmission, while traditional SMTP (port 25) sends email in plain text."
                    },
                    {
                        id: 3,
                        type: "drag-drop",
                        question: "Match each protocol characteristic with TCP or UDP:",
                        items: [
                            {id: "reliable", text: "Reliable delivery"},
                            {id: "fast", text: "Lower overhead"},
                            {id: "ordered", text: "Ordered delivery"},
                            {id: "connectionless", text: "Connectionless"}
                        ],
                        targets: [
                            {id: "tcp1", text: "TCP", correct: "reliable"},
                            {id: "udp1", text: "UDP", correct: "fast"},
                            {id: "tcp2", text: "TCP", correct: "ordered"},
                            {id: "udp2", text: "UDP", correct: "connectionless"}
                        ]
                    },
                    {
                        id: 4,
                        type: "true-false",
                        question: "Anycast routing sends packets to the nearest member of a group of potential receivers.",
                        correct: true,
                        explanation: "Anycast delivers packets to the nearest (in routing distance) member of a group of hosts, commonly used for DNS root servers."
                    },
                    {
                        id: 5,
                        type: "multiple-choice",
                        question: "Which ports are used by DHCP?",
                        options: ["67/68", "53/853", "161/162", "20/21"],
                        correct: 0,
                        explanation: "DHCP uses ports 67 (server) and 68 (client) for dynamic IP address assignment."
                    },
                    {
                        id: 6,
                        type: "scenario",
                        question: "A network administrator wants to tunnel multiple protocols through a single connection. Which protocol would be most appropriate?",
                        options: ["TCP", "UDP", "GRE", "ICMP"],
                        correct: 2,
                        explanation: "GRE (Generic Routing Encapsulation) is specifically designed for tunneling multiple protocols through a single connection."
                    },
                    {
                        id: 7,
                        type: "fill-blank",
                        question: "The _______ component of IPSec is responsible for establishing security associations and exchanging keys.",
                        correct: ["IKE", "Internet Key Exchange"],
                        explanation: "IKE (Internet Key Exchange) establishes security associations and manages key exchange for IPSec connections."
                    },
                    {
                        id: 8,
                        type: "multiple-choice",
                        question: "Which traffic type would be most appropriate for software updates distributed to multiple computers?",
                        options: ["Unicast", "Multicast", "Broadcast", "Anycast"],
                        correct: 1,
                        explanation: "Multicast is efficient for distributing the same content (like software updates) to multiple receivers simultaneously."
                    },
                    {
                        id: 9,
                        type: "multiple-choice",
                        question: "What is the primary difference between HTTP and HTTPS besides encryption?",
                        options: [
                            "Different ports (80 vs 443)",
                            "Different protocols (TCP vs UDP)",
                            "Different data formats",
                            "Only the port difference"
                        ],
                        correct: 0,
                        explanation: "The primary differences are encryption and port numbers: HTTP uses port 80, HTTPS uses port 443 and adds SSL/TLS encryption."
                    },
                    {
                        id: 10,
                        type: "scenario",
                        question: "Your VoIP system is experiencing call quality issues. Which traffic type and protocol combination is most likely being used?",
                        options: [
                            "Unicast with TCP",
                            "Unicast with UDP",
                            "Multicast with TCP",
                            "Broadcast with UDP"
                        ],
                        correct: 1,
                        explanation: "VoIP typically uses unicast UDP for real-time audio transmission due to UDP's lower latency compared to TCP."
                    }
                ]
            }
        },

        "1.5": {
            quizA: {
                title: "Transmission Media & Transceivers - Quiz A",
                questions: [
                    {
                        id: 1,
                        type: "multiple-choice",
                        question: "What is the maximum speed supported by Cat6a cable?",
                        options: ["1 Gbps", "10 Gbps", "25 Gbps", "40 Gbps"],
                        correct: 1,
                        explanation: "Cat6a cable supports up to 10 Gbps over distances up to 100 meters."
                    },
                    {
                        id: 2,
                        type: "true-false",
                        question: "Single-mode fiber supports longer distances than multimode fiber.",
                        correct: true,
                        explanation: "Single-mode fiber has a smaller core (9μm) allowing light to travel in a straight path, supporting much longer distances than multimode fiber."
                    },
                    {
                        id: 3,
                        type: "drag-drop",
                        question: "Match each connector type with its typical use:",
                        items: [
                            {id: "rj45", text: "RJ45"},
                            {id: "lc", text: "LC"},
                            {id: "sc", text: "SC"},
                            {id: "bnc", text: "BNC"}
                        ],
                        targets: [
                            {id: "ethernet", text: "Ethernet copper", correct: "rj45"},
                            {id: "fiber1", text: "Small form factor fiber", correct: "lc"},
                            {id: "fiber2", text: "Push-pull fiber", correct: "sc"},
                            {id: "coax", text: "Coaxial cable", correct: "bnc"}
                        ]
                    },
                    {
                        id: 4,
                        type: "multiple-choice",
                        question: "Which wireless standard operates in the 6GHz frequency band?",
                        options: ["802.11n", "802.11ac", "802.11ax", "802.11g"],
                        correct: 2,
                        explanation: "802.11ax (Wi-Fi 6E) is the first standard to operate in the 6GHz band, in addition to 2.4GHz and 5GHz."
                    },
                    {
                        id: 5,
                        type: "scenario",
                        question: "You need to connect two switches in a data center with a high-speed, short-distance connection. Which cable type would be most cost-effective?",
                        options: ["Single-mode fiber", "Multimode fiber", "DAC (Direct Attach Copper)", "Cat6a"],
                        correct: 2,
                        explanation: "DAC (Direct Attach Copper) cables are cost-effective for short, high-speed data center connections, typically under 10 meters."
                    }
                ]
            },
            quizB: {
                title: "Transmission Media Advanced - Quiz B",
                questions: [
                    {
                        id: 1,
                        type: "scenario",
                        question: "A building installation requires cable in air handling spaces. Which cable characteristic is most important?",
                        options: ["Higher bandwidth", "Plenum rating", "Shielding", "Longer length"],
                        correct: 1,
                        explanation: "Plenum-rated cables are required in air handling spaces due to fire safety regulations - they produce less toxic smoke when burned."
                    },
                    {
                        id: 2,
                        type: "multiple-choice",
                        question: "What is the main advantage of QSFP over SFP transceivers?",
                        options: [
                            "Lower cost",
                            "Higher port density and speed",
                            "Better compatibility",
                            "Longer transmission distance"
                        ],
                        correct: 1,
                        explanation: "QSFP (Quad SFP) provides four times the data rate and higher port density compared to standard SFP transceivers."
                    }
                ]
            }
        },

        "1.6": {
            quizA: {
                title: "Network Topologies & Architectures - Quiz A",
                questions: [
                    {
                        id: 1,
                        type: "multiple-choice",
                        question: "Which topology provides the highest level of redundancy?",
                        options: ["Star", "Bus", "Ring", "Full mesh"],
                        correct: 3,
                        explanation: "Full mesh topology connects every device to every other device, providing the highest redundancy but at high cost and complexity."
                    },
                    {
                        id: 2,
                        type: "scenario",
                        question: "A data center needs predictable latency and high bandwidth between any two servers. Which architecture is most appropriate?",
                        options: ["Three-tier hierarchical", "Spine-leaf", "Star", "Ring"],
                        correct: 1,
                        explanation: "Spine-leaf architecture provides predictable latency and high bandwidth with any server being exactly two hops away from any other server."
                    }
                ]
            },
            quizB: {
                title: "Network Topologies Advanced - Quiz B",
                questions: [
                    {
                        id: 1,
                        type: "drag-drop",
                        question: "Match each three-tier layer with its function:",
                        items: [
                            {id: "core", text: "Core"},
                            {id: "distribution", text: "Distribution"},
                            {id: "access", text: "Access"}
                        ],
                        targets: [
                            {id: "backbone", text: "High-speed backbone", correct: "core"},
                            {id: "policy", text: "Policy enforcement", correct: "distribution"},
                            {id: "enduser", text: "End-user connectivity", correct: "access"}
                        ]
                    }
                ]
            }
        },

        "1.7": {
            quizA: {
                title: "IPv4 Network Addressing - Quiz A",
                questions: [
                    {
                        id: 1,
                        type: "multiple-choice",
                        question: "Which IP address range is reserved for private use according to RFC1918?",
                        options: [
                            "172.32.0.0/12",
                            "172.16.0.0/12",
                            "192.169.0.0/16",
                            "10.0.0.0/16"
                        ],
                        correct: 1,
                        explanation: "172.16.0.0/12 (172.16.0.0 - 172.31.255.255) is one of the three RFC1918 private address ranges."
                    },
                    {
                        id: 2,
                        type: "true-false",
                        question: "APIPA addresses are in the range 169.254.0.0/16.",
                        correct: true,
                        explanation: "APIPA (Automatic Private IP Addressing) uses the 169.254.0.0/16 range when DHCP is unavailable."
                    },
                    {
                        id: 3,
                        type: "multiple-choice",
                        question: "How many usable host addresses are available in a /26 subnet?",
                        options: ["62", "64", "30", "32"],
                        correct: 0,
                        explanation: "A /26 subnet has 6 host bits (2^6 = 64 total addresses). Subtracting network and broadcast addresses leaves 62 usable addresses."
                    }
                ]
            },
            quizB: {
                title: "IPv4 Addressing Advanced - Quiz B",
                questions: [
                    {
                        id: 1,
                        type: "scenario",
                        question: "You need to subnet 192.168.1.0/24 to support 4 departments with 50 hosts each. What subnet mask should you use?",
                        options: ["/25", "/26", "/27", "/28"],
                        correct: 1,
                        explanation: "A /26 provides 62 usable addresses per subnet (enough for 50 hosts) and creates 4 subnets from a /24 network."
                    }
                ]
            }
        },

        "1.8": {
            quizA: {
                title: "Modern Network Environments - Quiz A",
                questions: [
                    {
                        id: 1,
                        type: "multiple-choice",
                        question: "What is a key characteristic of SD-WAN?",
                        options: [
                            "Requires MPLS connections",
                            "Application-aware routing",
                            "Only works with single ISP",
                            "Limited to small networks"
                        ],
                        correct: 1,
                        explanation: "SD-WAN provides application-aware routing, intelligently directing traffic based on application requirements and network conditions."
                    },
                    {
                        id: 2,
                        type: "true-false",
                        question: "Zero Trust Architecture assumes all network traffic is untrusted by default.",
                        correct: true,
                        explanation: "Zero Trust operates on the principle of 'never trust, always verify' - no user or device is trusted by default."
                    }
                ]
            },
            quizB: {
                title: "Modern Networks Advanced - Quiz B",
                questions: [
                    {
                        id: 1,
                        type: "multiple-choice",
                        question: "Which technology addresses IPv4 address exhaustion?",
                        options: ["VXLAN", "SD-WAN", "IPv6", "SASE"],
                        correct: 2,
                        explanation: "IPv6 with its 128-bit address space provides virtually unlimited addresses, solving IPv4 exhaustion."
                    }
                ]
            }
        }
    }}