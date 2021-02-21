// packages
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose = require('mongoose');
const express=require("express");

const app=express();

// middleware
app.use(bodyParser.json());
app.use(cors());

// creation on actor schema

let actorSchema=new mongoose.Schema({
    "name":String,
    "age":Number,
    "country":String,
    "moviesCount":Number,
    "poster":String
})

// model for actors 

let actorModel=new mongoose.model('actors',actorSchema);



// creation of movie schema 

let movieSchema=new mongoose.Schema({
    "name": String,
    "universe": String,
    "genre":[String],
    "year":Number,
    "rating": Number,
    "revenue": Number,
    "poster": String,
    "actors":[{type:mongoose.Schema.Types.ObjectId,ref:'actors'}]
})



let movieModel=new mongoose.model("movies",movieSchema);


mongoose.connect("mongodb://127.0.0.1:27017/movies_actor",{ useNewUrlParser: true,  useUnifiedTopology: true }).then(()=>{
    console.log("connected!!");
})





app.get('/api/v1/movies',(req,res)=>{
    

    movieModel.find().populate('actors').then((movies)=>{

        res.send(movies);

        
    })



    
})


app.get('/api/v1/movies/:id',(req,res)=>{

    let id=req.params.id;
   

    movieModel.findById(id).populate('actors').then((movie)=>{
        res.send(movie);
    })
    
})



app.post('/api/v1/movies',(req,res)=>{
    // creation of movie
    let movie=req.body;
    
    let movieObj=new movieModel(movie);
    movieObj.save().then(()=>{
        res.send({"message":"Movie Created"});
    })

    


})

app.put('/api/v1/movies/:id',(req,res)=>{

        let id = req.params.id;
        let movie=req.body;

        
        movieModel.updateOne({"_id":id},movie).then(()=>{
            res.send({"message":"Movie Updated"});
        });

      

})


app.delete('/api/v1/movies/:id',(req,res)=>{

    let id=req.params.id;
    movieModel.deleteOne({"_id":id}).then(()=>{
        res.send({"message":"Movie Deleted"});
    })

})



app.get('/api/v1/actors',(req,res)=>{
    

    actorModel.find().then((actors)=>{
        res.send(actors);
    })

    
})


app.get('/api/v1/actors/:id',(req,res)=>{

    let id=req.params.id;
   
    actorModel.findById(id).then((actor)=>{
        res.send(actor);
    })
    
})



app.post('/api/v1/actors',(req,res)=>{
    
    let actor=req.body;
    
    let actorObj=new actorModel(actor);
    actorObj.save().then(()=>{
        res.send({"message":"Actor Created"});
    })

    


})

app.put('/api/v1/actors/:id',(req,res)=>{

        let id = req.params.id;
        let actor=req.body;

    
        movieModel.updateOne({"_id":id},actor).then(()=>{
            res.send({"message":"Actor Updated"});
        });

        


})


app.delete('/api/v1/actors/:id',(req,res)=>{

    let id=req.params.id;
    actorModel.deleteOne({"_id":id}).then(()=>{
        res.send({"message":"Actor Deleted"});
    })

})




app.listen(3000,()=>{
    console.log("server is running");
});