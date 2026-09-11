const express = require("express");
const utilisateurController = require("../controllers/utilisateurController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { validateRegister, validateLogin, handleValidationErrors } = require("../middleware/validators");

const router = express.Router();

// PUBLIC: Register with validation
router.post("/register", 
  validateRegister,
  handleValidationErrors,
  utilisateurController.register
);

// PUBLIC: Login with validation
router.post("/login", 
  validateLogin,
  handleValidationErrors,
  utilisateurController.login
);

// PROTECTED: Get all users (admin only)
router.get("/", auth, admin, utilisateurController.getAll);

// PROTECTED: Get user by ID
router.get("/:id", auth, utilisateurController.getById);

// PROTECTED: Update user
router.put("/:id", auth, utilisateurController.update);

// PROTECTED: Delete user (admin only)
router.delete("/:id", auth, admin, utilisateurController.delete);

module.exports = router;