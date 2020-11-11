const http=require('http');
const fs=require('fs');
const url=require('url');

// creation of server 

// reading the file 


const heroesString=fs.readFileSync("./heroes.json","utf-8");
const heroes=JSON.parse(heroesString);


const server=http.createServer((req,res)=>{

    

    // const path=req.url;
    // console.log(req.method);

    const path=url.parse(req.url,true);
    


    res.writeHead(200,{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, PATCH, DELETE",
        "Access-Control-Allow-Headers":"*",
        "Content-Type":"application/json"
    });

    if(path.pathname=="/" || path.pathname=="/heroes"){

        res.end(heroesString);
        
    }
    else if(path.pathname=="/hero"){

        if(req.method=="OPTIONS"){

            res.end();
           
        } 
        else if(req.method=="GET")
        {
            const id=path.query.id;

            const singleData=heroes.find((ele)=>{
                return ele.id==id;
            })
            res.end(JSON.stringify(singleData));
        }
        else if(req.method=="POST"){

            console.log("its working");


            let body="";
            req.on('data',(data)=>{
                body+=data;
            })

            req.on('end',()=>{
                let hero=JSON.parse(body);
                console.log(hero);
                heroes.push(hero);
                fs.writeFile("./heroes.json",JSON.stringify(heroes),(err)=>{
                    res.end(JSON.stringify({message:"hero added"}));
                });


            })

            

        }
        else if(req.method=="PUT"){

            // product id 
            const id=path.query.id;

            // product data
            let body="";
            req.on('data',(data)=>{
                body+=data;
            })

            req.on('end',()=>{
                let hero=JSON.parse(body);

                // index will not work 

                heroes.forEach((ele)=>{
                    if(ele.id==id){

                        ele.name=hero.name;
                        ele.age=hero.age;
                        ele.planet=hero.planet;
                        ele.weapons=hero.weapons;

                    }
                })

                
                fs.writeFile("./heroes.json",JSON.stringify(heroes),(err)=>{
                    res.end(JSON.stringify({message:"hero updated"}));
                });

                    


            })


        }
        else if(req.method=="DELETE"){

            // hero id 
            const id=path.query.id;

            heroes.forEach((ele,index)=>{
                if(ele.id==id){
                    heroes.splice(index,1);
                }
            })


            fs.writeFile("./heroes.json",JSON.stringify(heroes),(err)=>{
                res.end(JSON.stringify({message:"hero deleted"}));
            });

            



        }
        
        
        

      
    }
    else {
        res.writeHead(404,{
            "Content-Type":"application/json"
        });
        res.end(JSON.stringify({message:"Not Found anything for this URL"}));
    }

    

});

server.listen("3000","127.0.0.1",()=>{
    console.log("server is running");
})


