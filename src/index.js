document.addEventListener("DOMContentLoaded", () => {
    // here we targeted our form
    let form = document.querySelector("#new-quote-form")
    // addEventListener takes in two arguments(<EVENT>, <CALLBACK FUNCTION>)(we calling eventlistener on a formnode)
    form.addEventListener('submit', createQuote)// u add event listener to a node
    fetchQuotes()
    

})//this is saying listen to this event which is DOM and do this which is the function

function fetchQuotes(){
    const url = "http://localhost:3000/quotes?_embed=likes"  
    fetch(url) // GetFetch only takes in one argument Fetch("url") fetch get  is the only one that takes one argument
    .then(response => response.json())
    .then(data => data.forEach(objQuote => renderQuote(objQuote)))
}

function renderQuote(objQuote){
//ul parent

let ul = document.querySelector("#quote-list")
// li card
let li = document.createElement("li")
li.classList.add("quote-card")
// blockquote element
let blockQ = document.createElement("blockquote")
blockQ.classList.add("blockquote")
// p for quote text
let p = document.createElement("p")
p.classList.add("mb-0")
// we're assigning the quote: from objQuote , to the p tag innertext.
p.innerText = objQuote.quote
// footer is for Name of someone famous
let footer = document.createElement("footer")
footer.classList.add("blockquote-footer")
// we're assigning the :author from objQuote, to the footer tag, innertext.
footer.innerText = objQuote.author
// <br>
let br = document.createElement("br")
// button for Likes
let likeBtn = document.createElement("button")
likeBtn.classList.add("btn-success")
likeBtn.innerText = "Likes: "
//span
let span = document.createElement("span")
// span tag has to hold the count of likes a quote has, so to get the count of likes u try in the console objQuote.likes.length
span.innerText = `${objQuote.likes.length}`//we add this line to show the likes we added it at the end
//here we append the span to the like button 
likeBtn.append(span)
// add event listener on likeBtn
likeBtn.addEventListener("click", (event) => likeFunc(event, span))//we bout to write a like function so we came here to add an event listener for it
likeBtn.id = objQuote.id //here we need to like an obj by its id so after building the like function and give it a body the body needs to know what obj should be liked by the id
// likeBtn.onclick = () => likeFunc(event, span)
// button for Delete 
let deleteBtn = document.createElement("button")
deleteBtn.classList.add("btn-danger")
deleteBtn.innerText = "Delete"
deleteBtn.addEventListener("click", deleteQuote)//we added EventListener here cuz we are about to create a delete function and it has to be connected to the deletebtn
deleteBtn.id = objQuote.id// this line added an ID for the delete btn so that the object will pass its id into the button 

// Here we appended (p, footer,br, likebtn, deletebtn) to blockQ
blockQ.append(p, footer, br, likeBtn, deleteBtn)
// Here we appended blockQ to li
li.append(blockQ)
// Here we appended li to ul
ul.append(li)
}

function createQuote(event) {
    // object to pass in into body:
    const obj = {
        quote: event.target.quote.value,// we use the .value only for input tags
        author: event.target.author.value,
        likes: []// everytime u wanna to create a new quote u just put an empty array, so likeBtn dispays likes: 0
    }

    const url = "http://localhost:3000/quotes"
    // fetch POST, takes in two arguments fetch(<URL>, <OBJECT>).then().then()
    fetch(url, {
        method: "POST",
        headers: {'Content-Type': "application/json",
                "Accept": "application/json"
    },
        body: JSON.stringify(obj)
    }) 
    // .then(response => response.json())
    // .then(newQuote => renderQuote(newQuote))// we used the renderQuote function to help render the new quote we created with the fetch POST
 
    renderQuote(obj)
    // e.stopImmediatePropagation()
    }   


function deleteQuote(event){// carla made this function  she passesd an id up top so this function will know what to delete by the id(look at deletebtn)
    // First we delete the quote in the server
    event.preventDefault()
    let objId = event.currentTarget.id
    const url = `http://localhost:3000/quotes/${objId}`
    fetch(url, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {document.getElementById(objId).remove()})
   
    // Second we delete the quote in the DOM
}

function likeFunc(event, span){// the span was added here like above to cuz span has the like so we gotta target it 
event.preventDefault()
let id = event.currentTarget.id //this id is how we can get the obj id same we did in the likeBtn up top
let like = parseInt(span.innerText)
++like// to increment

span.innerText = like // then update what s inside the span everytime we give it a like
const objLike = {//we create the object that we gonna pass in for the body donw in this function
     quoteId: parseInt(id), // so wanna pass in the id as an integer, and the + is to parseIn
     createdAt: +new Date// this is for the bonus 
}

const url = "http://localhost:3000/likes"
//fetch POST takes in two arguments fetch(<url>, <object>)
fetch(url, {                                            
    method: "POST",
    headers: {'Content-Type': "application/json"},     
    body: JSON.stringify(objLike)//the body takes in an object so we have to create an object for it and it s gonna be a like object(to know we u get here make sure u create an id fo the like or the delete which ever u working on)
})

}











