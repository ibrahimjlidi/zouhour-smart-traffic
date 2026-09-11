const express = require("express");
const auth = require("../middleware/auth");
const { validateRapport, handleValidationErrors } = require("../middleware/validators");

const router = express.Router();

const rapportController = require("../controllers/rapportController");

// PROTECTED: Create report with validation
router.post("/generer", 
  auth,
  validateRapport,
  handleValidationErrors,
  rapportController.genererRapport
);

// PROTECTED: Get all reports
router.get("/", auth, rapportController.getAllRapports);

// PROTECTED: Get single report
router.get("/:id", auth, rapportController.getRapportById);

// PROTECTED: Export PDF
router.get("/:id/export/pdf", auth, rapportController.exporterPDF);

// PROTECTED: Export CSV
router.get("/export/csv", auth, rapportController.exporterCSV);

// PROTECTED: Export Excel
router.get("/export/excel", auth, rapportController.exporterExcel);

// PROTECTED: Delete report
router.delete("/:id", auth, rapportController.deleteRapport);

module.exports = router;