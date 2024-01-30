const express = require ("express");
const mongoose = require("mongoose");
const Admin = require ('../models');
const jwt = require ("jsonwebtoken");
const bcrypt = require("bcrypt");

// ***********************************Create new Admin****************************

const create1 = async(req,resp,next) =>{

    try {
        bcrypt.hash(req.body.password, 10 , async(err,hash)=>{
            if(err){
                return resp.status(500).json({
                    error : err,
                })
            }
            try {
                const admin = new Admin({
                    _id : new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    password : req.body.password,
                    email: req.body.email,
                })

                const result = await admin.save();
                console.log(result);
                return resp.status(200).json({
                    New_Admin : result
                })
                
            } catch (saveerror) {
                return resp.status(500).json({
                    error: saveerror
                })
            }
        })
    } catch (hasherror) {
        resp.status(500).json({
            error : hasherror
        })
    }
}

const create = async(req,resp,next) =>{
    try {
        bcrypt.hash(req.body.password, 10, async(err,hash) => {
            if(err){
           return resp.status(500).json({
                error: err
            })
            }
            try {
            const admin = new Admin({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
            })
               const result = await admin.save();
              return resp.status(200).json({
                new_Admin: result
               })


            } catch (saveerror) {
                return resp.status(500).json({
                    error: saveerror
                })
            }
        })
    } catch (hasherror) {
      return  resp.status(500).json({
            error: hasherror
        })
    }
}
const create2 = async(req,resp,next) =>{
    try {
        bcrypt.hash(req.body.password, 10 , async(err, hash)=>{
            if(err){
               return resp.status(500).json({
                    error:err
                })
            }
            try {
                const admin = new Admin({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email
                })
                
                const result = await admin.save();
                return resp.status(200).json({
                    new_admin: result
                })

            } catch (saveerror) {
                return resp.status(500).json({
                    error:saveerror
                })
            }
        })
    } catch (hasherror) {
        return resp.status(500).json({
            error:hasherror
        })
    }
}

const login = async (req,resp,next)=>{
    Admin.find({email:req.body.email})
    .exec()
    .then((admin)=>{
        if(admin.lenght<1){
          return resp.status(401).json({
            error:"Admin Email is not exist"
          })
        }
        bcrypt.compare(req.body.password, admin[0].password, async(err,result)=>{
            if(!result){
                return resp.status(401).json({
                    error:"password does not matched"
                })
            }
            if(result){
                const token = jwt.sign(
                    {
                        _id: admin[0]._id,
                        name:admin[0].name,
                        email: email[0].email,
                    },
                    "This is the Dummy Text",
                    {
                        expiresIn: "24h",
                    }
                )
                resp.status(200).json({
                    _id: admin[0]._id,
                    name:admin[0].name,
                    email:admin[0].email,
                    token:token,
                })
            }
        })
    })
    .catch((err)=>{
        return resp.status(500).json({
            error:" something went wrong"
        })
    })
}

const login1 = async(req,resp) =>{
try {
    Admin.find({email: req.body.email})
    .exec()
    .then((admin)=>{
        if(admin.lenght<1){
            return resp.status(401).json({
                error:"Email Not Exist"
            })
        }
        bcrypt.compare(req.body.password,admin[0].password,async(err,result)=>{
            if(!result){
                return resp.status(401).json({
                    error:"password is not matched"
                })
            }
            if(result){
                const towken = jwt.sign({
                    _id: admin[0]._id,
                    name:admin[0].name,
                    email:admin[0].email,
                },
                "this is dummy text",
                {
                    expiresIn:"24h",
                }
                )
                return resp.status(200).json({
                    _id: admin[0]._id,
                    name:admin[0].name,
                    email:admin[0].email,
                    token:towken,
                })
            }
        })
    })
    
} catch (error) {
    return resp.status(500).json({
        error:"Something went wrong"
    })
    
}

}
const login2 = async(req,resp)=>{
    try {
        Admin.find({email:req.body.email}).exec()
        .then((admin)=>{
           if(!admin){
            return resp.status(201).json({
                error:"Email Not Found"
            })
           }
           bcrypt.compare(req.body.password, admin[0].password, async(err,result)=>{
           if(!result){
            return resp.status(201).json({
                error:"password does not matched"
            })
           }
           if(result){
            const token = jwt.sign({
              _id: admin[0]._id,
              name:admin[0].name,
              email:admin[0].email,
            },
              "Dummy Text",
              {
                expiresIn:"24h",
              }
            )
            return resp.status(200).json({
                _id:admin[0]._id,
                name:admin[0].name,
                email:admin[0].email,
                token:token
            })
           }
           })
        })
        
    } catch (error) {
        return resp.status(500).json({
            error:"Something Went Wrong"
        })
    }
}