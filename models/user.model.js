const mongoose = require("mongoose");
const Joi = require('joi');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    username: { type: String, required: true, minlength: 3, maxlength: 30 },
    contact: { type: String, required: true, minlength: 3, maxlength: 15, unique: true },
    email: {
      type: String,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    isAdmin: { type: Boolean, default: false },
    profile: {
      type: String,
      default: "https://res.cloudinary.com/dcfidaorg/image/upload/v1680738416/avatar_cugq40_phojhr.png"
    },
    deviceId: { type: String },
    deviceToken: { type: String },
  },
  { timestamps: true }
);

// Customize serialization of createdAt and updatedAt fields
UserSchema.method("toJSON", function () {
  const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
  object.id = _id;
  object.createdAt = createdAt.toISOString().split("T")[0];
  object.updatedAt = updatedAt.toISOString().split("T")[0];
  return object;
});

const User = mongoose.model("User", UserSchema);

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  username: Joi.string().min(3).max(30).required(),
  contact: Joi.string().min(3).max(15).required(),
  email: Joi.string().min(3).max(200).email().required(),
  password: Joi.string().min(3).max(1024).required(),
  isAdmin: Joi.boolean(),
  profile: Joi.string(),
  deviceId: Joi.string(),
  deviceToken:Joi.string(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
    email: Joi.string().min(3).max(200).email().required(),
    oldPassword: Joi.string().min(3).max(1024).required(),
    newPassword: Joi.string().min(3).max(1024).required(),
  });

  const resetPasswordSchema = Joi.object({
    email: Joi.string().min(3).max(200).email().required(),
  });
  const newPasswordSchema = Joi.object({
    password: Joi.string().min(3).max(1024).required(),
  });
  
  

module.exports = { User, registerSchema, loginSchema,changePasswordSchema,resetPasswordSchema,newPasswordSchema };
