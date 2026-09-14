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
