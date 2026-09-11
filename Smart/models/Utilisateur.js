const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        motDePasse: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["AdministrateurReseau", "ResponsableReseau"],
            default: "ResponsableReseau"
        },

        // audit
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Utilisateur',
            required: false
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Utilisateur',
            required: false
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.motDePasse;
                delete ret.__v;
                return ret;
            }
        }
    }
);

// Add indexes
utilisateurSchema.index({ email: 1 }, { unique: true });
utilisateurSchema.index({ role: 1 });
utilisateurSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Utilisateur", utilisateurSchema);