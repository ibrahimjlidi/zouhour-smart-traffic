const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

// ========================================
// GENERER UN RAPPORT
// ========================================
const Rapport = require("../models/rapport");

exports.genererRapport = async (req, res) => {
  try {
    const rapport = new Rapport({
      titre: req.body.titre,
      type: req.body.type,
      contenu: req.body.contenu,
      utilisateur: req.user ? req.user.id : null,
      generatedFor: req.body.generatedFor || null,
      filters: req.body.filters || {}
    });

    await rapport.save();

    res.status(201).json({
      message: "Rapport généré avec succès",
      rapport
    });

  } catch (error) {
    console.error("Erreur génération rapport :", error);

    res.status(500).json({
      message: "Erreur lors de la génération du rapport",
      error: error.message
    });
  }
};
// ========================================
// RECUPERER TOUS LES RAPPORTS
// ========================================
exports.getAllRapports = async (req, res) => {
  try {
    const rapports = await Rapport.find().sort({
      dateGeneration: -1
    });

    res.status(200).json({
      success: true,
      count: rapports.length,
      rapports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération",
      error: error.message
    });
  }
};

// ========================================
// RECUPERER UN RAPPORT
// ========================================
exports.getRapportById = async (req, res) => {
  try {
    const rapport = await Rapport.findById(req.params.id);

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: "Rapport introuvable"
      });
    }

    res.status(200).json({
      success: true,
      rapport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};

// ========================================
// EXPORTER RAPPORT PDF
// ========================================
exports.exporterPDF = async (req, res) => {
  try {
    const rapport = await Rapport.findById(req.params.id);

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: "Rapport introuvable"
      });
    }

    const dossier = path.join(__dirname, "../exports/pdf");

    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, {
        recursive: true
      });
    }

    const fichier = `rapport_${rapport._id}.pdf`;
    const chemin = path.join(dossier, fichier);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(chemin);

    doc.pipe(stream);

    doc.fontSize(20).text("Smart Network Traffic Analyzer", {
      align: "center"
    });

    doc.moveDown();

    doc.fontSize(16).text(`Rapport : ${rapport.titre}`);

    doc.moveDown();

    doc.fontSize(12).text(
      `Date de génération : ${rapport.dateGeneration.toLocaleString()}`
    );

    doc.text(`Format : ${rapport.type}`);

    doc.moveDown();

    doc.text(
      "Rapport généré automatiquement par le système."
    );

    doc.end();

    stream.on("finish", async () => {
      rapport.fichier = chemin;
      await rapport.save();

      res.download(chemin);
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'export PDF",
      error: error.message
    });
  }
};

// ========================================
// EXPORTER CSV
// ========================================
exports.exporterCSV = async (req, res) => {
  try {
    const rapports = await Rapport.find().lean();

    const donnees = rapports.map((rapport) => ({
      id: rapport._id,
      titre: rapport.titre,
      format: rapport.type,
      dateGeneration: rapport.dateGeneration,
      statut: rapport.statut
    }));

    const parser = new Parser();
    const csv = parser.parse(donnees);

    res.header("Content-Type", "text/csv");
    res.attachment("rapports.csv");

    res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'export CSV",
      error: error.message
    });
  }
};

// ========================================
// EXPORTER EXCEL
// ========================================
exports.exporterExcel = async (req, res) => {
  try {
    const rapports = await Rapport.find().lean();

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Rapports");

    worksheet.columns = [
      {
        header: "ID",
        key: "id",
        width: 40
      },
      {
        header: "Titre",
        key: "titre",
        width: 30
      },
      {
        header: "Format",
        key: "format",
        width: 15
      },
      {
        header: "Date Génération",
        key: "dateGeneration",
        width: 25
      },
      {
        header: "Statut",
        key: "statut",
        width: 20
      }
    ];

    rapports.forEach((rapport) => {
      worksheet.addRow({
        id: rapport._id,
        titre: rapport.titre,
        format: rapport.type,
        dateGeneration: rapport.dateGeneration,
        statut: rapport.statut
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=rapports.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'export Excel",
      error: error.message
    });
  }
};

// ========================================
// SUPPRIMER UN RAPPORT
// ========================================
exports.deleteRapport = async (req, res) => {
  try {
    const rapport = await Rapport.findByIdAndDelete(req.params.id);

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: "Rapport introuvable"
      });
    }

    res.status(200).json({
      success: true,
      message: "Rapport supprimé avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression",
      error: error.message
    });
  }
};