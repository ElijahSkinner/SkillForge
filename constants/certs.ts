
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
                { id: 2, name: 'Networking Appliances and Functions' },
                { id: 3, name: 'Cloud Concepts and Connectivity' },
                { id: 4, name: 'Ports, Protocols, and Traffic' },
                { id: 5, name: 'Transmission Media and Transceivers' },
                { id: 6, name: 'Network Topologies and Architectures' },
                { id: 7, name: 'IPv4 Network Addressing' },
                { id: 8, name: 'Modern Network Environments' },
            ],
        },
        //othermodules
    ],
};
