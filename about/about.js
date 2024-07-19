function toggleDropdownShow(){
    if(document.querySelector(".dropdown").classList.contains("display-dropdown")){
        document.querySelector("#main").style.filter = "brightness(100%)"
        document.querySelector(".dropdown").classList.toggle("display-dropdown")
    }
    else{
        document.querySelector("#main").style.filter = "brightness(50%)"        
        document.querySelector(".dropdown").classList.toggle("display-dropdown")         
    }
}