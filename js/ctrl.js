import {
    // * App
    initializeApp,

    collection, 
    initializeFirestore,
    persistentLocalCache,
    CACHE_SIZE_UNLIMITED,
    onSnapshot, deleteDoc, updateDoc,
    setDoc, doc, addDoc, Timestamp,
    query, 

    // * Auth
    getAuth, onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut
}
from "./firebaseUtils.js"

//* grab() added to namespace from js/utils.js in index.html

//TODO Todo here

const firebaseConfig = {
    apiKey: "AIzaSyDCNmFOI6tUof-LIH_tiRmY0Vihpy13qpY",
    authDomain: "kinoko-4261b.firebaseapp.com",
    projectId: "kinoko-4261b",
    storageBucket: "kinoko-4261b.appspot.com",
    messagingSenderId: "236748399771",
    appId: "1:236748399771:web:97c4622e4c6ac1d8af923e",
    measurementId: "G-MVNFCR6XJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let db

const inputElms =  [...grab('.login-element > input', "all")]


function switchToSignin(){
    
// * LogIn
    showBlock("login-container")

// * SignIn
    showFlex("signin-container")

// * Content
    hide("content-container")
    
}
function switchToShowEntries(){

// * LogIn
    hide("login-container")
    
// * SignIn
    hide("signin-container")

// * Content
    showFlex("content-container")
        
}
function switchToAddEntry(){

// * LogIn
    hide("login-container")
    
// * SignIn
    hide("signin-container")

// * Content
    showFlex("content-container")

}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function resetLoginInputs(){
    grab("signin-email-input").value = ""
    grab("signin-password-input").value = ""
    inputElms.forEach((inputElm) => {
        inputElm.classList.remove("login-input-clicked")
        inputElm.addEventListener("click", e => { e.target.classList.add("login-input-clicked") }, {once: true})
    })    
}




async function signInUser(){

    let emailInput      = grab("signin-email-input").value
    let passwordInput   = grab("signin-password-input").value

    let errorsList = []

    if(!emailValid(emailInput)){        errorsList.push("Email invalid.") }
    if(emailInput == ""){               errorsList.push("Email cannot be empty.") }
    if(passwordInput == ""){            errorsList.push("Password cannot be empty.") }
    if(!passwordInput.length > 1000){   errorsList.push("Your passowrd does not need to be that long. cmon.") }

    if(errorsList.length == 0){
        await signInWithEmailAndPassword(auth, emailInput, passwordInput)
        .then((userCredential) => { 
            // ? Throws to signin-state observer
        })
        .catch((error) => { 
            errorsList.push(`Server: ${error.code.split("/")[1].replaceAll("-"," ")} `) 
        });   
    }
    
    if(errorsList.length > 0){
        grab("signin-error").style.display = "block" 
        grab("signin-error").innerHTML = ""
        errorsList.forEach((error) => { grab("signin-error").innerHTML += `# ${error} <br>` } ) 
    }  
}


function signOutUser(){
    signOut(auth).then(() => {
        // ? Throws to observer
    }).catch((error) => {
        let errorMessage = error.code.split("/")[1].replaceAll("-"," ")
        console.log(errorMessage)
        // TODO Handle error, retry 
    });
}


function addEventListenersToSignin(){
    // ? Signin buttons
        grab("signin-button").addEventListener("click", signInUser)
    
    // ? Signout button
        grab("logout-button").addEventListener("click", signOutUser)
        
}   
addEventListenersToSignin()


function addNewGig(){
    let gigNameInput = grab("name-input").value
    let startTimeInput = grab("start-time-input").value
    let descInput = grab("desc-input").value
    let priceInput = grab("price-input").value
    let venueNameInput = grab("venuename-input").value
    let addressInput = grab("address-input").value
    let pictureUrlInput = grab("pictureurl-input").value
    let eventLinkInput = grab("eventlink-input").value


    let valid = true
    if(gigNameInput =="" ){ 
        grab("name-input").placeholder = "Name cannot be empty"
        valid = false 
        console.log("name cannot be empty")
    }
    // if(descInput =="" ){    
    //     grab("desc-input").placeholder = "Description cannot be empty"
    //     valid = false 
    // }
    const expression = /^[0-9]+$/
    const regexNum = new RegExp(expression)
    if(priceInput == ""){   
        grab("price-input").placeholder = "Price cannot be empty"
        valid = false 
        console.log("price cannot be empty or anything but a number")

    }

    else if(!priceInput.match(regexNum)){
        grab("price-input").value = ""
        grab("price-input").placeholder = "Price cannot contain anything but numbers"
        valid = false 
        console.log("price cannot be more than 10 digits")
    }
    priceInput = Number(priceInput)
    if(venueNameInput == "" ){ 
        grab("venuename-input").placeholder = "Venue name cannot be empty"
        valid = false 
        console.log("venue name cannot be empty")
    }
    if(addressInput == "" ){ 
        grab("address-input").placeholder = "Address cannot be empty"
        valid = false 
        ceonsole.log("address cannot be empty")
    }
    console.log("valid",valid)
    console.log("trying to add new gig")
    console.log(userId)
    if(valid === true){
        console.log("trying to add new gig")
        console.log(userId)
        try{
            let docRef = addDoc(collection(db, `users/${userId}/events`), {
                datetime: new Timestamp(Math.round(new Date(startTimeInput).getTime() / 1000), 499999999),
                description: descInput,
                eventname: gigNameInput,
                link: eventLinkInput,
                pictureurl: pictureUrlInput,
                price: priceInput,
                venueaddress: addressInput,
                venuename: venueNameInput
            });
        }
        catch(e){
            console.log(e)
        }8
    }



}

function gigObjToGigElement(gigObj){
    let gigElm = document.createElement("div")

    let gigName = gigObj.data().eventname
    let gigTime = new Date(gigObj.data().datetime.seconds * 1000)
    let gigDesc = gigObj.data().description
    let gigPrice = gigObj.data().price
    let gigVenueName = gigObj.data().venuename
    let gigVenueAddress = gigObj.data().venueaddress

    let gigPictureUrl = gigObj.data().pictureurl
    let gigLink = gigObj.data().link

    let timeLeft = gigTime.getTime() - new Date().getTime()
    if(timeLeft < 0){
        timeLeft = 0
    }
    gigElm.dataset.timeLeft = timeLeft






    
    gigElement.classList.add("gig-element")
    gigElement.innerHTML = `
        <div class="gig-element-left">
            <img src="${gigObj.pictureurl}" alt="gig image">
        </div>
        <div class="gig-element-right">
            <h3>${gigObj.eventname}</h3>
            <p>${gigObj.datetime.toDate()}</p>
            <p>${gigObj.venuename}</p>
            <p>${gigObj.venueaddress}</p>
            <p>${gigObj.price}</p>
            <p>${gigObj.description}</p>
            <a href="${gigObj.link}">Link</a>
        </div>
    `
    return gigElement
}
function addGigToFeed(gigObj){
    
}



var userId = ""
const auth = getAuth();
grab("loading").style.display = "none"

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("show content and hide signin", user.uid)
        userId = user.uid
        // TODO PLAN
        // * Only get a certain amt of entries and udate as user scrolls (less reads)
        // * Do the whole local cache and offline persistence thing isjk 

        switchToShowEntries()
        var lastId = "0"
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({
                cacheSizeBytes:CACHE_SIZE_UNLIMITED
            })
        })
        onSnapshot(
            query(collection(db, `users/${userId}/events`)), { includeMetadataChanges: true }, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    const source = snapshot.metadata.fromCache ? "local cache" : "server";
                    console.log("- snapshot")
                    if(change.type === "added"){
                        addGigToFeed(change.doc)      
                        console.log("added:",change.doc.id,change.doc.data(), "from", source) 
                    }
                    if(change.type === "modified"){
                        console.log("modified:",change.doc.data(), "from", source)
                        //removeEntry(change.doc.id)
                    }
                    if(change.type === "removed"){
                        
                        console.log("removed:",change.doc.data(), "from", source)
                    }
                    lastId = change.doc.id
                })
            }
        )
    }
    else {
        console.log("hide content and show signin")
        userId = ""
        db = ""

        resetLoginInputs()
        switchToSignin()

        // ? lets say someone logs in on an account at a library, how to make the logout button remove the data from lets say the cookies
    }
})


function addEventListeners(){
    grab("add-button").addEventListener("click", addNewGig)
}
addEventListeners()