const mongoose = require("mongoose");
const FichierReseau = require("../models/fichierReseau");
const fs = require("fs");

// ============================================
// IMPORTER UN FICHIER
// ============================================

exports.importer = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Aucun fichier n'a été envoyé."
            });
        }

        const extension = req.file.originalname
            .split(".")
            .pop()
            .toUpperCase();

        const fichier = new FichierReseau({

            nomFichier: req.file.originalname,

            typeFichier: extension,

            taille: req.file.size,

            dateImport: new Date(),

            statut: "Importé",

            cheminFichier: req.file.path
        });
        if (req.user && req.user.id) fichier.uploadedBy = req.user.id;

        await fichier.save();

        res.status(201).json({

            message: "Fichier importé avec succès.",

            fichier: fichier
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur lors de l'importation du fichier.",
            erreur: error.message
        });
    }
};


// ============================================
// LISTE DES FICHIERS
// ============================================

exports.liste = async (req, res) => {

    try {

        const col = mongoose.connection.db.collection('fichierreseaus');
        const fichiers = await col.find().sort({ dateImport: -1 }).toArray();

        res.status(200).json({ success: true, count: fichiers.length, fichiers });

    } catch (error) {

        res.status(500).json({
            message: "Erreur lors de la récupération des fichiers.",
            erreur: error.message
        });
    }
};


// ============================================
// DETAILS D'UN FICHIER
// ============================================

exports.details = async (req, res) => {

    try {

        const fichier = await FichierReseau
            .findById(req.params.id);

        if (!fichier) {

            return res.status(404).json({
                message: "Fichier introuvable."
            });
        }

        res.status(200).json(fichier);

    } catch (error) {

        res.status(500).json({
            message: "Erreur.",
            erreur: error.message
        });
    }
};


// ============================================
// ANALYSER UN FICHIER
// ============================================

exports.analyser = async (req, res) => {

    try {

        const fichier = await FichierReseau
            .findById(req.params.id);

        if (!fichier) {

            return res.status(404).json({
                message: "Fichier introuvable."
            });
        }

        // Pour le moment :
        // simulation du lancement de l'analyse

        fichier.statut = "En cours d'analyse";

        await fichier.save();

        // Ici nous connecterons plus tard
        // le moteur Python AI.

        fichier.statut = "Analysé";

        await fichier.save();

        res.status(200).json({

            message: "Analyse terminée avec succès.",

            resultat: true,

            fichier: fichier
        });

    } catch (error) {

        res.status(500).json({

            message: "Erreur lors de l'analyse.",

            resultat: false,

            erreur: error.message
        });
    }
};


// ============================================
// SUPPRIMER UN FICHIER
// ============================================

exports.supprimer = async (req, res) => {

    try {

        const fichier = await FichierReseau
            .findById(req.params.id);

        if (!fichier) {

            return res.status(404).json({
                message: "Fichier introuvable."
            });
        }

        // Supprimer le fichier physique
        if (
            fichier.cheminFichier &&
            fs.existsSync(fichier.cheminFichier)
        ) {
            fs.unlinkSync(fichier.cheminFichier);
        }

        // Supprimer de MongoDB
        await FichierReseau
            .findByIdAndDelete(req.params.id);

        res.status(200).json({

            message: "Fichier supprimé avec succès."
        });

    } catch (error) {

        res.status(500).json({

            message: "Erreur lors de la suppression.",

            erreur: error.message
        });
    }
};