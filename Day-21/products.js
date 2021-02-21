// packages 
const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');

const router = express.Router();

app.use(bodyParser.json());
app.use(cors());


let dummyRes={"test":"success!!!"};

let productSchema= new mongoose.Schema({
    name:String,
    price:Number,
    rating:Number,
    category:String
})



let productsModel=new mongoose.model('products',productSchema);

mongoose.connect('mongodb://127.0.0.1:27017/products_all',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("connected");
})






 
router.post('/createproduct',(req,res)=>{

    let user=req.body;
    
    let userData=new usersModel(user);
    userData.save()
    .then(()=>{
        res.send({"message":"User Created"});
    })

    
})

 

module.exports = router;