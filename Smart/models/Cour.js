const mongoose = require("mongoose");
const courSchema = new mongoose.Schema(
	{
		titre: { type: String, required: true, trim: true },
		description: { type: String, default: '', trim: true },
		niveau: { type: String, enum: ['Débutant', 'Intermédiaire', 'Avancé', 'Beginner', 'Intermediate', 'Advanced'], default: 'Débutant' },
		categorie: { type: String, required: false, trim: true },
		pdf: { type: String, required: false },
		published: { type: Boolean, default: false },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }
	},
	{ timestamps: true }
);

// Add indexes for faster queries
courSchema.index({ categorie: 1 });
courSchema.index({ niveau: 1 });
courSchema.index({ titre: 'text' });

module.exports = mongoose.model('Cour', courSchema);
