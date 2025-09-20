//constant/certs/ts
import { ModuleType } from '@/types/certs';
// types/certs.ts
export type LessonType = {
    id: number;
    name: string;
    hasQuizzes?: boolean; // Add this
};

export type ModuleType = {
    id: number;
    name: string;
    weight: number;
    completed: boolean;
    lessons: LessonType[];
};
export const CERTS_ROADMAP: Record<string, ModuleType[]> = {
    'CompTIA Network+': [
        {
            id: 1,
            name: 'Networking Concepts',
            weight: 23,
            completed: false,
            lessons: [
                {
                    id: 1,
                    name: '1.1 OSI Reference Model',
                    content: LESSON_CONTENT["1.1"],
                    quizzes: COMPLETE_DOMAIN_1_QUIZZES["1.1"]
                },
                {
                    id: 2,
                    name: '1.2 Networking Appliances & Functions',
                    content: LESSON_CONTENT["1.2"],
                    quizzes: COMPLETE_DOMAIN_1_QUIZZES["1.2"]
                },
                {
                    id: 3,
                    name: '1.3 Cloud Concepts & Connectivity',
                    content: LESSON_CONTENT["1.3"],
                    quizzes: COMPLETE_DOMAIN_1_QUIZZES["1.3"]
                },
                {
                    id: 4,
                    name: '1.4 Ports, Protocols & Traffic Types',
                    content: LESSON_CONTENT["1.4"],
                    quizzes: COMPLETE_DOMAIN_1_QUIZZES["1.4"]
                },
                {
                    id: 5,
                    name: '1.5 Transmission Media & Transceivers',
                    content: LESSON_CONTENT["1.5"],
                    quizzes: COMPLETE_DOMAIN_1_QUIZZES["1.5"]
                },
                {
                    id: 6,
                    name: '1.6 Network Topologies & Architectures',
                    content: LESSON_CONTENT["1.6"],
                    quizzes: COMPLETE_DOMAIN_1_QUIZZES["1.6"]
                },
                {
                    id: 7,
                    name: '1.7 IPv4 Network Addressing',
                    content: LESSON_CONTENT["1.7"],
                    quizzes: COMPLETE_DOMAIN_1_QUIZZES["1.7"]
                },
                {
                    id: 8,
                    name: '1.8 Modern Network Environments',
                    content: LESSON_CONTENT["1.8"],
                    quizzes: COMPLETE_DOMAIN_1_QUIZZES["1.8"]
                },
            ],
        },
        {
            id: 2,
            name: 'Network Implementation',
            weight: 23,
            completed: false,
            lessons: [
                { id: 1, name: 'Characteristics of Routing Technologies' },
                { id: 2, name: 'VLAN, Switching, and Features' },
                { id: 3, name: 'Configure Wireless Devices and Technologies' },
                { id: 4, name: 'SSID: BSSID vs ESSID' },
                { id: 5, name: 'Network types: mesh, ad hoc, point-to-point, infrastructure' },
                { id: 6, name: 'Encryption: WPA2, WPA3' },
                { id: 7, name: 'Guest networks & captive portals' },
                { id: 8, name: 'Authentication & antennas' },
            ],
        },
        {
            id: 3,
            name: 'Network Operations',
            weight: 23,
            completed: false,
            lessons: [
                { id: 1, name: 'IPv4/IPv6 services: DHCP, SLAAC, DNS, NTP, PTP, NTS' },
                { id: 2, name: 'Network access & management: VPNs, SSH, GUI, API, console, jump boxes' },
                { id: 3, name: 'Disaster recovery: RPO, RTO, MTTR, MTBF, DR sites, HA, testing' },
            ],
        },
        {
            id: 4,
            name: 'Network Security',
            weight: 23,
            completed: false,
            lessons: [
                { id: 1, name: 'Logical security: encryption, certificates, IAM, MFA, SSO, RADIUS, TACACS+' },
                { id: 2, name: 'Physical security: cameras, locks' },
                { id: 3, name: 'Deception technologies: honeypot, honeynet' },
                { id: 4, name: 'Security terminology & compliance: CIA, risk, GDPR, PCI DSS, segmentation' },
                { id: 5, name: 'Attack types: DoS/DDoS, VLAN hopping, ARP poisoning, rogue devices, social engineering, malware' },
                { id: 6, name: 'Network defense: device hardening, NAC, 802.1X, ACLs, URL/content filtering, zones' },
            ],
        },
        {
            id: 5,
            name: 'Network Troubleshooting',
            weight: 31,
            completed: false,
            lessons: [
                { id: 1, name: 'Troubleshooting methodology: identify, theorize, test, plan, resolve, document' },
                { id: 2, name: 'Cabling & physical issues: single/multi-mode, Cat5/6/7/8, STP/UTP, interference, termination, PoE, transceivers' },
                { id: 3, name: 'Network service issues: STP, VLAN, ACLs, routing, IP, gateway, subnet, address pool' },
                { id: 4, name: 'Performance issues: congestion, bottleneck, bandwidth, latency, jitter, wireless coverage & interference' },
                { id: 5, name: 'Tools: software/protocol analyzers, ping/traceroute/nslookup, Nmap, LLDP/CDP, speed tests, cable/testers, Wi-Fi analyzers, terminal emulators' },
            ],
        },
    ],
};