const express = require("express");
const auth = require("../middleware/auth");
const { validateAlerte, handleValidationErrors } = require("../middleware/validators");

const router = express.Router();

const alerteController = require("../controllers/alerteController");

// PUBLIC: Get all alerts
router.get("/", alerteController.getAllAlertes);

// PROTECTED: Create alert with validation
router.post("/envoyer", 
  auth,
  validateAlerte,
  handleValidationErrors,
  alerteController.envoyerAlerte
);

// PROTECTED: Get single alert
router.get("/:id", auth, alerteController.getAlerteById);

// PROTECTED: Mark as read
router.put("/:id/lire", auth, alerteController.marquerCommeLue);

// PROTECTED: Delete alert
router.delete("/:id", auth, alerteController.deleteAlerte);

module.exports = router;