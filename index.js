const express = require('express')
const cookieSession = require('cookie-session')
const authRouter=require('./routes/admin/auth')
const adminProductRouter=require('./routes/admin/products')
const productRouter=require('./routes/products/products')
const cartRouter = require('./routes/carts')
const bodyParser = require('body-parser')

const app=express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieSession({
  keys:['asgdifhhsahj']
}))
app.use(authRouter)
app.use(adminProductRouter)
app.use(productRouter)
app.use(cartRouter)
//app.use(express.json())

const port= process.env.PORT


app.listen(port, () =>{
   console.log('LISTENING AT PORT', port);
})