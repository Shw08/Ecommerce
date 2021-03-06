const express = require('express')
const productRepo = require('../../Repository/product')
const productIndexTemplate = require('../../views/products/index')

const router=express.Router()

router.get('/' , async (req,res) => {
    const products = await productRepo.getAll()
    res.send(productIndexTemplate({products}))
})

module.exports = router