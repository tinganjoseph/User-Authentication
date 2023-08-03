const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User, registerSchema, loginSchema,resetPasswordSchema,newPasswordSchema }  = require("../models/user.model");
const generateAuthToken = require("../middleware/generateAuthToken");
// Sign Up




exports.signUp = async (req, res) => {
  try {
    // Validate request body
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Check if user already exists
    let user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).json({ message: "User already registered." });

    // Check if user already exists
    let contact = await User.findOne({ contact: req.body.contact });
    if (contact) return res.status(400).json({ message: "Contact already registered." });

    user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Generate a unique identifier for the user
    const uniqueId = uuidv4().substr(0, 12); // Generate UUID and take the first 12 characters
    user.deviceId = uniqueId;

    await user.save();
    const token = generateAuthToken(user);

    res.send({ user, token });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while registering the user." });
  }
};

  
  // Login
  exports.login = async (req, res) => {
    try {
      // Validate request body
      const { error } = loginSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
  
      // Check if user exists
      const user = await User.findOne({ username: req.body.username });
      if (!user) return res.status(400).json({ message: "Invalid username or password." });
  
      // Check if password is correct
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(400).json({ message: "Invalid username or password." });
  
      const token = generateAuthToken(user);

      res.send({user,token});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  // Update user
exports.updateUser = async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete user
  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User has been deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  // Get all users
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get one user
  exports.getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



  exports.forgotPassword = async (req, res) => {
    // Validate the incoming request
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    // Check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email does not exist');
  
    // Create a unique token and its hash
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetTokenHash = resetTokenHash;
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
  
    // Save the user
    try {
      await user.save();
    } catch (err) {
      console.error(err);
      return res.status(500).send('An error occurred while saving the user');
    }
  
    // Create a transporter
    const transporter = nodemailer.createTransport({
      //service: 'gmail',
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.EMAILACCOUNT,
        pass: process.env.PASSSWORDEMAIL
      }
    });
  
    // Options for the email
    const mailOptions = {
      from: process.env.EMAILACCOUNT,
      to: user.email,
      subject: 'Password reset',
      text: `You requested a password reset. Click the following link to reset your password: ${process.env.BASE_URL}/reset/${resetToken}`
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error occurred while sending mail:", error);
          return res.status(500).send("An error occurred while sending the email");
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(200).send("Email sent successfully");
        }
      });
      
    
  };


exports.tokenAccept = async (req, res)=>{
  const { userId, deviceToken } = req.body;

  // Find the user by userId and update the deviceToken field
  User.findOneAndUpdate(
    { _id: userId },
    { $set: { deviceToken: deviceToken } },
    { new: true },
    (err, user) => {
      if (err) {
        console.error('Error updating device token:', err);
        return res.status(500).json({ message: 'An error occurred while updating device token.' });
      }

      res.status(200).json({ message: 'Device token saved successfully.' });
    }
  );
}



  exports.resetPassword = async (req, res) => {
    // Validate the incoming request
    const { error } = newPasswordSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    // Check if the user exists and if the token is valid
    const user = await User.findOne({ resetTokenHash: crypto.createHash('sha256').update(req.params.token).digest('hex') });
    if (!user) return res.status(400).send('Invalid token');
  
    // Check if the token has expired
    if (user.resetTokenExpiration < Date.now()) return res.status(400).send('Token has expired');
  
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
    // Update the user's password and clear the reset token fields
    user.password = hashedPassword;
    user.resetTokenHash = undefined;
    user.resetTokenExpiration = undefined;
  
    // Save the user
    try {
      await user.save();
    } catch (err) {
      console.error(err);
      return res.status(500).send('An error occurred while saving the user');
    }
  
    // Send a response
    res.send('Password has been reset');
  };
  