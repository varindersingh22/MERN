function createProduct(){

    let product={};

    product.id=document.getElementById("id").value;
    product.title=document.getElementById("name").value;
    product.description=document.getElementById("description").value;
    product.price=document.getElementById("price").value;
    product.rating=document.getElementById("rating").value;
    product.type=document.getElementById("type").value;

    console.log(JSON.stringify(product));

    fetch("http://localhost:3000/product",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(product),
        
      
    })
    .then((response)=>response.json())
    .then((data)=>{
        
        document.getElementById("addform").reset();

        document.getElementById("message").innerHTML=
        `<p class="alert alert-success">${data.message} Successfully!!!</p>`;
    }).catch((err)=>{
        console.log(err);
    })    




}