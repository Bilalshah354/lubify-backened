const AWS = require('aws-sdk');

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * Upload file to S3 bucket
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {String} mimetype - The MIME type of the file
 * @param {String} originalName - Original filename
 * @returns {Promise<String>} - The S3 URL of the uploaded file
 */
const uploadToS3 = async (fileBuffer, mimetype, originalName) => {
    try {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        
        if (!bucketName) {
            throw new Error('AWS_S3_BUCKET_NAME is not set in environment variables');
        }

        // Generate unique filename with timestamp
        const fileExtension = originalName.split('.').pop();
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `vehicles/${timestamp}-${randomString}.${fileExtension}`;

        // Upload parameters
        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: mimetype,
            ACL: 'public-read' // Make the file publicly accessible
        };

        // Upload to S3
        const uploadResult = await s3.upload(uploadParams).promise();
        
        return uploadResult.Location; // Returns the public URL
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw new Error(`Failed to upload image to S3: ${error.message}`);
    }
};

module.exports = {
    uploadToS3
};
