export const DUMMY_CARDS = [
    {
        _id: "c1",
        name: "Rahul Sharma",
        designation: "Sales Manager",
        company: "Sunrise Solar Pvt Ltd",
        phone: "+91 98765 43210",
        email: "rahul@sunrisesolar.in",
        website: "www.sunrisesolar.in",
        address: "Plot 21, Sector 18, Gurugram, Haryana",
        createdAt: new Date().toISOString(),
    },
    {
        _id: "c2",
        name: "Priya Verma",
        designation: "HR Director",
        company: "BrightHire Consulting",
        phone: "+91 91234 56780",
        email: "priya@brighthire.com",
        website: "www.brighthire.com",
        address: "4th Floor, Cyber Hub, Delhi",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
        _id: "c3",
        name: "Amit Khanna",
        designation: "Founder",
        company: "Khanna Logistics",
        phone: "+91 99887 76655",
        email: "amit@khannalogistics.com",
        website: "www.khannalogistics.com",
        address: "Warehouse 7, Noida Phase 2, UP",
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
];

// fake OCR results: one is picked at random on every scan
const SAMPLE_SCANS = [
    {
        name: "Neha Gupta",
        designation: "Marketing Head",
        company: "Zenith Retail",
        phone: "+91 97000 11223",
        email: "neha.gupta@zenithretail.com",
        website: "www.zenithretail.com",
        address: "12 MG Road, Bengaluru, Karnataka",
    },
    {
        name: "Vikram Singh",
        designation: "Regional Director",
        company: "Apex Infra Ltd",
        phone: "+91 98100 55667",
        email: "vikram@apexinfra.in",
        website: "www.apexinfra.in",
        address: "Tower B, Connaught Place, New Delhi",
    },
    {
        name: "Sana Khan",
        designation: "Operations Lead",
        company: "FreshKart Foods",
        phone: "+91 90909 88776",
        email: "sana@freshkart.in",
        website: "www.freshkart.in",
        address: "Andheri East, Mumbai, Maharashtra",
    },
];

// pretend OCR: waits ~1.8s, then returns the same shape your real API will return
export const mockScan = () =>
    new Promise((resolve) =>
        setTimeout(() => {
            const data = SAMPLE_SCANS[Math.floor(Math.random() * SAMPLE_SCANS.length)];
            resolve({ data: { success: true, data } });
        }, 1800),
    );