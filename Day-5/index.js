//import packages
const http=require("http");
const fs=require("fs");
const url=require("url");
//read json file
const superHero =fs.readFileSync("./superheroes.json","utf-8");
const heros=JSON.parse(superHero);

//api

const server=http.createServer((req,res)=>{
    //const path=req.url;
    //parse path to get specific values
    const path = url.parse(req.url,true);

    //writehead
    res.writeHead(200,{
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Methods":"OPTIONS,POST,GET,PUT,PATCH,DELETE",
        "Content-Type":"application/json"
    })

    //conditions

    if(path.pathname=='/' || path.pathname=='/heroes'){
        //to read the whole file
       res.end(superHero);
    }
    //for specific 

    else if(path.pathname=='/hero'){
        //GET
        if(req.method=='GET'){
            const id=path.query.id;
            const singleData=heros.filter((ele)=>{
                return ele.id==id;
            })
            res.end(JSON.stringify(singleData));
            
        }
        //to POST
        else if(req.method=="POST"){
            let body="";
            req.on('data',(data)=>{
                body+=data;
            })
            req.on('end',()=>{
                let heros=JSON.parse(body);
                heros.push(hero);
                fs.writeFileSync("./superheroes.json",JSON.stringify(heros),(err)=>{
                    res.end("clear");
            
                });
            })
            res.end("Complete");
        }

        //to PUT
        else if(req.method=='PUT'){
            const id=path.query.id;
            let body="";
            req.on('data',(data)=>{
                body+=data;
            })
            req.on('end',()=>{
                let heros=JSON.parse(body);
                heros.forEach((ele)=>{
                    if(ele.id==id){
                        ele.name=heros.name;
                        ele.weapons=heros.weapons;
                        ele.age=heros.age;
                        ele.planet=heros.planet;
                    }
                    
                })
                fs.writeFile("./superheroes.json",JSON.stringify(heros),(err)=>{
                    res.end(JSON.stringify({message:"Hero Database updated"}));
                });
        })

    }
    //to delete
    else if(req.method=="DELETE"){
        const id=path.query.id;
        heros.forEach((ele,index)=>{
            if(ele.id==id){
                heros.splice(index,1);
            }
        })
        fs.writeFile("./superheroes.json",JSON.stringify(heros),(err)=>{
            res.end(JSON.stringify({message:"Hero Dumped"}));
        });
    }
    }
    else{
        res.writeHead(404);
        res.end("Not found");
    }
});

server.listen("3000","127.0.0.1",()=>{
    console.log("running");
})