// constants/glossary.ts

export const GLOSSARY_TERMS: Record<string, { term: string; definition: string }[]> = {
    'CompTIA A+ Core 1': [
        { term: 'BIOS', definition: 'Basic Input/Output System; initializes hardware at startup.' },
        { term: 'IP Address', definition: 'A unique identifier for devices on a network.' },
        { term: 'Virtualization', definition: 'Running multiple OS environments on one physical machine.' },
    ],
    'CompTIA A+ Core 2': [
        { term: 'Registry', definition: 'Windows database storing OS and application settings.' },
        { term: 'Malware', definition: 'Software designed to harm, exploit, or disable computers.' },
    ],
    'CompTIA Network+': [
        { term: 'OSI Model', definition: 'Conceptual model with 7 layers for network communication.' },
        { term: 'TCP/IP', definition: 'Protocol suite for internet and network communication.' },
    ],
};

export const GLOSSARY_ACRONYMS: Record<string, { acronym: string; definition: string }[]> = {
    'CompTIA Network+': [
        { acronym: 'IPAM', definition: 'IP Address Management' },
        { acronym: 'DHCP', definition: 'Dynamic Host Configuration Protocol' },
        { acronym: 'DNS', definition: 'Domain Name System' },
        { acronym: 'VPN', definition: 'Virtual Private Network' },
    ],
    'CompTIA Security+': [
        { acronym: 'ACL', definition: 'Access Control List' },
        { acronym: 'MFA', definition: 'Multi-Factor Authentication' },
    ],
};
