const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Sign up route
router.post('/signup', userController.signUp);

// Login route
router.post('/login', userController.login);

//Get all
router.get('/all_users',userController.getAllUsers);

//update user
router.put('/update_user/:id',userController.updateUser);

//get by id
router.get('/user_by_id/:id',userController.getUser);

//delete by id
router.delete('/delete_user/:id',userController.deleteUser)

//forget password
router.post('/forgotpassword',userController.forgotPassword)
//deviceToken
router.post('/deviceToken',userController.tokenAccept)
module.exports = router;
