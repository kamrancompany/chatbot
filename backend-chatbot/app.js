const express = require('express');
const app = express();
// const morgan = require('morgan');
require('dotenv').config()
require('./db/config')


const bodyparser = require('body-parser')
const cors = require('cors');


const bardapi = require('./Routes/custombot');
const usersRoutes = require('./Routes/users');

// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// // Increase the limit for JSON bodies
// app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyparser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyparser.json({ limit: '10mb' }));

app.use(express.json());
// app.use(morgan('combined'));
app.use(cors());




app.use('/api', bardapi); 
app.use('/users',usersRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message, stack: err.stack });
});


app.use((req,resp,next)=>{
  resp.status(404).json({
      message:'Bad request ooops '
  })
})

module.exports = app;

