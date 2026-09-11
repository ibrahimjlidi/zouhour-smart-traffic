const Utilisateur = require("../models/Utilisateur");
const bcrypt = require("bcryptjs");

// Ajouter un utilisateur
exports.ajouterUtilisateur = async (req, res) => {

    try {

        const { nom, email, motDePasse, role } = req.body;

        const existe = await Utilisateur.findOne({ email });

        if (existe) {
            return res.status(400).json({
                message: "Cet email existe déjà."
            });
        }

        const hash = await bcrypt.hash(motDePasse, 10);

        const utilisateur = new Utilisateur({
            nom,
            email,
            motDePasse: hash,
            role
        });

        await utilisateur.save();

        res.status(201).json({
            message: "Utilisateur ajouté avec succès",
            utilisateur
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// Modifier un utilisateur
exports.modifierUtilisateur = async (req, res) => {

    try {

        const utilisateur = await Utilisateur.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!utilisateur) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        res.json({
            message: "Utilisateur modifié",
            utilisateur
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// Supprimer un utilisateur
exports.supprimerUtilisateur = async (req, res) => {

    try {

        const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);

        if (!utilisateur) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        res.json({
            message: "Utilisateur supprimé avec succès"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// Liste des utilisateurs
exports.listeUtilisateurs = async (req, res) => {

    try {

        const utilisateurs = await Utilisateur.find().select("-motDePasse");

        res.json(utilisateurs);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// Détail d'un utilisateur
exports.detailUtilisateur = async (req, res) => {

    try {

        const utilisateur = await Utilisateur.findById(req.params.id)
            .select("-motDePasse");

        if (!utilisateur) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        res.json(utilisateur);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};