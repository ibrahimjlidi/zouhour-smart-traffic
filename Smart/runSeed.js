require('dotenv').config()
const mongoose = require('mongoose')
const Utilisateur = require('./models/Utilisateur')
const Alerte = require('./models/Alerte')
const Rapport = require('./models/rapport')
const FichierReseau = require('./models/fichierReseau')
const bcrypt = require('bcryptjs')

const seedData = require('./seed-data.json')

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Utilisateur.deleteMany({})
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

    // (courses removed) no course data inserted

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
    console.log('\n📊 Summary:')
    console.log(`   - Users: ${seedData.users.length}`)
    console.log(`   - Alerts: ${seedData.alerts.length}`)
    console.log(`   - Reports: ${seedData.reports.length}`)
    console.log(`   - Network Files: ${seedData.files.length}`)
    
    console.log('\n🔐 Test Credentials:')
    seedData.users.forEach(user => {
      console.log(`   - ${user.email} / Password: (use from seed-data.json)`)
    })
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error.message)
    console.error(error)
    process.exit(1)
  }
}

runSeed()
