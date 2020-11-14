// to fetch all products 

fetch("http://localhost:3000/products")
.then((response)=>response.json())
.then((products)=>{
    

    let productsString="";
    
    products.forEach((product,index) => {

        productsString+=`
            <tr>
                <td>${index+1}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.type}</td>
                <td>${product.rating}</td>
                <td>
                    <button class="btn btn-success" onclick="updateDataReady(this,${product.id})">Update</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id},this)">Delete</button>
                </td>
            </tr>
        `;

    });


    document.getElementById('product_container').innerHTML=productsString;


})


let childrens;

function updateDataReady(ele,id){


    // displaying the modal

        document.getElementById('parent_popup').style.display="block";

    // getting the data ready 

    childrens=ele.parentNode.parentNode.children;
    
    document.getElementById("id").value=id;

    document.getElementById("name").value=childrens[1].innerText;
    document.getElementById("description").value=childrens[2].innerText;
    document.getElementById("price").value=childrens[3].innerText;
    document.getElementById("type").value=childrens[4].innerText;


}

function closeModal(ev){

    if(ev.target.className=="parent_popup")
    {
        document.getElementById('parent_popup').style.display="none";
    }

    
}



function deleteProduct(id,ele){

    ele.parentNode.parentNode.style.display="none";

    fetch("http://localhost:3000/product?id="+id,{
        method:"DELETE"
    })
    .then((response)=>response.json())
    .then((data)=>{
        
        document.getElementById("message").innerHTML=
        `<p class="alert alert-success">${data.message}</p>`;



    })
}

function updateProduct(){

    let product={};

    let id=document.getElementById("id").value; 
    product.title=document.getElementById("name").value;
    product.description=document.getElementById("description").value;
    product.price=document.getElementById("price").value;
    product.type=document.getElementById("type").value;

    

    fetch("http://localhost:3000/product?id="+id,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(product),
        
      
    })
    .then((response)=>response.json())
    .then((product)=>{

        

        document.getElementById('parent_popup').style.display="none";

        childrens[1].innerText=product.title;
        childrens[2].innerText=product.description;
        childrens[3].innerText=product.price;
        childrens[4].innerText=product.type;


        document.getElementById("message").innerHTML=
        `<p class="alert alert-success">Product Updated Successfully!!!</p>`;



    }).catch((err)=>{
        console.log(err);
    })    



}





