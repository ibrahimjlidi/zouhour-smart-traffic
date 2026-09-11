
const mongoose = require("mongoose");

const fichierReseauSchema = new mongoose.Schema(
    {
        nomFichier: {
            type: String,
            required: true,
            trim: true
        },

        typeFichier: {
            type: String,
            required: true,
            enum: ["CSV", "PCAP", "PCAPNG"]
        },

        taille: {
            type: Number,
            required: true
        },

        dateImport: {
            type: Date,
            default: Date.now
        },

        statut: {
            type: String,
            default: "Importé",
            enum: [
                "Importé",
                "En cours d'analyse",
                "Analysé",
                "Erreur"
            ]
        },

        cheminFichier: {
            type: String,
            required: true
        },

        analysisResults: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Utilisateur'
        }
    },
    {
        timestamps: true
    }
);

// Add indexes for query performance
fichierReseauSchema.index({ dateImport: -1 });           // Sort by date
fichierReseauSchema.index({ statut: 1 });               // Filter by status
fichierReseauSchema.index({ typeFichier: 1 });          // Filter by type
fichierReseauSchema.index({ dateImport: -1, statut: 1 }); // Compound

module.exports = mongoose.model(
    "FichierReseau",
    fichierReseauSchema
);