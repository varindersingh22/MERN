const bodyParser=require('body-parser');
const express=require("express");
const cors=require('cors');
const fs=require('fs');
const fsp=require('fs').promises;
const app=express();

app.use(bodyParser.json());
app.use(cors());


const moviesJSON=fs.readFileSync("./movies.json",{encoding:"utf-8"});
let movies=JSON.parse(moviesJSON);

function updateFileOne(array,message,res){

    fs.writeFile("./movies.json",JSON.stringify(array),(err)=>{

        if(err!=null){
            console.log(err);
            res.send({message:"there is some problem"});
        }
        res.send({message:message});

    })
    

}

async function updateFileTwo(array){

    let check;

    await fsp.writeFile("./movies.json",JSON.stringify(array))
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




app.get('/api/v1/movies',(req,res)=>{
    res.send(movies);
})


app.get('/api/v1/movies/:id',(req,res)=>{

    let movie=movies.find((ele)=>{
        return ele.id==req.params.id;
    })

    if(movie==undefined){
        res.send({message:"Movie Not Found"});
    }
    
    res.send(movie);

})

app.post('/api/v1/movies',async (req,res)=>{

    let movie=req.body;
    movies.push(movie);

    let status=await updateFileTwo(movies);
    console.log(status);
    if(status==true){
        res.send({message:"Movie Created"});
    }
    else {
        res.send({message:"There is Some problem"});
    }


})

app.put('/api/v1/movies/:id',async (req,res)=>{

    let id=req.params.id;
    let movie=req.body;
    console.log(movie);

    movies.forEach((ele)=>{
        if(ele.id==id){
            ele.name=movie.name;
            ele.revenue=movie.revenue;
        }
    })

    let status= await updateFileTwo(movies);
    console.log(status);
    if(status==true){
        res.send({message:"Movie Updated"});
    }
    else {
        res.send({message:"There is Some problem"});
    }

})


app.delete('/api/v1/movies/:id',async (req,res)=>{

    let id=req.params.id;

    

    movies.forEach((ele,index)=>{
        if(ele.id==id){
            movies.splice(index,1);
        }
    })

    let status=await updateFileTwo(movies);
    if(status==true){
        res.send({message:"Movie Deleted"});
    }
    else {
        res.send({message:"There is Some problem"});
    }

})



app.listen(3000,()=>{
    console.log("server is running");
});
