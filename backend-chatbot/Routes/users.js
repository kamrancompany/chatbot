const express = require('express');
const Users = require ('../models/users');
const router = express.Router();
const { create, login, show, singleData, remove, storeFormData, updateUserData, removeUserChats,emailSend,
changePassword } = require('../controllers/Users');

router.post('/signup', create);
router.post('/login', login);
router.post('/send-email', emailSend);
router.post('/change-password', changePassword);
router.get('/',show);
router.get('/:id',singleData);
router.delete('/:id',remove);
router.post('/:id',storeFormData);
router.put('/:id',updateUserData);
router.delete('/userhistory/:id',removeUserChats);



module.exports = router;