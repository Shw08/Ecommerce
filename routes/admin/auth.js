const express=require('express')
const router = express.Router()
const userRepo=require('../../Repository/users')
const {handleError} = require('./middleware')
const signupTemplate=require('../../views/admin/auth/signup')
const signinTemplate=require('../../views/admin/auth/signin')
const { check ,validationResult } =require('express-validator')
const {requireEmail,
   requirePassword ,
    requirePasswordConfirmation,
    requireValidEmail,
    requireValidPasswordForUser } = require('./validator')


router.get('/signup' , (req,res) =>{
    res.send(signupTemplate({req}))
  })
  
  router.post('/signup', 
  [ requireEmail , requirePassword,requirePasswordConfirmation] , handleError(signupTemplate),
   async (req,res)=>{

     const { email , password , passwordConfirmation }= req.body 
     console.log('signup page')
     const user = await userRepo.create({email,password})
     req.session.userId=user.id;
     console.log(req.session.userId)
      res.redirect('/admin/products')
  })
  
  router.get('/signout', (req,res) =>{
    req.session=null;
    res.send('Sign Out')
  })
  
  router.get('/signin', (req,res)=>{
    res.send(signinTemplate({}))
  })
  
  router.post('/signin',
   [
    requireValidEmail,
    requireValidPasswordForUser
   ] ,
   handleError(signinTemplate),
   async (req,res) =>{
    const {email} = req.body
    const user = await userRepo.getOneUser({email})
    req.user=user;
    req.session.userId=user.id
    console.log(req.session.userId)
    res.redirect('/admin/products')
  })

  module.exports = router
  
  
  