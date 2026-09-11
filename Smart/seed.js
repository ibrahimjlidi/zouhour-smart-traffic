// Seed Data for Smart Network Traffic Management System
// Run this in MongoDB shell or use mongoimport

// ============================================
// 1. USERS DATA
// ============================================
db.utilisateurs.insertMany([
  {
    nom: "Ahmed Benzema",
    email: "ahmed.benzema@smartnet.com",
    motDePasse: "$2a$10$YourHashedPasswordHere1", // bcrypt hash
    role: "AdministrateurReseau",
    dateCreation: new Date("2024-01-15")
  },
  {
    nom: "Sarah Johnson",
    email: "sarah.johnson@smartnet.com",
    motDePasse: "$2a$10$YourHashedPasswordHere2",
    role: "ResponsableReseau",
    dateCreation: new Date("2024-02-10")
  },
  {
    nom: "Michel Dupont",
    email: "michel.dupont@smartnet.com",
    motDePasse: "$2a$10$YourHashedPasswordHere3",
    role: "AdministrateurReseau",
    dateCreation: new Date("2024-01-20")
  },
  {
    nom: "Lisa Chen",
    email: "lisa.chen@smartnet.com",
    motDePasse: "$2a$10$YourHashedPasswordHere4",
    role: "ResponsableReseau",
    dateCreation: new Date("2024-03-05")
  },
  {
    nom: "Carlos Rodriguez",
    email: "carlos.rodriguez@smartnet.com",
    motDePasse: "$2a$10$YourHashedPasswordHere5",
    role: "ResponsableReseau",
    dateCreation: new Date("2024-03-10")
  }
]);

// ============================================
// 2. COURSES DATA
// ============================================
db.cours.insertMany([
  {
    titre: "Network Fundamentals",
    description: "Learn the basics of computer networking including OSI model, TCP/IP stack, and network protocols",
    niveau: "Beginner",
    categorie: "Networking",
    pdf: "https://example.com/courses/network-fundamentals.pdf",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    titre: "Network Security Essentials",
    description: "Comprehensive guide to network security including firewalls, VPNs, encryption, and intrusion detection",
    niveau: "Intermediate",
    categorie: "Security",
    pdf: "https://example.com/courses/network-security.pdf",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    titre: "Advanced Threat Analysis",
    description: "Deep dive into threat analysis, vulnerability assessment, and penetration testing techniques",
    niveau: "Advanced",
    categorie: "Security",
    pdf: "https://example.com/courses/threat-analysis.pdf",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    titre: "Linux System Administration",
    description: "Master Linux system administration, user management, service configuration, and troubleshooting",
    niveau: "Intermediate",
    categorie: "Administration",
    pdf: "https://example.com/courses/linux-admin.pdf",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    titre: "Network Monitoring & Analytics",
    description: "Learn to monitor network performance using tools like Wireshark, tcpdump, and Splunk",
    niveau: "Intermediate",
    categorie: "Monitoring",
    pdf: "https://example.com/courses/monitoring.pdf",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    titre: "Traffic Analysis Mastery",
    description: "Expert-level course on analyzing network traffic patterns and detecting anomalies",
    niveau: "Advanced",
    categorie: "Monitoring",
    pdf: "https://example.com/courses/traffic-analysis.pdf",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// ============================================
// 3. ALERTS DATA
// ============================================
db.alertes.insertMany([
  {
    id: "alert-001",
    statut: "lue",
    dateEnvoi: new Date("2024-09-10T14:30:00Z"),
    destinataire: "ahmed.benzema@smartnet.com",
    message: "Suspicious SSH login attempt detected from 192.168.1.100",
    type: "attaque",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "alert-002",
    statut: "non_lue",
    dateEnvoi: new Date("2024-09-11T08:15:00Z"),
    destinataire: "sarah.johnson@smartnet.com",
    message: "Unusual bandwidth usage detected on port 443",
    type: "anomalie",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "alert-003",
    statut: "envoyee",
    dateEnvoi: new Date("2024-09-11T09:45:00Z"),
    destinataire: "michel.dupont@smartnet.com",
    message: "DDoS attack detected on web server",
    type: "attaque",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "alert-004",
    statut: "lue",
    dateEnvoi: new Date("2024-09-11T10:20:00Z"),
    destinataire: "lisa.chen@smartnet.com",
    message: "Database backup completed successfully",
    type: "systeme",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "alert-005",
    statut: "non_lue",
    dateEnvoi: new Date("2024-09-11T11:00:00Z"),
    destinataire: "carlos.rodriguez@smartnet.com",
    message: "Certificate expiration warning - 30 days remaining",
    type: "systeme",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "alert-006",
    statut: "lue",
    dateEnvoi: new Date("2024-09-11T12:30:00Z"),
    destinataire: "ahmed.benzema@smartnet.com",
    message: "Malware signature detected in outbound traffic",
    type: "attaque",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "alert-007",
    statut: "non_lue",
    dateEnvoi: new Date("2024-09-11T13:15:00Z"),
    destinataire: "sarah.johnson@smartnet.com",
    message: "System maintenance window completed",
    type: "information",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// ============================================
// 4. REPORTS DATA
// ============================================
db.rapports.insertMany([
  {
    titre: "Daily Traffic Summary - 2024-09-10",
    type: "PDF",
    contenu: "Daily network traffic analysis showing 2.5TB total throughput with peak usage at 14:30 UTC",
    fichier: "/reports/daily-2024-09-10.pdf",
    dateGeneration: new Date("2024-09-10T23:59:59Z"),
    utilisateur: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    titre: "Security Incidents Report - September 2024",
    type: "PDF",
    contenu: "Monthly security incident report detailing 5 major threats, 12 anomalies, and 3 successful blocks",
    fichier: "/reports/security-sep-2024.pdf",
    dateGeneration: new Date("2024-09-01T00:00:00Z"),
    utilisateur: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    titre: "Network Performance Metrics - Q3 2024",
    type: "EXCEL",
    contenu: "Quarterly network performance data including latency, packet loss, and bandwidth utilization",
    fichier: "/reports/performance-q3-2024.xlsx",
    dateGeneration: new Date("2024-09-30T00:00:00Z"),
    utilisateur: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    titre: "User Activity Log Export",
    type: "CSV",
    contenu: "Detailed CSV export of all user activities and access logs",
    fichier: "/reports/activity-log-2024-09.csv",
    dateGeneration: new Date("2024-09-15T12:00:00Z"),
    utilisateur: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    titre: "Compliance Audit Report",
    type: "PDF",
    contenu: "ISO 27001 compliance audit results with 95% compliance score",
    fichier: "/reports/compliance-audit-2024.pdf",
    dateGeneration: new Date("2024-09-05T08:00:00Z"),
    utilisateur: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// ============================================
// 5. NETWORK FILES DATA
// ============================================
db.fichiersreseaus.insertMany([
  {
    nomFichier: "network-capture-2024-09-10.pcap",
    typeFichier: "PCAP",
    taille: 524288000, // 500 MB
    dateImport: new Date("2024-09-10T14:30:00Z"),
    statut: "Analysé",
    cheminFichier: "/storage/pcap/network-capture-2024-09-10.pcap",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nomFichier: "traffic-analysis-09-11.pcapng",
    typeFichier: "PCAPNG",
    taille: 1073741824, // 1 GB
    dateImport: new Date("2024-09-11T08:00:00Z"),
    statut: "En cours d'analyse",
    cheminFichier: "/storage/pcapng/traffic-analysis-09-11.pcapng",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nomFichier: "network-logs-2024-09.csv",
    typeFichier: "CSV",
    taille: 52428800, // 50 MB
    dateImport: new Date("2024-09-01T00:00:00Z"),
    statut: "Analysé",
    cheminFichier: "/storage/csv/network-logs-2024-09.csv",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nomFichier: "firewall-traffic-dump.pcap",
    typeFichier: "PCAP",
    taille: 262144000, // 250 MB
    dateImport: new Date("2024-09-05T10:15:00Z"),
    statut: "Analysé",
    cheminFichier: "/storage/pcap/firewall-traffic-dump.pcap",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nomFichier: "vpn-traffic-2024-09-11.pcapng",
    typeFichier: "PCAPNG",
    taille: 314572800, // 300 MB
    dateImport: new Date("2024-09-11T09:30:00Z"),
    statut: "Importé",
    cheminFichier: "/storage/pcapng/vpn-traffic-2024-09-11.pcapng",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nomFichier: "corrupted-file.pcap",
    typeFichier: "PCAP",
    taille: 0,
    dateImport: new Date("2024-09-10T16:45:00Z"),
    statut: "Erreur",
    cheminFichier: "/storage/pcap/corrupted-file.pcap",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

console.log("✅ Seed data inserted successfully!");
