const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure public/uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer to save files to disk in public/uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // For update: use vehicle ID if available in params
        // For add: use temporary name, will be renamed after vehicle creation
        const fileExtension = path.extname(file.originalname);
        
        if (req.params && req.params.id) {
            // Update case: use vehicle ID directly
            const fileName = `${req.params.id}${fileExtension}`;
            cb(null, fileName);
        } else {
            // Add case: use temporary name with timestamp
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileName = `temp-${timestamp}-${randomString}${fileExtension}`;
            cb(null, fileName);
        }
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;
