//main file
const express=require('express');
const userRoute=require('./user');
const productRoute=require('./product');

const app=express();

app.use('/user',userRoute);
app.use('/product',productRoute);





app.listen(3000);