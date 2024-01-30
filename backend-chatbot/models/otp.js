const mongoose = require('mongoose')
 
const otpSchema = new mongoose.Schema({
    code:String,
    email:String,
    expireIn:Number
},{
    timestamps:true
})

module.exports = mongoose.model('Otp',otpSchema)