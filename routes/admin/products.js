const express = require('express')
const multer = require('multer')
const { create } = require('../../Repository/product')

const {handleError , requireAuth} = require('./middleware')
const productRepo = require('../../Repository/product')
const newProductTemplate = require('../../views/admin/product/new')
const productTemplateIndex = require('../../views/admin/product/index')
const productEditTemplate = require('../../views/admin/product/edit')
const {requireTitle , requirePrice } = require('./validator')


const router = express.Router();
const upload = multer({ storage : multer.memoryStorage() })

router.get('/admin/products' , requireAuth , async (req,res) =>{ 
    const products = await productRepo.getAll()
    res.send(productTemplateIndex({products}))
})

router.get('/admin/products/new' , requireAuth ,(req,res)=>
{ 
    res.send(newProductTemplate({}) )
} )

router.post('/admin/products/new',
requireAuth,
upload.single('image') , 
[requireTitle , requirePrice ] ,
handleError( newProductTemplate) ,
async (req,res)=>
{ 
    const image = req.file.buffer.toString('base64')
    const {title , price }= req.body
    await productRepo.create({title,price,image})
    res.redirect('/admin/products')
})

router.get('/admin/products/:id/edit' , requireAuth , async (req,res)=>{
    const product = await productRepo.getOne(req.params.id)
    if(!product)
    {
        res.send('product not found')
    }  
    res.send(productEditTemplate({product}))
})


router.post('/admin/products/:id/edit' , requireAuth,
upload.single('image') , 
[requireTitle , requirePrice ] ,
handleError(  productEditTemplate , async req =>{ 
    const product = await productRepo.getOne(req.params.id)
    return {product}
}) ,

async (req,res)=>{
    const changes = req.body
    if(req.file)
    {
        changes.image=req.file.buffer.toString('base64')
    }
    console.log(changes)
    try
    {
      await productRepo.update(req.params.id,changes)
    }
    catch(err)
    {
       res.send('Could not find product')
    }

    res.redirect('/admin/products')
})

router.post('/admin/products/:id/delete' , requireAuth , async (req,res)=>{
    await productRepo.delete(req.params.id)
     
    res.redirect('/admin/products')
})



module.exports = router