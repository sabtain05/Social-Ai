const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
const profileDir = path.join(uploadDir, 'profile');
const postsDir = path.join(uploadDir, 'posts');
const reelsDir = path.join(uploadDir, 'reels');

[uploadDir, profileDir, postsDir, reelsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, profileDir); },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const postStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, postsDir); },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const reelStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, reelsDir); },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'reel-' + uniqueSuffix + '.mp4');
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const videoFilter = (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed'));
    }
};

const upload = multer({ storage: profileStorage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter });
const postUpload = multer({ storage: postStorage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter });
const reelUpload = multer({ storage: reelStorage, limits: { fileSize: 500 * 1024 * 1024 }, fileFilter: videoFilter });

module.exports = { upload, postUpload, reelUpload };