// connect to Mongo
const mongoose = require('mongoose')

function connectMongo() {
  mongoose.connect('mongodb://sanjeev:mypassword@mongodb:27017/mydb?authSource=admin')
    .then(()=>console.log('successfully connected to mongodb'))
    .catch(e=>{
      console.log('error occurred in connecting to db : ', e)
      setTimeout(connectMongo, 5000)
    })
}
connectMongo()

// express setup
const express = require('express')
const app = express()

app.use(express.json())

// connect to Redis
const redis = require('redis')
let redisClient = redis.createClient({url:'redis://redis:6379'})
redisClient.on('error', (err)=>console.log('redis error : ', err))
redisClient.on('ready', ()=>console.log('connected to redis...'))
async function connectRedis() {
  await redisClient.connect().catch(console.error)

  // await redisClient.set('my_key', 'my value');
  // const value = await redisClient.get('my_key');
  // console.log('my_key : ', value)
}
connectRedis()

// routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello World'
  })
})

const postRouter = require('./routes/postRouter')
app.use('/api/v1/post', postRouter)

app.listen(3000, () => {
  console.log('app is listening on port 3000')
})