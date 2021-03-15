const { check } =require('express-validator')
const userRepo=require('../../Repository/users')


module.exports = {
  requireTitle : check('title')
  .trim()
  .isLength({min:3 , max:20})
  .withMessage('Required Product Length between 3-40'),
  requirePrice : check('price')
  .trim()
  .toFloat()
  .isFloat({min:1})
  .withMessage('Must be number greater than   1'),
    requireEmail : check('email')
     .trim()
     .normalizeEmail()
     .isEmail()
     .withMessage('Invalid Email')
     .custom( async email => {
       const existingUser = await userRepo.getOneUser({ email })
        if(existingUser)
        {
           throw new Error('User Already In Use')
        }
     }),

     requirePassword :  check('password')
     .trim()
     .isLength({ min:4 , max:20 })
     .withMessage('Length of password should be between 4 - 20'),

     requirePasswordConfirmation : check('passwordConfirmation')
     .trim()
     .isLength({ min:4 , max:20 })
     .withMessage('Length of password should be between 4 - 20')
     .custom( async (passwordConfirmation , {req} ) =>{
       if(passwordConfirmation !== req.body.password)
       {
         throw new Error('Password Did Not Match')
       }
     }),
     requireValidEmail: check('email')
     .trim()
     .normalizeEmail()
     .isEmail()
     .withMessage('Invalid Email')
     .custom( async (email) =>{
       const user = await userRepo.getOneUser({email})
       if(!user)
       {
         throw new Error('Email not found')
       }
     }),
     requireValidPasswordForUser :  check('password' )
     .trim()
     .custom( async(password , {req} ) =>{
       const user = await  userRepo.getOneUser({email : req.body.email})
       if(!user)
       {
         throw new Error('invalid Password')
       }
       const validPassword = await userRepo.comparePasswords(user.password , password)
       if(!validPassword)
       {
          throw new Error('Password Did not Match')
       }
     })
}