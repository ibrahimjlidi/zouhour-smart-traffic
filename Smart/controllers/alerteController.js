const Alerte = require("../models/Alerte");
const mongoose = require('mongoose');

// ========================================
// CREER ET ENVOYER UNE ALERTE
// ========================================
exports.envoyerAlerte = async (req, res) => {
  try {
    const { destinataire, message, type } = req.body;

    if (!destinataire || !message) {
      return res.status(400).json({
        success: false,
        message: "Le destinataire et le message sont obligatoires"
      });
    }

    const alerte = new Alerte({
      destinataire,
      message,
      type,
      statut: "envoyee",
      dateEnvoi: new Date(),
      createdBy: req.user ? req.user.id : null
    });

    await alerte.save();

    res.status(201).json({
      success: true,
      message: "Alerte envoyée avec succès",
      alerte
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'alerte",
      error: error.message
    });
  }
};

// ========================================
// RECUPERER TOUTES LES ALERTES
// ========================================
exports.getAllAlertes = async (req, res) => {
  try {
    console.log('Mongoose readyState:', mongoose.connection.readyState);
    // Use native driver to avoid Mongoose buffering issues
    const col = mongoose.connection.db.collection('alertes');
    const alertes = await col.find().sort({ createdAt: -1 }).toArray();

    res.status(200).json({ success: true, count: alertes.length, alertes });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des alertes",
      error: error.message
    });
  }
};

// ========================================
// RECUPERER UNE ALERTE PAR ID
// ========================================
exports.getAlerteById = async (req, res) => {
  try {
    const alerte = await Alerte.findOne({
      id: req.params.id
    });

    if (!alerte) {
      return res.status(404).json({
        success: false,
        message: "Alerte introuvable"
      });
    }

    res.status(200).json({
      success: true,
      alerte
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};

// ========================================
// MARQUER UNE ALERTE COMME LUE
// ========================================
exports.marquerCommeLue = async (req, res) => {
  try {
    const alerte = await Alerte.findOneAndUpdate(
      { id: req.params.id },
      {
        statut: "lue"
      },
      {
        new: true
      }
    );

    if (!alerte) {
      return res.status(404).json({
        success: false,
        message: "Alerte introuvable"
      });
    }

    res.status(200).json({
      success: true,
      message: "Alerte marquée comme lue",
      alerte
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification",
      error: error.message
    });
  }
};

// ========================================
// SUPPRIMER UNE ALERTE
// ========================================
exports.deleteAlerte = async (req, res) => {
  try {
    const alerte = await Alerte.findOneAndDelete({
      id: req.params.id
    });

    if (!alerte) {
      return res.status(404).json({
        success: false,
        message: "Alerte introuvable"
      });
    }

    res.status(200).json({
      success: true,
      message: "Alerte supprimée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression",
      error: error.message
    });
  }
};