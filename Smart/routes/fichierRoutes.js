const express = require("express");

const router = express.Router();

const fichierController =
    require("../controllers/fichierController");

const auth =
    require("../middleware/auth");

const upload =
    require("../middleware/upload");

// ============================================
// IMPORTER
// ============================================

router.post(
    "/importer",
    auth,
    upload.single("fichier"),
    fichierController.importer
);


// ============================================
// LISTE
// ============================================

router.get(
    "/",
    auth,
    fichierController.liste
);


// ============================================
// DETAILS
// ============================================

router.get(
    "/:id",
    auth,
    fichierController.details
);


// ============================================
// ANALYSER
// ============================================

router.post(
    "/:id/analyser",
    auth,
    fichierController.analyser
);


// ============================================
// SUPPRIMER
// ============================================

router.delete(
    "/:id",
    auth,
    fichierController.supprimer
);

module.exports = router;