const mongoose = require('mongoose')
 
const CustomizeSchema = new mongoose.Schema({
    
    
    data: {
        type: Map,
        of: [String]
      }
    });
    
module.exports = mongoose.model( 'CustomizeData', CustomizeSchema);