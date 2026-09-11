# 🌱 Seed Data Installation Guide

## Overview
This guide provides multiple methods to insert seed data into your Smart Network Traffic Management system.

---

## 📋 Method 1: Using Node.js Script (Recommended)

### Prerequisites
- MongoDB running and accessible
- Node.js installed
- Your backend server running on port 5000

### Steps

1. **Create a seed runner file:**
```javascript
// runSeed.js
require('dotenv').config()
const mongoose = require('mongoose')
const Utilisateur = require('./models/Utilisateur')
const Cour = require('./models/Cour')
const Alerte = require('./models/Alerte')
const Rapport = require('./models/rapport')
const FichierReseau = require('./models/fichierReseau')
const bcrypt = require('bcryptjs')

const seedData = require('./seed-data.json')

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await Utilisateur.deleteMany({})
    await Cour.deleteMany({})
    await Alerte.deleteMany({})
    await Rapport.deleteMany({})
    await FichierReseau.deleteMany({})
    console.log('✅ Cleared existing data')

    // Hash passwords and insert users
    const usersWithHashedPasswords = await Promise.all(
      seedData.users.map(async (user) => ({
        ...user,
        motDePasse: await bcrypt.hash(user.motDePasse, 10)
      }))
    )
    await Utilisateur.insertMany(usersWithHashedPasswords)
    console.log(`✅ Inserted ${seedData.users.length} users`)

    // Insert courses
    await Cour.insertMany(seedData.courses)
    console.log(`✅ Inserted ${seedData.courses.length} courses`)

    // Insert alerts
    await Alerte.insertMany(seedData.alerts)
    console.log(`✅ Inserted ${seedData.alerts.length} alerts`)

    // Insert reports
    await Rapport.insertMany(seedData.reports)
    console.log(`✅ Inserted ${seedData.reports.length} reports`)

    // Insert files
    await FichierReseau.insertMany(seedData.files)
    console.log(`✅ Inserted ${seedData.files.length} network files`)

    console.log('\n🎉 Seed data inserted successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error.message)
    process.exit(1)
  }
}

runSeed()
```

2. **Run the seed script:**
```bash
node runSeed.js
```

---

## 🔌 Method 2: Using cURL Commands

### Register/Create Users
```bash
# User 1 - Admin
curl -X POST http://localhost:5000/api/utilisateurs/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Ahmed Benzema",
    "email": "ahmed.benzema@smartnet.com",
    "motDePasse": "Admin@123",
    "role": "AdministrateurReseau"
  }'

# User 2 - Manager
curl -X POST http://localhost:5000/api/utilisateurs/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Sarah Johnson",
    "email": "sarah.johnson@smartnet.com",
    "motDePasse": "Sarah@123",
    "role": "ResponsableReseau"
  }'

# (Repeat for other users...)
```

### Login to Get Token
```bash
curl -X POST http://localhost:5000/api/utilisateurs/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed.benzema@smartnet.com",
    "motDePasse": "Admin@123"
  }'
```

### Create Courses
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/cours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "titre": "Network Fundamentals",
    "description": "Learn the basics of computer networking",
    "niveau": "Beginner",
    "categorie": "Networking",
    "pdf": "https://example.com/courses/network-fundamentals.pdf"
  }'
```

### Create Alerts
```bash
curl -X POST http://localhost:5000/api/alertes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "destinataire": "ahmed.benzema@smartnet.com",
    "message": "Suspicious SSH login attempt detected",
    "type": "attaque",
    "statut": "non_lue"
  }'
```

### Create Reports
```bash
curl -X POST http://localhost:5000/api/rapports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "titre": "Daily Traffic Summary",
    "type": "PDF",
    "contenu": "Network traffic analysis",
    "fichier": "/reports/daily-summary.pdf"
  }'
```

### Upload Network Files
```bash
curl -X POST http://localhost:5000/api/fichiers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nomFichier": "network-capture.pcap",
    "typeFichier": "PCAP",
    "taille": 524288000,
    "cheminFichier": "/storage/pcap/network-capture.pcap",
    "statut": "Importé"
  }'
```

---

## 📮 Method 3: Using Postman

### Collection Setup

**1. Create Environment Variables:**
- `base_url`: `http://localhost:5000`
- `token`: (Auto-populated after login)

**2. Create Requests:**

**POST Register User**
```
URL: {{base_url}}/api/utilisateurs/register
Method: POST
Body (JSON):
{
  "nom": "Ahmed Benzema",
  "email": "ahmed.benzema@smartnet.com",
  "motDePasse": "Admin@123",
  "role": "AdministrateurReseau"
}
```

**POST Login**
```
URL: {{base_url}}/api/utilisateurs/login
Method: POST
Body (JSON):
{
  "email": "ahmed.benzema@smartnet.com",
  "motDePasse": "Admin@123"
}

Tests (Post-request script):
pm.environment.set("token", pm.response.json().token)
```

**POST Create Course**
```
URL: {{base_url}}/api/cours
Method: POST
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "titre": "Network Fundamentals",
  "description": "Learn the basics of computer networking",
  "niveau": "Beginner",
  "categorie": "Networking",
  "pdf": "https://example.com/courses/network-fundamentals.pdf"
}
```

**POST Create Alert**
```
URL: {{base_url}}/api/alertes
Method: POST
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "destinataire": "ahmed.benzema@smartnet.com",
  "message": "Suspicious SSH login attempt detected",
  "type": "attaque"
}
```

**POST Create Report**
```
URL: {{base_url}}/api/rapports
Method: POST
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "titre": "Daily Traffic Summary",
  "type": "PDF",
  "contenu": "Daily network traffic analysis",
  "fichier": "/reports/daily.pdf"
}
```

**POST Upload File**
```
URL: {{base_url}}/api/fichiers
Method: POST
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "nomFichier": "network-capture.pcap",
  "typeFichier": "PCAP",
  "taille": 524288000,
  "cheminFichier": "/storage/pcap/network-capture.pcap",
  "statut": "Importé"
}
```

---

## 🗄️ Method 4: Direct MongoDB Import

### Using mongoimport

1. **Extract users from seed-data.json and create users.json:**
```bash
# Then import directly:
mongoimport --db smart_db --collection utilisateurs --file users.json
```

### MongoDB Shell

1. **Connect to MongoDB:**
```bash
mongosh
```

2. **Run commands:**
```javascript
use smart_db

// Insert users
db.utilisateurs.insertMany([
  {
    nom: "Ahmed Benzema",
    email: "ahmed.benzema@smartnet.com",
    role: "AdministrateurReseau"
  }
  // ... more users
])
```

---

## 🔐 User Credentials for Testing

After seed data insertion, use these credentials to login:

| Email | Password | Role |
|-------|----------|------|
| ahmed.benzema@smartnet.com | Admin@123 | AdministrateurReseau |
| sarah.johnson@smartnet.com | Sarah@123 | ResponsableReseau |
| michel.dupont@smartnet.com | Michel@123 | AdministrateurReseau |
| lisa.chen@smartnet.com | Lisa@123 | ResponsableReseau |
| carlos.rodriguez@smartnet.com | Carlos@123 | ResponsableReseau |

---

## 📊 Seed Data Statistics

- **Users**: 5 (3 Admins, 2 Managers)
- **Courses**: 6 (2 Beginner, 2 Intermediate, 2 Advanced)
- **Alerts**: 7 (3 Attacks, 2 Anomalies, 2 System)
- **Reports**: 5 (3 PDF, 1 Excel, 1 CSV)
- **Network Files**: 6 (3 PCAP, 2 PCAPNG, 1 CSV)

---

## ✅ Verification

After insertion, verify in your frontend:

1. **Dashboard**: Should show stats for all modules
2. **Users Page**: Should list 5 users
3. **Courses Page**: Should list 6 courses
4. **Alerts Page**: Should show 7 alerts
5. **Reports Page**: Should list 5 reports
6. **Files Page**: Should show 6 network files

---

## 🚀 Next Steps

1. Test CRUD operations on each module
2. Verify authentication with provided credentials
3. Test file upload functionality
4. Verify alert notifications system
5. Generate sample reports

Enjoy your fully populated Smart Network Traffic Management System! 🎉
