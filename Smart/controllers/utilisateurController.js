const Utilisateur = require("../models/Utilisateur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =========================
// INSCRIPTION
// =========================

exports.register = async (req, res) => {

    try {

        const { nom, email, motDePasse, role } = req.body;

        let utilisateur = await Utilisateur.findOne({ email });

        if (utilisateur) {

            return res.status(400).json({
                message: "Email déjà utilisé"
            });

        }

        const hash = await bcrypt.hash(motDePasse, 10);

        utilisateur = new Utilisateur({

            nom,
            email,
            motDePasse: hash,
            role

        });

        await utilisateur.save();

        res.status(201).json({

            message: "Utilisateur créé avec succès"

        });

    }

    catch (err) {

        res.status(500).json(err);

    }

};



// =========================
// LOGIN
// =========================

exports.login = async (req, res) => {

    try {

        const { email, motDePasse } = req.body;

        const utilisateur = await Utilisateur.findOne({ email });

        if (!utilisateur) {

            return res.status(404).json({
                message: "Utilisateur introuvable"
            });

        }

        const ok = await bcrypt.compare(
            motDePasse,
            utilisateur.motDePasse
        );

        if (!ok) {

            return res.status(400).json({

                message: "Mot de passe incorrect"

            });

        }

       const token = jwt.sign(
    {
        id: utilisateur._id,
        email: utilisateur.email,
        role: utilisateur.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "24h"
    }
);

       return res.status(200).json({
    message: "Connexion réussie",
    token: token
});}

    catch (err) {

        res.status(500).json(err);

    }

};



// =========================
// LISTE
// =========================

exports.getAll = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find().select("-motDePasse");
        return res.json({ success: true, count: utilisateurs.length, utilisateurs });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des utilisateurs', error: err.message });
    }
};



// =========================
// DETAIL
// =========================

exports.getById = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id).select("-motDePasse");
        if (!utilisateur) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
        return res.json({ success: true, utilisateur });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Erreur lors de la récupération', error: err.message });
    }
};



// =========================
// MODIFIER
// =========================

exports.update = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-motDePasse');
        if (!utilisateur) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
        return res.json({ success: true, utilisateur });
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour', error: err.message });
    }
};



// =========================
// SUPPRIMER
// =========================

exports.delete = async (req, res) => {

    try {
        const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);
        if (!utilisateur) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
        return res.json({ success: true, message: 'Utilisateur supprimé' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Erreur lors de la suppression', error: err.message });
    }

};