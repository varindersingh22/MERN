const bodyParser=require('body-parser');
const express=require("express");
const cors=require('cors');
const fs=require('fs');
const fsp=require('fs').promises;
const app=express();

app.use(bodyParser.json());
app.use(cors());



// reading file 

const productsJSON=fs.readFileSync("./products.json",{encoding:"utf-8"});
let products=JSON.parse(productsJSON);


// function for writing file 

function updateFileOne(array,message,res){

    fs.writeFile("./products.json",JSON.stringify(array),(err)=>{

        if(err!=null){
            console.log(err);
            res.send({message:"there is some problem"});
        }
        res.send({message:message});

    })
    

}

async function updateFileTwo(array){

    let check;

    await fsp.writeFile("./products.json",JSON.stringify(array))
    .then(()=>{
        check = true;
    })
    .catch((err)=>{
        console.log(err);
        check=false;
    })

    console.log(check);
    return check;
}




app.get('/api/v1/products',(req,res)=>{
    res.send(products);
})


app.get('/api/v1/products/:id',(req,res)=>{

    let product=products.find((ele)=>{
        return ele.id==req.params.id;
    })

    if(product==undefined){
        res.send({message:"Movie Not Found"});
    }
    
    res.send(product);

})

app.post('/api/v1/products',async (req,res)=>{

    let product=req.body;
    products.push(product);
   

    let status=await updateFileTwo(products);
    console.log(status);
    if(status==true){
        res.send({message:"Product Created"});
    }
    else {
        res.send({message:"There is Some problem"});
    }


})

app.put('/api/v1/products/:id',async (req,res)=>{

    let id=req.params.id;
    let product=req.body;
    console.log(product);

    movies.forEach((ele)=>{
        if(ele.id==id){
            ele.name=product.name;
            ele.price=product.price;
        }
    })

    let status= await updateFileTwo(products);
    console.log(status);
    if(status==true){
        res.send({message:"Product Updated"});
    }
    else {
        res.send({message:"There is Some problem"});
    }

})


app.delete('/api/v1/products/:id',async (req,res)=>{

    let id=req.params.id;

    

    products.forEach((ele,index)=>{
        if(ele.id==id){
            products.splice(index,1);
        }
    })

    let status=await updateFileTwo(products);
    if(status==true){
        res.send({message:"Product Deleted"});
    }
    else {
        res.send({message:"There is Some problem"});
    }

})



app.listen(3000,()=>{
    console.log("server is running");
});
