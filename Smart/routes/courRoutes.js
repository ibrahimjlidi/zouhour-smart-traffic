const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { validateCour, handleValidationErrors } = require("../middleware/validators");
const router = express.Router();
const courController = require("../controllers/courController");
const upload = require("../middleware/upload");

// PUBLIC: List courses
router.get("/", courController.listerCour);

// PROTECTED: Add course (admin only) with validation
router.post("/ajouter",
  auth,
  admin,
  upload.single("pdf"),
  validateCour,
  handleValidationErrors,
  courController.ajouterCour
);

// PROTECTED: Get single course
router.get('/:id', auth, courController.getCourById);

// PROTECTED: Update course
router.put('/:id', auth, admin, courController.updateCour);

// PROTECTED: Delete course
router.delete('/:id', auth, admin, courController.deleteCour);

module.exports = router;

