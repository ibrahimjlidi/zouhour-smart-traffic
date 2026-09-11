const mongoose = require("mongoose");

const rapportSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["PDF", "CSV", "EXCEL"],
      required: true
    },

    contenu: {
      type: String,
      default: ""
    },

    fichier: {
      type: String,
      default: null
    },

    dateGeneration: {
      type: Date,
      default: Date.now
    },

    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for query performance
rapportSchema.index({ dateGeneration: -1 });       // Sort by date
rapportSchema.index({ type: 1 });                  // Filter by type
rapportSchema.index({ utilisateur: 1 });          // Filter by user

// store meta about generated reports
rapportSchema.add({
  filters: { type: mongoose.Schema.Types.Mixed, default: {} },
  generatedFor: { type: String, default: null }
});

module.exports = mongoose.model("Rapport", rapportSchema);