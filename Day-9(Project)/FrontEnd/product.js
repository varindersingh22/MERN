let url=location.href;
let id=url.split("?")[1].split("=")[1];


let dummyRating="";
    for(let i=1;i<=5;i++)
    {
        dummyRating+=` <i class="fa fa-star notrated" style="font-size: 20px" aria-hidden="true"></i>`;
        
    }

    let ratingString="";
    for(let i=1;i<=5;i++)
    {
            ratingString+=` <i class="fa fa-star" style="font-size: 20px;color:gold;display:inline" aria-hidden="true"></i>`;
        
    }

fetch("http://localhost:3000/product?id="+id)
.then((response)=>response.json())
.then((product)=>{

    

    let myRating="";
    for(let i=0;i<=4;i++)
    {
        myRating+=` <i class="fa fa-star myrate notrated" onclick="submitRating(${product.id})" onmouseover="makeRated(${i})" onmouseout="makeUnRated()" style="font-size: 20px" aria-hidden="true"></i>`;
        
    }
    
    
    let averageRating=product.rating/product.rating_count;
    let widthPercentage=Math.round((averageRating/5)*100);
    
    

    
    document.getElementById("productname").innerText=product.title;

    let productString=`
    <div class="card-body">
        <div class="card-title" style="font-size:50px;text-align:center">${product.emoji}${product.emoji}${product.emoji}</div>
    </div>
        <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Price : &#8377; ${product.price}</li>
            <li class="list-group-item" id="rating" style="height:50px">
                   
                <div id="productRating" style="width:115px;position:absolute">

                    <div class="dummystars" style="width:100%;position:absolute">
                        ${dummyRating}
                    </div>

                    <div class="dummystars" style="width:${widthPercentage}%;height:24px;position:absolute;white-space:nowrap;overflow:hidden">
                        ${ratingString} 
                    </div>



                </div>     
                
                
                <div id="rating_count" style="position:absolute;left:150px">
                ( ${product.rating_count} rating )
                </div>
                
                

            </li>
            <li class="list-group-item" id="myrating">${myRating} ( Rate Here )</li>
            <li class="list-group-item">Type : ${product.type}</li>
        </ul>
        <div class="card-body">
        <a href="#" class="card-link btn btn-success">Buy Now</a>
        </div>
    `;

    document.getElementById("product").innerHTML=productString;

})




function makeRated(index){

    var stars=document.getElementById("myrating").children;

    for(let i=0;i<stars.length;i++){
        stars[i].classList.remove("rated");
        stars[i].classList.add("notrated");
    }

    
    for(let i=0;i<=index;i++){
            stars[i].classList.remove("notrated");
            stars[i].classList.add("rated");

    }

    
}

function makeUnRated(){

    var stars=document.getElementById("myrating").children;

    for(let i=0;i<stars.length;i++){
        stars[i].classList.remove("rated");
        stars[i].classList.add("notrated");
    }
}


function submitRating(id){

    let rating=document.getElementById("myrating").getElementsByClassName("rated").length;

    console.log(JSON.stringify({rating:rating}));

    fetch("http://localhost:3000/updateRating?id="+id,{
        method:"PUT",
        body:JSON.stringify({rating:rating}),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then((response)=>response.json())
    .then((product)=>{
        
        let averageRating=product.rating/product.rating_count;
        let widthPercentage=Math.round((averageRating/5)*100);

        console.log(widthPercentage);

        document.getElementById("productRating").innerHTML=`


                <div class="dummystars" style="width:100%;position:absolute">
                    ${dummyRating}
                </div>

                <div class="dummystars" style="width:${widthPercentage}%;height:24px;position:absolute;white-space:nowrap;overflow:hidden">
                    ${ratingString} 
                </div>

        `;


        document.getElementById("rating_count").innerHTML=`
                ( ${product.rating_count} rating )
        `;




    })
    .catch((err)=>{
        console.log(err);
    })




}










