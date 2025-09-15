
import { ModuleType } from '@/types/certs';
export const CERTS_ROADMAP: Record<string, ModuleType[]> = {
    'CompTIA Network+': [
        {
            id: 1,
            name: 'Networking Concepts',
            weight: 23,
            completed: false,
            lessons: [
                { id: 1, name: 'OSI Model' },
                { id: 2, name: 'Networking Appliances, Applications, and Functions' },
                { id: 3, name: 'Cloud Concepts and Connectivity' },
                { id: 4, name: 'Ports, Protocols, and Traffic' },
                { id: 5, name: 'Transmission Media and Transceivers' },
                { id: 6, name: 'Network Topologies and Architectures' },
                { id: 7, name: 'IPv4 Network Addressing' },
                { id: 8, name: 'Modern Network Environments' },
            ],
        },
        {
            id: 2,
            name: 'Network Implementation',
            weight: 23,
            completed: false,
            lessons: [
                { id: 1, name: 'Channels: width, non-overlapping, regulatory' },
                { id: 2, name: '802.11h' },
                { id: 3, name: 'Frequency options: 2.4/5/6 GHz, band steering' },
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