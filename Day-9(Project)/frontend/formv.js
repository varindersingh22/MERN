function validateName(){
    let name=document.getElementById("name").value;
    let exp=new RegExp("[A-Za-z]{3,}");
    if(name==""){

        document.getElementById("nameError").innerText
        ="Name should not empty";
        return false;
    }

    if(!exp.test(name)){
        document.getElementById("nameError").innerText
        ="Name should not have a number";
        return false;
    }

    document.getElementById("nameError").innerText="";
    return true;

}
function validateprice(){
    let price=document.getElementById("price").value;
    
    if(price==""){
        document.getElementById("priceError").innerText
        ="price should not be empty";
        return false;
    }

    if(price<10){

        document.getElementById("priceError").innerText
        ="price should be greater than 10";
        return false;
    }
    

    document.getElementById("priceError").innerText="";
    return true;

}
function validateRate(){
    let age=document.getElementById("rating").value;
    
    if(age==""){
        document.getElementById("rateError").innerText
        ="rate should not be empty";
        return false;
    }

    if(rate<=5){

        document.getElementById("rateError").innerText
        ="rate should be 5 or less than 5.";
        return false;
    }
    

    document.getElementById("rateError").innerText="";
    return true;

}



let errorcount=0;
function validateForm(){

    if(validateName()==false){
        errorcount++;
    }

    if(validateprice()==false){
        errorcount++;
    }
    if(validateRate()==false){
        errorcount++;
    }

    console.log(errorcount);

    if(errorcount==0){
        console.log("form good to go");
    }

    errorcount=0;
}