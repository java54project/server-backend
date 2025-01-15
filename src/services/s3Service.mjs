import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import logger from "../middleware/logger.mjs"

//creating s3 configuration



const s3Config = {
  region: process.env.AWS_REGION_S3,
  credentials: process.env.AWS_REGION_S3 && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
      region: process.env.AWS_REGION_S3,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined, 
};

const s3 = new S3Client(s3Config);


const uploadFileToS3 = async (fileBuffer, fileName, mimeType) => {
  const fileKey = `${uuidv4()}-${fileName}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: mimeType,
  };


  try {
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION_S3}.amazonaws.com/${fileKey}`;
    logger.info("File uploaded successfully");
    logger.info("S3 Response:", response);
    logger.info("File URL:", fileUrl);
    return fileUrl;
  } catch (error) {
    logger.error("Error uploading file:", error);
    logger.error("Resolved credentials object:", s3.config.credentials());
    throw error;
  }
};

export default uploadFileToS3;