import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import sharp from "sharp";

const uploadDir = path.join(process.cwd(), "uploads", "cards");
const tempDir = path.join(process.cwd(), "uploads", "tmp");

fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(tempDir, { recursive: true });

// Avoids file locks on Windows so temp files can be deleted right after sharp reads them
sharp.cache(false);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, tempDir),
    filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}.tmp`)
});

const upload = multer({
    storage,
    limits: {
        files: 50,
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

const removeFile = async (filePath) => {
    try {
        await fs.promises.unlink(filePath);
    } catch (err) {
        if (err.code !== "ENOENT") console.error("File cleanup failed:", err.message);
    }
};

export const compressCards = [
    upload.array("images", 50),
    async (req, res, next) => {
        const files = req.files || [];
        const writtenOutputs = [];

        if (files.length === 0) {
            return res.status(400).json({ success: false, message: "At least one card image is required." });
        }

        try {
            for (const file of files) {
                const filename = `${crypto.randomUUID()}.jpg`;
                const outputPath = path.join(uploadDir, filename);

                try {
                    await sharp(file.path)
                        .rotate()
                        .resize({
                            width: 1600,
                            height: 1600,
                            fit: "inside",
                            withoutEnlargement: true
                        })
                        .jpeg({ quality: 75, mozjpeg: true })
                        .toFile(outputPath);
                } catch (sharpError) {
                    const err = new Error(`Could not read image "${file.originalname}". It may be corrupt or not a valid image.`);
                    err.statusCode = 400;
                    throw err;
                }

                writtenOutputs.push(outputPath);

                file.filename = filename;
                file.outputPath = outputPath;
                file.imagePath = path.join("uploads", "cards", filename);
            }

            // Compression succeeded for every file, remove the temp originals
            await Promise.all(files.map((file) => removeFile(file.path)));

            next();
        } catch (error) {
            // Roll back: remove compressed outputs already written and all temp files
            await Promise.all([
                ...writtenOutputs.map(removeFile),
                ...files.map((file) => removeFile(file.path))
            ]);

            if (error.statusCode === 400) {
                return res.status(400).json({ success: false, message: error.message });
            }
            next(error);
        }
    }
];