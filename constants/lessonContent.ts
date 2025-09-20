export const LESSON_CONTENT = {
    "1.1": {
        title: "OSI Reference Model",
        objective: "Explain concepts related to the Open Systems Interconnection (OSI) reference model",

        content: {
            introduction: `The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes network communication functions into seven distinct layers. Each layer has specific responsibilities and communicates with the layers directly above and below it.`,

            keyPoints: [
                "The OSI model provides a standard for different computer systems to communicate",
                "Each layer adds its own header (and sometimes trailer) to data",
                "Data flows down the stack when transmitting, up when receiving",
                "Understanding OSI helps with network troubleshooting and design"
            ],

            layers: {
                "Layer 7 - Application": {
                    description: "Provides network services directly to applications and end users",
                    functions: ["HTTP/HTTPS", "FTP", "SMTP", "DNS", "DHCP"],
                    examples: "Web browsers, email clients, file transfer applications",
                    troubleshooting: "Application-specific errors, authentication issues"
                },
                "Layer 6 - Presentation": {
                    description: "Handles data formatting, encryption, and compression",
                    functions: ["Encryption/Decryption", "Compression", "Data formatting"],
                    examples: "SSL/TLS encryption, JPEG compression, ASCII/Unicode",
                    troubleshooting: "Encryption errors, character encoding issues"
                },
                "Layer 5 - Session": {
                    description: "Manages sessions between applications",
                    functions: ["Session establishment", "Session maintenance", "Session termination"],
                    examples: "NetBIOS, RPC, SQL sessions",
                    troubleshooting: "Session timeouts, connection management issues"
                },
                "Layer 4 - Transport": {
                    description: "Provides reliable data delivery and error recovery",
                    functions: ["TCP (reliable)", "UDP (unreliable)", "Port addressing", "Flow control"],
                    examples: "TCP segments, UDP datagrams, port numbers",
                    troubleshooting: "Port connectivity, protocol mismatches"
                },
                "Layer 3 - Network": {
                    description: "Handles logical addressing and routing",
                    functions: ["IP addressing", "Routing", "Path determination"],
                    examples: "IPv4/IPv6 addresses, routers, ICMP",
                    troubleshooting: "Routing issues, IP conflicts, subnet problems"
                },
                "Layer 2 - Data Link": {
                    description: "Manages access to physical medium and error detection",
                    functions: ["MAC addressing", "Frame formatting", "Error detection"],
                    examples: "Ethernet frames, switches, MAC addresses",
                    troubleshooting: "Switch issues, MAC conflicts, frame errors"
                },
                "Layer 1 - Physical": {
                    description: "Defines physical characteristics of the network",
                    functions: ["Electrical signals", "Cable specifications", "Physical topology"],
                    examples: "Cables, hubs, repeaters, wireless signals",
                    troubleshooting: "Cable issues, signal problems, physical connectivity"
                }
            },

            realWorldScenario: `When troubleshooting network issues, technicians often use the OSI model:
            - Physical layer: Check cables and connections
            - Data link: Verify switch configurations and MAC tables
            - Network: Examine routing tables and IP configurations
            - Transport: Test port connectivity and protocol settings
            - Session/Presentation/Application: Debug application-specific issues`
        }
    },

    "1.2": {
        title: "Networking Appliances, Applications, and Functions",
        objective: "Compare and contrast networking appliances, applications, and functions",

        content: {
            introduction: `Modern networks rely on various appliances and functions to provide connectivity, security, and services. Understanding the role of each component is crucial for network design and troubleshooting.`,

            physicalVirtualAppliances: {
                router: {
                    function: "Routes traffic between different networks using Layer 3 addressing",
                    placement: "Network boundaries, connecting LANs to WANs",
                    keyFeatures: ["Routing tables", "NAT/PAT", "DHCP", "Firewall capabilities"]
                },
                switch: {
                    function: "Forwards traffic within a network using MAC addresses",
                    placement: "Core of LAN infrastructure",
                    keyFeatures: ["MAC address table", "VLANs", "Spanning Tree", "PoE"]
                },
                firewall: {
                    function: "Controls traffic flow based on security policies",
                    placement: "Network perimeter, between network segments",
                    keyFeatures: ["Stateful inspection", "Access control lists", "Deep packet inspection"]
                },
                idsIps: {
                    function: "IDS monitors and alerts on threats; IPS actively blocks them",
                    placement: "Network segments requiring monitoring",
                    keyFeatures: ["Signature-based detection", "Anomaly detection", "Real-time blocking"]
                },
                loadBalancer: {
                    function: "Distributes incoming requests across multiple servers",
                    placement: "In front of server farms",
                    keyFeatures: ["Health checking", "Session persistence", "SSL termination"]
                },
                proxy: {
                    function: "Acts as intermediary for client requests",
                    placement: "Between clients and servers",
                    keyFeatures: ["Caching", "Content filtering", "Anonymity"]
                },
                nas: {
                    function: "Network-attached storage for file sharing",
                    placement: "Connected to network for shared access",
                    keyFeatures: ["File protocols (NFS, SMB)", "RAID", "User permissions"]
                },
                san: {
                    function: "Storage area network for high-performance storage",
                    placement: "Dedicated storage network",
                    keyFeatures: ["Fibre Channel", "iSCSI", "High availability"]
                },
                wireless: {
                    accessPoint: "Provides wireless connectivity to wired network",
                    controller: "Manages multiple access points centrally"
                }
            },

            applications: {
                cdn: {
                    function: "Content delivery network that caches content closer to users",
                    benefits: ["Reduced latency", "Improved performance", "Load distribution"],
                    examples: "Cloudflare, Akamai, AWS CloudFront"
                }
            },

            functions: {
                vpn: {
                    function: "Creates secure tunnel over public networks",
                    types: ["Site-to-site", "Client-to-site", "Clientless"],
                    protocols: ["IPSec", "SSL/TLS", "L2TP"]
                },
                qos: {
                    function: "Prioritizes network traffic based on requirements",
                    mechanisms: ["Traffic shaping", "Packet marking", "Queue management"],
                    applications: "VoIP, video conferencing, critical applications"
                },
                ttl: {
                    function: "Time To Live prevents routing loops",
                    mechanism: "Decremented at each hop, packet dropped at zero",
                    applications: "Ping, traceroute, DNS caching"
                }
            }
        }
    },

    "1.3": {
        title: "Cloud Concepts and Connectivity Options",
        objective: "Summarize cloud concepts and connectivity options",

        content: {
            introduction: `Cloud computing has transformed how organizations deploy and manage IT resources. Understanding cloud concepts and connectivity options is essential for modern network professionals.`,

            cloudConcepts: {
                nfv: {
                    name: "Network Functions Virtualization",
                    description: "Virtualizes network services traditionally run on proprietary hardware",
                    benefits: ["Reduced costs", "Increased agility", "Centralized management"],
                    examples: "Virtual firewalls, load balancers, routers"
                },
                vpc: {
                    name: "Virtual Private Cloud",
                    description: "Isolated cloud environment within a public cloud",
                    features: ["Private IP ranges", "Subnets", "Security groups", "Route tables"],
                    providers: "AWS VPC, Azure VNet, Google VPC"
                },
                networkSecurityGroups: {
                    description: "Virtual firewalls controlling traffic to cloud resources",
                    features: ["Inbound/outbound rules", "Port-based filtering", "Protocol restrictions"]
                },
                networkSecurityLists: {
                    description: "Oracle Cloud equivalent of security groups",
                    features: ["Stateful/stateless rules", "CIDR-based filtering"]
                }
            },

            cloudGateways: {
                internetGateway: {
                    function: "Provides internet connectivity to VPC resources",
                    features: ["Bidirectional connectivity", "Highly available", "Scalable"]
                },
                natGateway: {
                    function: "Allows outbound internet access for private resources",
                    features: ["Outbound only", "High availability", "Managed service"]
                }
            },

            connectivityOptions: {
                vpn: {
                    description: "Site-to-site VPN connects on-premises to cloud",
                    types: ["Policy-based", "Route-based", "Customer gateway"],
                    considerations: ["Bandwidth limitations", "Internet dependency", "Encryption overhead"]
                },
                directConnect: {
                    description: "Dedicated private connection to cloud provider",
                    benefits: ["Consistent performance", "Reduced costs", "Private connectivity"],
                    examples: "AWS Direct Connect, Azure ExpressRoute, Google Cloud Interconnect"
                }
            },

            deploymentModels: {
                public: {
                    description: "Cloud services available to general public",
                    characteristics: ["Shared infrastructure", "Lower costs", "Less control"],
                    examples: "AWS, Azure, Google Cloud"
                },
                private: {
                    description: "Cloud services dedicated to single organization",
                    characteristics: ["Dedicated resources", "Higher security", "Greater control"],
                    deployment: "On-premises or hosted"
                },
                hybrid: {
                    description: "Combination of public and private clouds",
                    benefits: ["Flexibility", "Gradual migration", "Data sovereignty"],
                    challenges: "Complexity, integration, security"
                }
            },

            serviceModels: {
                saas: {
                    name: "Software as a Service",
                    description: "Complete applications delivered over internet",
                    examples: "Office 365, Salesforce, Gmail",
                    userResponsibility: "Data and user management"
                },
                paas: {
                    name: "Platform as a Service",
                    description: "Development platform and tools",
                    examples: "Azure App Service, Google App Engine",
                    userResponsibility: "Applications and data"
                },
                iaas: {
                    name: "Infrastructure as a Service",
                    description: "Virtualized computing resources",
                    examples: "EC2, Virtual Machines, Compute Engine",
                    userResponsibility: "OS, middleware, applications, data"
                }
            },

            cloudCharacteristics: {
                scalability: "Ability to increase resources to meet demand",
                elasticity: "Automatic scaling up and down based on demand",
                multitenancy: "Multiple customers sharing same infrastructure securely"
            }
        }
    },

    "1.4": {
        title: "Common Networking Ports, Protocols, Services, and Traffic Types",
        objective: "Explain common networking ports, protocols, services, and traffic types",

        content: {
            introduction: `Network communication relies on standardized ports and protocols. Understanding these is crucial for network configuration, security, and troubleshooting.`,

            commonPorts: {
                "20/21": { protocol: "FTP", description: "File Transfer Protocol - Data (20) and Control (21)" },
                "22": { protocol: "SSH/SFTP", description: "Secure Shell and Secure File Transfer Protocol" },
                "23": { protocol: "Telnet", description: "Unencrypted remote terminal access" },
                "25": { protocol: "SMTP", description: "Simple Mail Transfer Protocol - Email sending" },
                "53": { protocol: "DNS", description: "Domain Name System - Name resolution" },
                "67/68": { protocol: "DHCP", description: "Dynamic Host Configuration Protocol" },
                "69": { protocol: "TFTP", description: "Trivial File Transfer Protocol" },
                "80": { protocol: "HTTP", description: "Hypertext Transfer Protocol - Web traffic" },
                "123": { protocol: "NTP", description: "Network Time Protocol - Time synchronization" },
                "161/162": { protocol: "SNMP", description: "Simple Network Management Protocol" },
                "389": { protocol: "LDAP", description: "Lightweight Directory Access Protocol" },
                "443": { protocol: "HTTPS", description: "HTTP Secure - Encrypted web traffic" },
                "445": { protocol: "SMB", description: "Server Message Block - File sharing" },
                "514": { protocol: "Syslog", description: "System logging" },
                "587": { protocol: "SMTPS", description: "SMTP Secure - Encrypted email" },
                "636": { protocol: "LDAPS", description: "LDAP over SSL" },
                "1433": { protocol: "SQL Server", description: "Microsoft SQL Server" },
                "3389": { protocol: "RDP", description: "Remote Desktop Protocol" },
                "5060/5061": { protocol: "SIP", description: "Session Initiation Protocol - VoIP" }
            },

            ipTypes: {
                icmp: {
                    description: "Internet Control Message Protocol",
                    purpose: "Error reporting and network diagnostics",
                    examples: "Ping, traceroute, destination unreachable"
                },
                tcp: {
                    description: "Transmission Control Protocol",
                    characteristics: ["Connection-oriented", "Reliable", "Ordered delivery", "Flow control"],
                    useCases: "Web browsing, email, file transfers"
                },
                udp: {
                    description: "User Datagram Protocol",
                    characteristics: ["Connectionless", "Fast", "No guaranteed delivery", "Low overhead"],
                    useCases: "DNS, DHCP, streaming media, gaming"
                },
                gre: {
                    description: "Generic Routing Encapsulation",
                    purpose: "Tunnel protocol for encapsulating various protocols",
                    useCases: "VPN tunnels, connecting distant networks"
                },
                ipsec: {
                    description: "Internet Protocol Security",
                    components: {
                        ah: "Authentication Header - Provides authentication and integrity",
                        esp: "Encapsulating Security Payload - Provides encryption and authentication",
                        ike: "Internet Key Exchange - Establishes security associations"
                    }
                }
            },

            trafficTypes: {
                unicast: {
                    description: "One-to-one communication",
                    characteristics: "Single sender to single receiver",
                    examples: "Web browsing, email, file downloads"
                },
                multicast: {
                    description: "One-to-many communication",
                    characteristics: "Single sender to multiple receivers in group",
                    examples: "Video streaming, software updates, IPTV"
                },
                anycast: {
                    description: "One-to-nearest communication",
                    characteristics: "Single sender to nearest receiver from group",
                    examples: "DNS root servers, CDN"
                },
                broadcast: {
                    description: "One-to-all communication within broadcast domain",
                    characteristics: "Single sender to all devices in network segment",
                    examples: "ARP requests, DHCP discovery"
                }
            }
        }
    },

    "1.5": {
        title: "Transmission Media and Transceivers",
        objective: "Compare and contrast transmission media and transceivers",

        content: {
            introduction: `Physical transmission media and transceivers form the foundation of network connectivity. Understanding their characteristics helps in selecting appropriate solutions for different scenarios.`,

            wirelessMedia: {
                standards: {
                    "802.11": {
                        description: "WiFi standards for wireless LANs",
                        variants: {
                            "802.11a": "5GHz, 54Mbps",
                            "802.11b": "2.4GHz, 11Mbps",
                            "802.11g": "2.4GHz, 54Mbps",
                            "802.11n": "2.4/5GHz, 600Mbps",
                            "802.11ac": "5GHz, 6.93Gbps",
                            "802.11ax": "2.4/5/6GHz, 9.6Gbps"
                        }
                    }
                },
                cellular: {
                    description: "Mobile network technologies",
                    generations: ["3G", "4G LTE", "5G"],
                    useCases: "Mobile internet, IoT connectivity, backup connections"
                },
                satellite: {
                    description: "Communication via satellites",
                    types: ["LEO", "MEO", "GEO"],
                    characteristics: "High latency, wide coverage, weather dependent"
                }
            },

            wiredMedia: {
                ethernet: {
                    "802.3": "Ethernet standards for wired LANs",
                    speeds: {
                        "10BASE-T": "10 Mbps over Cat3/Cat5",
                        "100BASE-TX": "100 Mbps over Cat5",
                        "1000BASE-T": "1 Gbps over Cat5e/Cat6",
                        "10GBASE-T": "10 Gbps over Cat6a/Cat7"
                    }
                },
                fiberOptic: {
                    singleMode: {
                        description: "Long distance, single light path",
                        characteristics: ["9µm core", "Long distances", "Higher cost"],
                        useCases: "WAN links, campus backbones"
                    },
                    multiMode: {
                        description: "Shorter distance, multiple light paths",
                        characteristics: ["50µm or 62.5µm core", "Shorter distances", "Lower cost"],
                        useCases: "LAN connections, data centers"
                    }
                },
                copper: {
                    dac: {
                        description: "Direct Attach Copper - Short range high speed",
                        types: ["Twinaxial cable"],
                        useCases: "Data center connections, switch-to-switch"
                    },
                    coaxial: {
                        description: "Central conductor with shield",
                        useCases: "Cable internet, legacy networks",
                        impedance: "50Ω or 75Ω"
                    }
                },
                cableSpeeds: {
                    "Cat5": "100 Mbps",
                    "Cat5e": "1 Gbps",
                    "Cat6": "1 Gbps (10 Gbps short distance)",
                    "Cat6a": "10 Gbps",
                    "Cat7": "10 Gbps",
                    "Cat8": "25/40 Gbps"
                },
                plenum: {
                    description: "Fire-resistant cable for air handling spaces",
                    requirement: "Building codes for ceiling/floor installations",
                    alternative: "Non-plenum for general use"
                }
            },

            transceivers: {
                protocols: {
                    ethernet: "RJ45, SFP, QSFP for Ethernet networks",
                    fibreChannel: "FC connectors for storage networks"
                },
                formFactors: {
                    sfp: {
                        description: "Small Form-factor Pluggable",
                        speeds: "Up to 1 Gbps",
                        useCases: "Gigabit connections"
                    },
                    qsfp: {
                        description: "Quad Small Form-factor Pluggable",
                        speeds: "40 Gbps and higher",
                        useCases: "High-speed data center connections"
                    }
                }
            },

            connectorTypes: {
                fiber: {
                    sc: "Subscriber Connector - Push-pull coupling",
                    lc: "Local Connector - Small form factor",
                    st: "Straight Tip - Bayonet coupling",
                    mpo: "Multi-fiber Push On - High density"
                },
                copper: {
                    rj11: "4-pin connector for telephone",
                    rj45: "8-pin connector for Ethernet",
                    fType: "Coaxial connector for cable systems",
                    bnc: "Bayonet Neill-Concelman for coaxial"
                }
            }
        }
    },

    "1.6": {
        title: "Network Topologies, Architectures, and Types",
        objective: "Compare and contrast network topologies, architectures, and types",

        content: {
            introduction: `Network topology refers to the physical and logical arrangement of network components. Understanding different topologies helps in designing efficient and resilient networks.`,

            topologies: {
                mesh: {
                    description: "Every device connects to every other device",
                    types: ["Full mesh", "Partial mesh"],
                    advantages: ["High redundancy", "Multiple paths", "Fault tolerance"],
                    disadvantages: ["High cost", "Complex management", "Many connections"]
                },
                hybrid: {
                    description: "Combination of multiple topologies",
                    examples: "Star-bus, star-ring combinations",
                    advantages: ["Flexible design", "Scalable", "Optimized for needs"],
                    useCases: "Large enterprise networks"
                },
                starHubSpoke: {
                    description: "Central device connects to all other devices",
                    characteristics: ["Single point of failure", "Easy to manage", "Centralized control"],
                    examples: "Traditional Ethernet with switch, WAN connections"
                },
                spineLeaf: {
                    description: "Two-tier architecture for data centers",
                    structure: ["Leaf switches connect servers", "Spine switches interconnect leaves"],
                    benefits: ["Predictable latency", "High bandwidth", "Easy scaling"]
                },
                pointToPoint: {
                    description: "Direct connection between two devices",
                    characteristics: ["Dedicated link", "High security", "Simple"],
                    useCases: "WAN links, dedicated connections"
                }
            },

            architectures: {
                threeTierHierarchical: {
                    description: "Traditional enterprise network design",
                    layers: {
                        core: {
                            function: "High-speed backbone",
                            characteristics: ["Fast switching", "Redundancy", "No packet manipulation"],
                            devices: "High-end routers and switches"
                        },
                        distribution: {
                            function: "Policy enforcement and routing",
                            characteristics: ["Access control", "VLAN routing", "Aggregation"],
                            devices: "Layer 3 switches"
                        },
                        access: {
                            function: "End device connectivity",
                            characteristics: ["Port security", "PoE", "User access"],
                            devices: "Access switches, wireless APs"
                        }
                    }
                },
                collapsedCore: {
                    description: "Core and distribution layers combined",
                    useCases: "Smaller networks, branch offices",
                    benefits: ["Reduced cost", "Simplified design", "Fewer devices"]
                }
            },

            trafficFlows: {
                northSouth: {
                    description: "Traffic between data center and external networks",
                    characteristics: ["Client-server communication", "Internet traffic", "WAN connections"],
                    securityConsiderations: "Firewall inspection, DPI, perimeter security"
                },
                eastWest: {
                    description: "Traffic between servers within data center",
                    characteristics: ["Server-to-server", "Database replication", "Internal APIs"],
                    considerations: ["Microsegmentation", "Low latency", "High bandwidth"]
                }
            }
        }
    },

    "1.7": {
        title: "IPv4 Network Addressing",
        objective: "Given a scenario, use appropriate IPv4 network addressing",

        content: {
            introduction: `IPv4 addressing is fundamental to network communication. Understanding public vs private addressing, subnetting, and address classes enables proper network design and troubleshooting.`,

            addressTypes: {
                publicVsPrivate: {
                    public: {
                        description: "Globally routable addresses assigned by IANA",
                        characteristics: ["Unique worldwide", "Routable on internet", "Requires registration"],
                        management: "ISPs and regional registrars"
                    },
                    private: {
                        description: "Reserved for internal use (RFC1918)",
                        ranges: [
                            "10.0.0.0/8 (10.0.0.0 - 10.255.255.255)",
                            "172.16.0.0/12 (172.16.0.0 - 172.31.255.255)",
                            "192.168.0.0/16 (192.168.0.0 - 192.168.255.255)"
                        ],
                        characteristics: ["Not routed on internet", "Requires NAT for internet access"]
                    }
                },
                special: {
                    apipa: {
                        description: "Automatic Private IP Addressing",
                        range: "169.254.0.0/16",
                        purpose: "Self-assigned when DHCP fails"
                    },
                    loopback: {
                        description: "Local host communication",
                        range: "127.0.0.0/8",
                        common: "127.0.0.1 (localhost)"
                    }
                }
            },

            subnetting: {
                vlsm: {
                    description: "Variable Length Subnet Mask",
                    purpose: "Efficient IP address allocation",
                    benefit: "Reduces address waste",
                    example: "Using /30 for point-to-point links, /24 for LANs"
                },
                cidr: {
                    description: "Classless Inter-Domain Routing",
                    notation: "Network address followed by prefix length",
                    examples: [
                        "192.168.1.0/24 = 255.255.255.0",
                        "10.0.0.0/8 = 255.0.0.0",
                        "172.16.0.0/12 = 255.240.0.0"
                    ]
                },
                subnetCalculation: {
                    process: [
                        "Determine required subnets and hosts",
                        "Choose appropriate subnet mask",
                        "Calculate network and broadcast addresses",
                        "Assign usable host addresses"
                    ],
                    example: {
                        network: "192.168.1.0/26",
                        subnetMask: "255.255.255.192",
                        hosts: "62 usable addresses",
                        range: "192.168.1.1 - 192.168.1.62"
                    }
                }
            },

            addressClasses: {
                classA: {
                    range: "1.0.0.0 - 126.255.255.255",
                    defaultMask: "255.0.0.0 (/8)",
                    networks: "126 networks",
                    hostsPerNetwork: "16,777,214 hosts"
                },
                classB: {
                    range: "128.0.0.0 - 191.255.255.255",
                    defaultMask: "255.255.0.0 (/16)",
                    networks: "16,384 networks",
                    hostsPerNetwork: "65,534 hosts"
                },
                classC: {
                    range: "192.0.0.0 - 223.255.255.255",
                    defaultMask: "255.255.255.0 (/24)",
                    networks: "2,097,152 networks",
                    hostsPerNetwork: "254 hosts"
                },
                classD: {
                    range: "224.0.0.0 - 239.255.255.255",
                    purpose: "Multicast addressing",
                    note: "Not used for host addressing"
                },
                classE: {
                    range: "240.0.0.0 - 255.255.255.255",
                    purpose: "Experimental/research",
                    note: "Reserved for future use"
                }
            },

            practicalExamples: {
                scenario1: {
                    requirement: "Company needs 50 subnets with 100 hosts each",
                    solution: "Use /25 subnets (126 hosts) from a /19 network",
                    calculation: "Need 6 bits for subnets (2^6 = 64 > 50)"
                },
                scenario2: {
                    requirement: "Point-to-point WAN links",
                    solution: "Use /30 subnets (2 usable hosts)",
                    benefit: "Conserves IP addresses"
                }
            }
        }
    },

    "1.8": {
        title: "Evolving Use Cases for Modern Network Environments",
        objective: "Summarize evolving use cases for modern network environments",

        content: {
            introduction: `Modern networks are evolving to support new technologies and use cases. Understanding these trends is crucial for designing future-ready network infrastructure.`,

            sdnSdWan: {
                sdn: {
                    description: "Software-Defined Networking",
                    characteristics: [
                        "Centralized control plane",
                        "Programmable interfaces",
                        "Network abstraction",
                        "Dynamic configuration"
                    ],
                    benefits: ["Agility", "Centralized management", "Automation", "Innovation"]
                },
                sdWan: {
                    description: "Software-Defined Wide Area Network",
                    features: {
                        applicationAware: "Intelligent traffic routing based on application requirements",
                        zeroTouchProvisioning: "Automated device deployment and configuration",
                        transportAgnostic: "Works over any connection type (MPLS, internet, LTE)",
                        centralPolicyManagement: "Unified policy enforcement across all sites"
                    },
                    useCases: ["Branch office connectivity", "Cloud access optimization", "WAN cost reduction"]
                }
            },

            vxlan: {
                description: "Virtual Extensible Local Area Network",
                purpose: "Extends Layer 2 networks over Layer 3 infrastructure",
                features: {
                    dci: "Data Center Interconnect - Connects multiple data centers",
                    layer2Encapsulation: "Encapsulates Ethernet frames in UDP packets"
                },
                benefits: ["VLAN scalability beyond 4094", "Multi-tenant isolation", "Mobility support"]
            },

            zeroTrustArchitecture: {
                description: "Security model that trusts nothing by default",
                principles: {
                    policyBasedAuthentication: "Verify identity before granting access",
                    authorization: "Least privilege access control",
                    leastPrivilegeAccess: "Minimum necessary permissions"
                },
                implementation: ["Identity verification", "Device compliance", "Network segmentation", "Continuous monitoring"]
            },

            saseSse: {
                sase: {
                    description: "Secure Access Service Edge",
                    concept: "Converged network and security as cloud service",
                    components: ["SD-WAN", "CASB", "FWaaS", "ZTNA", "SWG"]
                },
                sse: {
                    description: "Security Service Edge",
                    focus: "Security services portion of SASE",
                    services: ["Cloud access security", "Secure web gateway", "Zero trust network access"]
                }
            },

            infrastructureAsCode: {
                description: "Managing infrastructure through code and automation",
                automation: {
                    playbooks: "Predefined automation scripts for common tasks",
                    templates: "Standardized configuration templates",
                    reusableTasks: "Modular automation components",
                    configurationDrift: "Detection and correction of configuration changes",
                    compliance: "Automated compliance checking and reporting",
                    upgrades: "Automated software and firmware updates",
                    dynamicInventories: "Automatically discovered and managed devices"
                },
                sourceControl: {
                    versionControl: "Track changes to infrastructure code",
                    centralRepository: "Single source of truth for configurations",
                    conflictIdentification: "Detect and resolve configuration conflicts",
                    branching: "Parallel development and testing workflows"
                },
                benefits: ["Consistency", "Repeatability", "Version control", "Reduced errors"]
            },

            ipv6Addressing: {
                purpose: "Next generation internet protocol addressing",
                benefits: {
                    mitigatingAddressExhaustion: "128-bit addresses provide virtually unlimited address space",
                    improvedSecurity: "Built-in IPSec support",
                    eliminatesNat: "End-to-end connectivity without translation"
                },
                compatibilityRequirements: {
                    tunneling: {
                        description: "IPv6 over IPv4 tunnels",
                        methods: ["6to4", "Teredo", "ISATAP"],
                        useCases: "Transition mechanism during dual-stack deployment"
                    },
                    dualStack: {
                        description: "Running IPv4 and IPv6 simultaneously",
                        implementation: "Both protocols active on same interface",
                        advantage: "Gradual migration path"
                    },
                    nat64: {
                        description: "Translation between IPv6 and IPv4",
                        purpose: "IPv6-only clients accessing IPv4 services",
                        components: ["DNS64", "NAT64 gateway"]
                    }
                },
                addressStructure: {
                    format: "Eight groups of four hexadecimal digits",
                    example: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
                    abbreviation: "2001:db8:85a3::8a2e:370:7334"
                }
            }
        }
    }
};
