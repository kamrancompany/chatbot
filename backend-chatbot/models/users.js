const mongoose = require('mongoose')
 
const usersSchema = new mongoose.Schema({
    
    _id:mongoose.Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now,
      },
    name:String,
    password:String,
    email:String,
    data: [
      {
        question: {
          type: String,
          required: true
        },
        answer: {
          type: mongoose.Schema.Types.Mixed 
        }
      }
    ]
})

module.exports = mongoose.model('Users',usersSchema)