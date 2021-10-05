const { Router } = require('express');
const router = Router();
const Bookie = require('../models/bookie')
const User = require('../models/UserModel');
const verifyToken = require('./verifyToken')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const productController = require('../controllers/productController')



router.post('/signup', (req, res) => {
    try {
        // Receiving Data
        const { username, phone, password,parent,role } = req.body;
           User.findOne({username:username},async(err,myuser)=>{
               if(myuser==null){
            const user = new User({
                username,
                phone,
                password,
                parent,
                role
            });
            user.password = await user.encryptPassword(password);
            await user.save();
            // Create a Token
            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            });
    
            res.json({ auth: true, token, errCode:0,username });   
        }else {
            res.json({ auth: false, errCode:1,myuser });
        }
           
        })

        // Creating a new User
       

    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your user');
    }
});

router.post('/bookiesignup', (req, res) => {
    try {
        // Receiving Data
        const { username, phone, password,parent } = req.body;
           Bookie.findOne({username:username},async(err,myuser)=>{
               if(myuser==null){
            const bookie = new Bookie({
                username,
                phone,
                password,
                parent
            });
            Bookie.password = await bookie.encryptPassword(password);
            await bookie.save();
            // Create a Token
            const token = jwt.sign({ id: bookie.id }, config.secret, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            });
    
            res.json({ auth: true, token, errCode:0,username });   
        }else {
            res.json({ auth: false, errCode:1,myuser });
        }
           
        })

        // Creating a new User
       

    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your user');
    }
});

router.post('/reset', (req, res) => {
    try {
        // Receiving Data
        const { username, password} = req.body;
           User.findOne({username:username},async(err,user)=>{
               console.log(user)
           
            // const salt =  bcrypt.genSalt(10);
            // const newpass = bcrypt.hash(password, salt);
            user.password = await user.encryptPassword(password);
            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            });
            console.log(user.password)
           User.update({"username":username}, {$set: {"password":user.password}},(err,mypass)=>{
               if(err){
                   console.log(err);
               }else{
                   console.log(mypass);
               }
           })
    
            res.json({ auth: true, token, errCode:0,username });   
        
           
           })

        // Creating a new User
       

    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your user');
    }
});

router.post('/upline',(req,res)=>{

    const username = req.body.username
     console.log(username);
    User.findOne({username:username},(err,usernam)=>{
        console.log(err);
        if(!usernam){
            res.json({ auth: true, errCode:0,usernam }); 
        }else{
            res.json({ auth: true, errCode:1,usernam }); 

        }
    })
})

router.route('/products')
    .get(productController.index)
    .post(productController.new)

router.route('/product/:id')
    .get(productController.view)
    .put(productController.update)
    .delete(productController.delete)



router.post('/signin', async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            res.json({ auth: '1' });
            console.log(user.password);
        }else{
        const validPassword = await user.validatePassword(req.body.password, user.password);
        if (!validPassword) {
            return res.json({ auth: '1', token: null });
        }else{
        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: '24h'
        });
        res.json({ auth: '2',role:user.role,user:user.username });
    }
}
    } catch (e) {
        console.log(e)
        res.status(500).json('There was a problem signin');
    }
});
router.post('/bookiesignin', async(req, res) => {
    try {
        const bookie = await Bookie.findOne({ username: req.body.username })
        if (!bookie) {
            return res.status(404).send("The email doesn't exists")
        }
        const validPassword = await bookie.validatePassword(req.body.password, bookie.password);
        if (!validPassword) {
            return res.status(401).send({ auth: false, token: null });
        }
        const token = jwt.sign({ id: bookie._id }, config.secret, {
            expiresIn: '24h'
        });
        res.status(200).json({ auth: true, token });
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem signin');
    }
});


router.get('/dashboard', (req, res) => {
    res.json('dashboard');
})

router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;