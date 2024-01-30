const express = require('express');
const mongoose = require('mongoose');
const User = require ('../models/users');
const Otp = require('../models/otp');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
var nodemailer = require('nodemailer');
// const QAArrayModel = require('./QAArrayModel'); // Import the Mongoose model for Q&A data


// *****************************Create new users********************************************************

const create = async (req, resp, next) => {
    try {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return resp.status(500).json({
            error: err,
          });
        }
  
        try {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            password: hash,
            email: req.body.email,
            
          });
  
          const result = await user.save();
  
          console.log(result);
          return resp.status(200).json({
            new_user: result,
          });
        } catch (saveError) {
          console.error(saveError);
          return resp.status(500).json({
            error: saveError,
          });
        }
      });
    } catch (hashError) {
      console.error(hashError);
      return resp.status(500).json({
        error: hashError,
      });
    }
  };
  

  // ***********************************Login Api ******************************************************
  const login = (req, resp, next) => {
    User.find({ email: req.body.email }) 
      .exec()
      .then((user) => {
        if (user.length < 1) {
          return resp.status(401).json({
            error: "User email does not exist", 
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (!result) {
            return resp.status(401).json({
              error: "Password does not match", 
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                _id: user[0]._id,
                name: user[0].name,
                email: user[0].email,
              },
              "this is dummy text",
              {
                expiresIn: "24h",
              }
            );
            resp.status(200).json({
              _id: user[0]._id,
              name: user[0].name,
              email: user[0].email,
              token: token,
            });
          }
        });
      })
      .catch((err) => {
        resp.status(500).json({
          error: "An error occurred during login.", 
        });
      });
  };
  
  
    // ******************show***************************************************************************
const show = (req,resp,next)=>{
  User.find()
  .then(result=>{
      resp.status(200).json({
          All_Users:result
      })
  })
  .catch(err=>{
      resp.status(500).json({
          error:err
      })
  })
}
// // ********************************get one specific data*********************************************
const singleData = (req,resp,next)=>{
    User.findById(req.params.id)
    .then(result=>{
        resp.status(200).json({
            User:result
        })
    })
    .catch(err=>{
        resp.status(500).json({
            error:err
        })
    })
}
// **********************delete one*********************************************************************
const remove = async (req, resp, next) => {
  try {
    const messageId = req.params.id;

    // Retrieve the message record
    const message = await User.findOne({ _id: messageId });

    if (!message) {
      return resp.status(404).json({
        message: "User not found"
      });
    }
    const result = await User.deleteOne({ _id: messageId });
    resp.status(200).json({
      message: "Deleted Successfully",
      Deleted: result
    });
  } catch (err) {
    resp.status(500).json({
      error: err
    });
  }
};

// *********************************Store ChatBot Previous Chats*******************************************

// Controller function to handle form data and store it in the database
const storeFormData = async (req, res) => {
  try {
    const formData = req.body.data; // Assuming form data is sent in the request body
    const userId = req.params.id; // Assuming the user ID is retrieved from the authenticated user

    // Get the user from the database to ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Assuming formData is an array in the structure you mentioned
    const dataArray = formData.map(item => ({
      question: item.question,
      answer: item.answer
    }));
    
    // const result = await dataArray.save();
  
    //       console.log(result);
    //       return res.status(200).json({
    //         User_Chats: result,
    //       });
   
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name: user.name,
      password: user.password,
      email: user.email,
      data: dataArray // Assign the mapped array to the 'data' field
    });

    const savedData = await newUser.save();
    // Create a new document using the schema, associate it with the user, and save it to the database
    // const newQADocument = new QAArrayModel({ data: dataArray, userId: userId });
    // const savedData = await newQADocument.save();

    res.status(201).json({ message: 'Data stored successfully', data: savedData });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// **************************************Update Data Array ***************************************************

// const updateUserData = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const formData = req.body.data; 

//     // Get the user from the database to ensure the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Assuming formData is an array in the structure you mentioned
//     const dataArray = formData.map(item => ({
//       question: item.question,
//       answer: item.answer
//     }));

//     // Update the existing user's 'data' field with the new array of questions and answers
//     user.data = dataArray;

//     // Save the updated user data to the database
//     const updatedUser = await user.save();

//     res.status(200).json({ message: 'User data updated successfully', user: updatedUser });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error', message: error.message });
//   }
// };
const updateUserData = async (req, res) => {
  try {
    const userId = req.params.id;
    const searchHistory = req.body.searchHistory;

    // Get the user from the database to ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the existing data or initialize as an empty array if it doesn't exist yet
    const existingData = user.data || [];

    // Transform the incoming search history data into the required format
    const newDataArray = searchHistory.map(item => ({
      question: item.question,
      answer: item.answer
    }));

    // Concatenate the existing data with the new data
    const updatedData = [...existingData, ...newDataArray];

    // Update the user's 'data' field with the updated array of questions and answers
    user.data = updatedData;

    // Save the updated user data to the database
    const updatedUser = await user.save();

    res.status(200).json({ message: 'User data updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};



// ******************************Deleting Just User History*****************************************************
const removeUserChats = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Retrieve the user record
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Set the 'data' field of the user to an empty array
    user.data = [];

    // Save the updated user (with empty 'data' array) back to the database
    await user.save();

    res.status(200).json({
      message: "User chats deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// *************************************email send for reset password *********************************************
const emailSend = async(req, res, next)=>{
let data = await User.findOne({email: req.body.email});
console.log({email: req.body.email});
const responseType = {};
if(data){
  // let otpCode = Math.floor((Math.random()*10000)+1);
  const otpCode = Math.floor(1000 + Math.random() * 9000);
  let optData = new Otp({
    email : req.body.email,
    code :  otpCode,
    expireIn: new Date().getTime() + 300 * 1000,
  })
  let otpResponse = await optData.save()
  responseType.statusText = 'success'
  // mailer({email:req.body.email},otpCode)
  responseType.message = 'Please check Your Email '
}
else{
  responseType.statusText = 'error'
  responseType.message = "Email not exist"
}

res.status(200).json(responseType);
}

// ****************************************Change password ***********************************************************
// const changePassword = async (req, res, next) => {
//   try {
//     let data = await Otp.findOne({ email: req.body.email, code: req.body.otpCode });

//     const response = {};
//     if (data) {
//       let currentTime = new Date().getTime();
//       let diff = data.expireIn - currentTime;
//       if (diff < 0) {
//         response.message = "Token Expire";
//         response.statusText = 'error';
//       } else {
//         let user = await User.findOne({ email: req.body.email });
//         if (!user) {
//           response.message = "User not found";
//           response.statusText = 'error';
//         } else {
//           user.password = req.body.password;
//           await user.save();
//           response.message = "Password is successfully Changed";
//           response.statusText = 'Success';
//         }
//       }
//     } else {
//       response.message = "Invalid OTP";
//       response.statusText = 'error';
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error', message: error.message });
//   }
// };
const changePassword = async (req, res, next) => {
  try {
    let data = await Otp.findOne({ email: req.body.email, code: req.body.otpCode });

    const response = {};
    if (data && data.code === req.body.otpCode) {
      let currentTime = new Date().getTime();
      let diff = data.expireIn - currentTime;

      if (diff < 0) {
        console.log("Token Expire");
        response.message = "Token Expire";
        response.statusText = 'error';
        res.status(200).json(response);
      } else {
        let user = await User.findOne({ email: req.body.email });

        if (!user) {
          response.message = "User not found";
          response.statusText = 'error';
          res.status(200).json(response);
        } else {
          try {
            // Use await with bcrypt.hash
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            user.password = hashedPassword;
            await user.save();

            response.message = "Password is successfully Changed";
            response.statusText = 'Success';
            res.status(200).json(response);
          } catch (error) {
            res.status(500).json({ error: 'Internal server error', message: error.message });
          }
        }
      }
    } else {
      response.message = "Invalid OTP";
      response.statusText = 'error';
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};





const mailer = async(email,otp)=>{

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hghj@gmail.com',
      pass: 'asd'
    }
  });
  
  var mailOptions = {
    from: 'kamran2632@gmail.com',
    to: email,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}
module.exports = {
    create,
    login,
    show,
    singleData,
    remove,
    storeFormData,
    updateUserData,
    removeUserChats,
    emailSend,
    changePassword
    }