export const COMPLETE_DOMAIN_1_QUIZZES = {
    ...DOMAIN_1_QUIZZES,

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
                        { id: "ssh", text: "SSH" },
                        { id: "ftp", text: "FTP" },
                        { id: "dns", text: "DNS" },
                        { id: "smtp", text: "SMTP" }
                    ],
                    targets: [
                        { id: "port22", text: "Port 22", correct: "ssh" },
                        { id: "port21", text: "Port 21", correct: "ftp" },
                        { id: "port53", text: "Port 53", correct: "dns" },
                        { id: "port25", text: "Port 25", correct: "smtp" }
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
                        { id: "reliable", text: "Reliable delivery" },
                        { id: "fast", text: "Lower overhead" },
                        { id: "ordered", text: "Ordered delivery" },
                        { id: "connectionless", text: "Connectionless" }
                    ],
                    targets: [
                        { id: "tcp1", text: "TCP", correct: "reliable" },
                        { id: "udp1", text: "UDP", correct: "fast" },
                        { id: "tcp2", text: "TCP", correct: "ordered" },
                        { id: "udp2", text: "UDP", correct: "connectionless" }
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
                        { id: "rj45", text: "RJ45" },
                        { id: "lc", text: "LC" },
                        { id: "sc", text: "SC" },
                        { id: "bnc", text: "BNC" }
                    ],
                    targets: [
                        { id: "ethernet", text: "Ethernet copper", correct: "rj45" },
                        { id: "fiber1", text: "Small form factor fiber", correct: "lc" },
                        { id: "fiber2", text: "Push-pull fiber", correct: "sc" },
                        { id: "coax", text: "Coaxial cable", correct: "bnc" }
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
                        { id: "core", text: "Core" },
                        { id: "distribution", text: "Distribution" },
                        { id: "access", text: "Access" }
                    ],
                    targets: [
                        { id: "backbone", text: "High-speed backbone", correct: "core" },
                        { id: "policy", text: "Policy enforcement", correct: "distribution" },
                        { id: "enduser", text: "End-user connectivity", correct: "access" }
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
};
