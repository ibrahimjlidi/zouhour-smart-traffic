const mongoose = require("mongoose");
const crypto = require("crypto");

const alerteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true
    },

    statut: {
      type: String,
      enum: ["non_lue", "lue", "envoyee"],
      default: "non_lue"
    },

    dateEnvoi: {
      type: Date,
      default: Date.now
    },

    destinataire: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["attaque", "anomalie", "systeme", "information"],
      default: "information"
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for query performance
alerteSchema.index({ dateEnvoi: -1 });              // Sort by date
alerteSchema.index({ destinataire: 1 });            // Filter by recipient
alerteSchema.index({ type: 1 });                    // Filter by type
alerteSchema.index({ statut: 1 });                  // Filter by status
alerteSchema.index({ dateEnvoi: -1, type: 1 });    // Compound index
alerteSchema.index({ dateEnvoi: -1, statut: 1 });  // Compound index

// Optional link to originating file/rapport/user
alerteSchema.add({
  sourceFichier: { type: mongoose.Schema.Types.ObjectId, ref: 'FichierReseau', required: false },
  sourceRapport: { type: mongoose.Schema.Types.ObjectId, ref: 'Rapport', required: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: false }
});

module.exports = mongoose.model("Alerte", alerteSchema);