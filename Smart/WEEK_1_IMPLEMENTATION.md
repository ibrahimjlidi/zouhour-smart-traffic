# 🔨 WEEK 1 IMPLEMENTATION GUIDE - Ready-to-Copy Code

**Use this to implement all Week 1 tasks. Just copy, paste, and adapt.**

---

## TASK 1: Create Input Validation Middleware (2 hours)

### Step 1: Create the file
**File:** `middleware/validators.js`

```javascript
const { body, validationResult } = require('express-validator');

/**
 * ALERT VALIDATORS
 */
exports.validateAlerte = [
  body('destinataire')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('message')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Le message doit avoir entre 5 et 1000 caractères')
    .escape(),
  body('type')
    .isIn(['attaque', 'anomalie', 'systeme', 'information'])
    .withMessage('Type invalide')
];

/**
 * USER VALIDATORS
 */
exports.validateRegister = [
  body('nom')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit avoir entre 2 et 100 caractères'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('motDePasse')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit avoir au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Doit contenir au moins une majuscule')
    .matches(/[a-z]/).withMessage('Doit contenir au moins une minuscule')
    .matches(/[0-9]/).withMessage('Doit contenir au moins un chiffre'),
  body('role')
    .isIn(['AdministrateurReseau', 'ResponsableReseau'])
    .withMessage('Rôle invalide')
];

exports.validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('motDePasse')
    .notEmpty()
    .withMessage('Mot de passe requis')
];

/**
 * RAPPORT VALIDATORS
 */
exports.validateRapport = [
  body('titre')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Titre invalide'),
  body('type')
    .isIn(['PDF', 'CSV', 'EXCEL'])
    .withMessage('Type invalide'),
  body('contenu')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Contenu insuffisant')
];

/**
 * COURS VALIDATORS
 */
exports.validateCour = [
  body('titre')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Titre invalide'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description invalide'),
  body('niveau')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Niveau invalide'),
  body('categorie')
    .trim()
    .notEmpty()
    .withMessage('Catégorie requise')
];

/**
 * ERROR HANDLER MIDDLEWARE
 * Use this after validators to send error responses
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};
```

### Step 2: Update package.json
```bash
npm install express-validator
```

### Step 3: Update routes to use validators

**File:** `routes/alerteRoutes.js`
```javascript
const express = require('express');
const { auth } = require('../middleware/auth');
const { validateAlerte, handleValidationErrors } = require('../middleware/validators');
const alerteController = require('../controllers/alerteController');

const router = express.Router();

// PUBLIC: Get all alerts (paginated)
router.get('/', alerteController.getAllAlertes);

// PROTECTED: Create alert with validation
router.post('/', 
  auth,
  validateAlerte,
  handleValidationErrors,
  alerteController.envoyerAlerte
);

// PROTECTED: Mark as read
router.put('/:id/lire', auth, alerteController.marquerCommeLue);

// PROTECTED: Delete alert
router.delete('/:id', auth, alerteController.deleteAlerte);

// PROTECTED: Get single alert
router.get('/:id', auth, alerteController.getAlerteById);

module.exports = router;
```

**File:** `routes/utilisateurRoutes.js`
```javascript
const express = require('express');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { 
  validateRegister, 
  validateLogin,
  handleValidationErrors 
} = require('../middleware/validators');
const utilisateurController = require('../controllers/utilisateurController');

const router = express.Router();

// PUBLIC: Register
router.post('/register', 
  validateRegister,
  handleValidationErrors,
  utilisateurController.register
);

// PUBLIC: Login
router.post('/login', 
  validateLogin,
  handleValidationErrors,
  utilisateurController.login
);

// PROTECTED: Get all users (admin only)
router.get('/', 
  auth, 
  admin,
  utilisateurController.getAll
);

// PROTECTED: Get user by ID
router.get('/:id', auth, utilisateurController.getById);

// PROTECTED: Update user
router.put('/:id', auth, utilisateurController.update);

// PROTECTED: Delete user (admin only)
router.delete('/:id', auth, admin, utilisateurController.delete);

module.exports = router;
```

**File:** `routes/rapportRoutes.js`
```javascript
const express = require('express');
const { auth } = require('../middleware/auth');
const { validateRapport, handleValidationErrors } = require('../middleware/validators');
const rapportController = require('../controllers/rapportController');

const router = express.Router();

// PROTECTED: Create report with validation
router.post('/', 
  auth,
  validateRapport,
  handleValidationErrors,
  rapportController.genererRapport
);

// PROTECTED: Get all reports
router.get('/', auth, rapportController.getAllRapports);

// PROTECTED: Get single report
router.get('/:id', auth, rapportController.getRapportById);

// PROTECTED: Export as PDF
router.get('/:id/export/pdf', auth, rapportController.exporterPDF);

// PROTECTED: Export as CSV
router.get('/export/csv', auth, rapportController.exporterCSV);

// PROTECTED: Export as Excel
router.get('/export/excel', auth, rapportController.exporterExcel);

// PROTECTED: Delete report
router.delete('/:id', auth, rapportController.deleteRapport);

module.exports = router;
```

**File:** `routes/courRoutes.js`
```javascript
const express = require('express');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { validateCour, handleValidationErrors } = require('../middleware/validators');
const courController = require('../controllers/courController');
const upload = require('../middleware/upload');

const router = express.Router();

// PUBLIC: List courses
router.get('/', courController.listerCour);

// PROTECTED: Add course (admin only) with validation
router.post('/', 
  auth,
  admin,
  upload.single('pdf'),
  validateCour,
  handleValidationErrors,
  courController.ajouterCour
);

module.exports = router;
```

### Step 4: Test validators
```bash
# Test invalid alert (should fail)
curl -X POST http://localhost:5000/api/alertes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destinataire": "not-an-email",
    "message": "hi",
    "type": "invalid"
  }'

# Should return 400 with validation errors

# Test valid alert (should succeed)
curl -X POST http://localhost:5000/api/alertes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destinataire": "test@smartnet.com",
    "message": "Test alert message",
    "type": "anomalie"
  }'
```

---

## TASK 2: Add Auth Middleware to Unprotected Routes (1 hour)

**Just add `auth` import and middleware to these route files:**

```javascript
// At top of file
const { auth } = require('../middleware/auth');

// Wrap routes that need protection
router.post('/', auth, controller.create);
router.get('/:id', auth, controller.getById);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.delete);
```

**Apply to:**
- ✅ `routes/alerteRoutes.js` - POST, PUT, DELETE require auth (GET is public for feed)
- ✅ `routes/rapportRoutes.js` - ALL routes require auth
- ✅ `routes/fichierRoutes.js` - Already has auth, verify it's applied correctly
- ✅ `routes/courRoutes.js` - GET is public, POST requires auth

---

## TASK 3: Fix CORS Security (15 minutes)

### Step 1: Update server.js

**File:** `server.js`

```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ✅ SECURE CORS CONFIG (Replace the old cors() call)
const allowedOrigins = [
  'http://localhost:5175',           // Local dev frontend
  'http://localhost:3000',           // Alternative dev port
  'http://localhost:5173',           // Vite default
  process.env.ALLOWED_ORIGINS         // From .env for production
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600 // 10 minutes
}));

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart_network', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection failed:', err));

// Routes
app.use('/api/utilisateurs', require('./routes/utilisateurRoutes'));
app.use('/api/alertes', require('./routes/alerteRoutes'));
app.use('/api/fichiers', require('./routes/fichierRoutes'));
app.use('/api/rapports', require('./routes/rapportRoutes'));
app.use('/api/cours', require('./routes/courRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 2: Update .env
```
MONGO_URI=mongodb://localhost:27017/smart_network
JWT_SECRET=your_super_secret_key_change_this_in_production
PORT=5000
ALLOWED_ORIGINS=http://localhost:5175,http://localhost:3000
NODE_ENV=development
```

### Step 3: Test CORS
```bash
# Should FAIL with CORS error (different origin)
curl -X GET http://localhost:5000/api/utilisateurs \
  -H "Origin: http://malicious-site.com"

# Should SUCCEED
curl -X GET http://localhost:5000/api/utilisateurs \
  -H "Origin: http://localhost:5175" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## TASK 4: Implement ResponsableReseau Middleware (30 minutes)

### Step 1: Create the middleware

**File:** `middleware/responsable.js`

```javascript
module.exports = (req, res, next) => {
  // Check if user has ResponsableReseau role
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== 'ResponsableReseau' && req.user.role !== 'AdministrateurReseau') {
    return res.status(403).json({ 
      message: 'Only Responsable Reseau or Admin can access this resource' 
    });
  }

  next();
};
```

### Step 2: Apply to routes

Routes that should require ResponsableReseau:
```javascript
// In relevant route files:
const { responsable } = require('../middleware/responsable');

// Reports - Responsable can view/generate
router.get('/', responsable, controller.getAll);
router.post('/', responsable, controller.create);

// Files - Responsable can view/analyze
router.get('/', responsable, controller.liste);
router.post('/:id/analyser', responsable, controller.analyser);
```

---

## TASK 5: Add Database Indexes (30 minutes)

### Step 1: Update Alerte model

**File:** `models/Alerte.js`

```javascript
const mongoose = require('mongoose');

const alerteSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => require('uuid').v4()
  },
  statut: {
    type: String,
    enum: ['non_lue', 'lue', 'envoyee'],
    default: 'non_lue'
  },
  dateEnvoi: {
    type: Date,
    default: Date.now
  },
  destinataire: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['attaque', 'anomalie', 'systeme', 'information'],
    default: 'information'
  }
}, { timestamps: true });

// 🆕 ADD THESE INDEXES
alerteSchema.index({ dateEnvoi: -1 });              // Sort by date
alerteSchema.index({ destinataire: 1 });            // Filter by recipient
alerteSchema.index({ type: 1 });                    // Filter by type
alerteSchema.index({ statut: 1 });                  // Filter by status
alerteSchema.index({ dateEnvoi: -1, type: 1 });    // Compound index
alerteSchema.index({ dateEnvoi: -1, statut: 1 });  // Compound index

module.exports = mongoose.model('Alerte', alerteSchema);
```

### Step 2: Update FichierReseau model

**File:** `models/fichierReseau.js`

```javascript
const mongoose = require('mongoose');

const fichierReseauSchema = new mongoose.Schema({
  nomFichier: {
    type: String,
    required: true
  },
  typeFichier: {
    type: String,
    enum: ['CSV', 'PCAP', 'PCAPNG'],
    required: true
  },
  taille: Number,
  dateImport: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ['Importé', 'En cours d\'analyse', 'Analysé', 'Erreur'],
    default: 'Importé'
  },
  cheminFichier: {
    type: String,
    required: true
  }
}, { timestamps: true });

// 🆕 ADD THESE INDEXES
fichierReseauSchema.index({ dateImport: -1 });           // Sort by date
fichierReseauSchema.index({ statut: 1 });               // Filter by status
fichierReseauSchema.index({ typeFichier: 1 });          // Filter by type
fichierReseauSchema.index({ dateImport: -1, statut: 1 }); // Compound

module.exports = mongoose.model('FichierReseau', fichierReseauSchema);
```

### Step 3: Update Rapport model

**File:** `models/rapport.js`

```javascript
const mongoose = require('mongoose');

const rapportSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['PDF', 'CSV', 'EXCEL'],
    required: true
  },
  contenu: String,
  fichier: String,
  dateGeneration: {
    type: Date,
    default: Date.now
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur'
  }
}, { timestamps: true });

// 🆕 ADD THESE INDEXES
rapportSchema.index({ dateGeneration: -1 });       // Sort by date
rapportSchema.index({ type: 1 });                  // Filter by type
rapportSchema.index({ utilisateur: 1 });          // Filter by user

module.exports = mongoose.model('Rapport', rapportSchema);
```

### Step 4: Update Cour model

**File:** `models/Cour.js`

```javascript
const mongoose = require('mongoose');

const courSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  description: String,
  niveau: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  categorie: String,
  pdf: String
}, { timestamps: true });

// 🆕 ADD THESE INDEXES
courSchema.index({ categorie: 1 });                // Filter by category
courSchema.index({ niveau: 1 });                  // Filter by level
courSchema.index({ titre: 'text' });              // Full-text search

module.exports = mongoose.model('Cour', courSchema);
```

### Step 5: Verify indexes

Run this in a Node.js console:
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

async function checkIndexes() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const Alerte = require('./models/Alerte');
  const FichierReseau = require('./models/fichierReseau');
  const Rapport = require('./models/rapport');
  const Cour = require('./models/Cour');
  
  console.log('Alerte indexes:', await Alerte.collection.getIndexes());
  console.log('FichierReseau indexes:', await FichierReseau.collection.getIndexes());
  console.log('Rapport indexes:', await Rapport.collection.getIndexes());
  console.log('Cour indexes:', await Cour.collection.getIndexes());
  
  process.exit();
}

checkIndexes();
```

---

## TASK 6: Test All Week 1 Changes

```bash
# 1. Restart server
npm start

# 2. Test: Validation works
curl -X POST http://localhost:5000/api/alertes \
  -H "Authorization: Bearer VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"destinataire":"invalid-email","message":"x","type":"bad"}'
# Expected: 400 with validation errors

# 3. Test: Auth protection works
curl -X GET http://localhost:5000/api/rapports
# Expected: 401 Unauthorized

# 4. Test: CORS is restricted
curl -X GET http://localhost:5000/api/utilisateurs \
  -H "Origin: http://malicious.com" \
  -H "Authorization: Bearer TOKEN"
# Expected: CORS error or restricted

# 5. Test: Indexes exist
node -e "
  require('dotenv').config();
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_URI).then(async () => {
    const Alerte = require('./models/Alerte');
    const indexes = await Alerte.collection.getIndexes();
    console.log('Indexes:', Object.keys(indexes));
    process.exit();
  });
"
```

---

## SUMMARY: Week 1 Checklist

- [ ] Install `express-validator` package
- [ ] Create `middleware/validators.js` with all validators
- [ ] Update all route files with validation middleware
- [ ] Add `auth` middleware to protected routes
- [ ] Fix CORS in `server.js` with whitelist
- [ ] Create `middleware/responsable.js`
- [ ] Apply `responsable` middleware to resource endpoints
- [ ] Add indexes to all model files
- [ ] Test all changes
- [ ] Commit to git: "feat: add validation, auth, and indexes"

**Estimated time: 16 hours for one developer, 6-8 hours for experienced developer**

---

