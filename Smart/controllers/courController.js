// controllers/userController.js
const mongoose = require("mongoose");
const Cour = require("../models/Cour");
// Ajouter un cours (admin uniquement)
exports.ajouterCour = async (req, res) => {
	try {
		const { titre, description, niveau, categorie } = req.body;
		const nouvelCour = new Cour({
			titre,
			description,
			niveau,
			categorie,
			pdf: req.file ? req.file.path : null
		});
		await nouvelCour.save();
		res.status(201).json({ success: true, cours: nouvelCour });
	} catch (err) {
		res.status(400).json({ success: false, message: "Erreur d’ajout", error: err.message });
	}
};

// Récupérer tous les cours (paginated)
exports.listerCour = async (req, res) => {
	try {
		const page = Math.max(1, parseInt(req.query.page || '1'));
		const limit = Math.min(100, parseInt(req.query.limit || '50'));
		const skip = (page - 1) * limit;

		// Use native collection for listing to avoid Mongoose buffering edge-cases
		const col = mongoose.connection.db.collection('cours');
		const total = await col.countDocuments();
		const cours = await col.find().sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();

		res.json({ success: true, data: cours, pagination: { total, page, limit } });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};

// Récupérer un cours par id
exports.getCourById = async (req, res) => {
	try {
		const cours = await Cour.findById(req.params.id);
		if (!cours) return res.status(404).json({ success: false, message: 'Cours introuvable' });
		res.json({ success: true, cours });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};

// Mettre à jour un cours
exports.updateCour = async (req, res) => {
	try {
		const updated = await Cour.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updated) return res.status(404).json({ success: false, message: 'Cours introuvable' });
		res.json({ success: true, cours: updated });
	} catch (err) {
		res.status(400).json({ success: false, error: err.message });
	}
};

// Supprimer un cours
exports.deleteCour = async (req, res) => {
	try {
		const deleted = await Cour.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ success: false, message: 'Cours introuvable' });
		res.json({ success: true, message: 'Cours supprimé' });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};
