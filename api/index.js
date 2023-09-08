const mongoose = require('mongoose')
mongoose.connect('mongodb://sanjeev:mypassword@mongodb:27017/mydb?authSource=admin')
  .then(()=>console.log('connected to mongodb'))
  .catch((err)=>console.log('error connecting to mongodb : ', err))
  
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello World'
  })
})

app.listen(3000, () => {
  console.log('app is listening on port 3000')
})