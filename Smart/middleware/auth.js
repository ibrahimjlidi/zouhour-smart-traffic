const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

    try {

        // récupérer le header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token manquant"
            });
        }

        // vérifier Bearer
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Format du token invalide"
            });
        }

        // récupérer uniquement le token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token manquant"
            });
        }

        // vérifier le JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // stocker les informations de l'utilisateur
        req.user = decoded;

        next();

    } catch (error) {

        console.error("Erreur JWT :", error.message);

        return res.status(401).json({
            message: "Token invalide"
        });
    }
};

module.exports = auth;