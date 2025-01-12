import express from "express";
import multer from "multer"; // for carring  files
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validation/authValidation.mjs";
import userService from "../services/userService.mjs";
import uploadFileToS3 from "../services/s3Service.mjs";
import logger from "../../src/middleware/logger.mjs";

const router = express.Router();
const upload = multer(); 

// User registration
router.post(
  "/register",
  upload.single("profilePicture"), // handling field profilePicture as a file
  asyncHandler(async (req, res) => {
    
    const { error } = registerSchema.validate(req.body);
    if (error) {
    logger.info("validation error");
      return res.status(400).json({ status: "fail", message: error.details[0].message });
    }

    const { name, email, password, role } = req.body;
    let profilePictureUrl = null;

    // uploading picture of the account to S3 
    if (req.file) {
      try {
        profilePictureUrl = await uploadFileToS3(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
      } catch (error) {
        return res.status(500).json({ status: "fail", message: "Error uploading profile picture" });
      }
    }

    try {
      const newUser = await userService.registerUser({ name, email, password, profilePicture: profilePictureUrl, role });
      res.status(201).json({
        status: "success",
        message: "Registration completed successfully",
        data: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
          role: newUser.role,

        },
      });
    } catch (err) {
      
      res.status(400).json({ status: "fail", message: "err.message" });
      
    }
  })
);

// User login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
   
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: "fail", message: error.details[0].message });
    }

    const { email, password } = req.body;

    try {
      const user = await userService.authenticateUser(email, password);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            role: user.role, 
            
          },
        },
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  })
);

export default router;