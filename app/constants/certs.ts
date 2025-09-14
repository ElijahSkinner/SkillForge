export type ModuleType = {
    id: number;
    name: string;
    weight: number;
    completed: boolean;
};export const CERTS_ROADMAP = {
    'CompTIA A+ Core 1': [
        { id: 1, name: 'Mobile Devices', weight: 15, completed: false },
        { id: 2, name: 'Networking', weight: 20, completed: false },
        { id: 3, name: 'Hardware', weight: 25, completed: false },
        { id: 4, name: 'Virtualization & Cloud Computing', weight: 11, completed: false },
        { id: 5, name: 'Hardware & Network Troubleshooting', weight: 29, completed: false },
    ],
    'CompTIA A+ Core 2': [
        { id: 1, name: 'Operating Systems', weight: 28, completed: false },
        { id: 2, name: 'Security', weight: 28, completed: false },
        { id: 3, name: 'Software Troubleshooting', weight: 23, completed: false },
        { id: 4, name: 'Operational Procedures', weight: 21, completed: false },
    ],
    'CompTIA Network+': [
        { id: 1, name: 'Networking Basics', weight: 20, completed: false },
        { id: 2, name: 'IP Addressing', weight: 15, completed: false },
        { id: 3, name: 'Protocols & Ports', weight: 15, completed: false },
        { id: 4, name: 'Network Security', weight: 20, completed: false },
        { id: 5, name: 'Troubleshooting', weight: 30, completed: false },
    ],
    // Add remaining 7 certs similarly
};
// types/certs.ts
