var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')

router.post('/register', authController.register)
router.post('/login',async(req,res,next)=>{

})
router.post('/logout',async(req,res,next)=>{

})
module.exports = router