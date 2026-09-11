const multer = require("multer");
const path = require("path");
const fs = require("fs");

// إنشاء مجلد uploads إذا لم يكن موجودًا
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// تحديد مكان واسم الملف
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);

        const name =
            path.basename(file.originalname, extension)
            .replace(/\s+/g, "_");

        cb(
            null,
            `${Date.now()}-${name}${extension}`
        );
    }
});

// التحقق من نوع الملف
const fileFilter = (req, file, cb) => {

    const extension = path.extname(file.originalname)
        .toLowerCase();

    const allowedExtensions = [
        ".csv",
        ".pcap",
        ".pcapng"
    ];

    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Type de fichier non autorisé. Utilisez CSV, PCAP ou PCAPNG."
            )
        );
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,

    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

module.exports = upload;