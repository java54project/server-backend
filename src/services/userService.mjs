import User from "../models/User.mjs";
import logger from "../middleware/logger.mjs"

const userService = {
  async registerUser({ name, email, password, profilePicture: profilePictureUrl, role }) {
    // Checking if prifile already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.error("User already exists:", email);
      throw new Error("User already exists");
    }

    // Creating new profile
    const newUser = new User({
        name, 
        email, 
        password, 
        profilePictureUrl,
        role
    });

    return await newUser.save();
  },

  async authenticateUser(email, password) {
    // find user by email
    logger.info("Authenticating user:", email); 
    const user = await User.findOne({ email });
    if (!user) {
      logger.error("User not found:", email);
      throw new Error("User not found");
    }

    // compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.error("Invalid password for user:", email);
      throw new Error("Invalid credentials");
    }
    logger.info("User authenticated:", user);
    return user;
  },
};

export default userService;