module.exports = (req, res, next) => {

    if (req.user.role !== "AdministrateurReseau") {
        return res.status(403).json({
            message: "Accès réservé à l'administrateur réseau"
        });
    }

    next();

};