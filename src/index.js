
document.addEventListener("DOMContentLoaded", ()=> {
    

    fetchQuotes()
    const form = document.getElementById("new-quote-form")
    form.addEventListener("submit",  createQuote)
})

function fetchQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(quotesArr => quotesArr.forEach(data => renderQuote(data)))
}

function renderQuote(data){
    // add Li
    
    const newLi = document.createElement("li")
    newLi.classList.add("quote-card")
    // add blockquote
    const blockQuote = document.createElement("blockquote")
    blockQuote.classList.add("blockquote")
    // add p
    const p = document.createElement("p")
    p.classList.add("mb-0")
    p.innerText = data.quote
    // add textArea
    const textA = document.createElement("textarea")
    textA.hidden = true
    // add footer
    const footer = document.createElement("footer")
    footer.classList.add("blockquote-footer")
    footer.innerText = data.author
    // add br
    const br = document.createElement("br")
    // add Like Btn
    const likeBtn = document.createElement("button")
    likeBtn.addEventListener("click", () => addLike(data.id, span))
    likeBtn.classList.add("btn-success")
    likeBtn.innerText = "Likes: "
    // add span
    const span = document.createElement("span")
    if (!data.likes){// if the quote has no likes it will show 0 likes or no likes 
        span.innerText = 0
    } else {
        span.innerText = data.likes.length // if i has like it will show the likes length
    }
    // append span to likeBtn
    likeBtn.append(span)
    // add Edit Btn
    const editBtn = document.createElement("button")
    editBtn.addEventListener("click", () => editQuote(p, textA, footer, blockQuote, data))
    editBtn.classList.add("btn-primary")
    editBtn.innerText = "Edit"

    // add Delete Btn
    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("btn-danger")
    deleteBtn.innerText = "Delete"
    deleteBtn.addEventListener("click", () => deleteQuote(data.id, newLi))
    
    // append p,textA, footer,br,button,button,button to blockquote
    blockQuote.append(p, textA, footer, br, likeBtn, editBtn, deleteBtn)
    // append blockquote to newLi
    newLi.append(blockQuote)
    // append newLi to ul 
    const ul = document.getElementById('quote-list')
    ul.append(newLi)
}

function createQuote(e){
    e.preventDefault()
    
    const quoteInp = e.currentTarget.quote.value
    const authorInp = e.currentTarget.author.value
   
   
    // fetch post
    
    obj = {
        quote: quoteInp,
        author: authorInp,
    }

    const url ="http://localhost:3000/quotes"
    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(obj)
    })
    .then(renderQuote(obj))
}

function deleteQuote(quoteId, newLi){
    const url = `http://localhost:3000/quotes/${quoteId}`
   
    fetch(url, {
        method: "DELETE"
    }).then(newLi.remove()) // Instead of targeting the li that holds the quote card with event.target.id,etc ; we pass in the newLi from line 51, and we just remove it in this line
   
}

function addLike(quoteId, span){
    // post fetch to add a new like to the server
   
    const url = "http://localhost:3000/likes"
    const like = {
        quoteId: quoteId,
        createdAt: +new Date
    }
    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(like)
    })
    .then(resp => resp.json())
    .then(span.innerText = parseInt(span.innerText ) + 1)// now render the new like on the DOM

    
    
   
}


function editQuote(p, textA, footer, blockQuote, quote){
    textA.style.width = `600px`
    textA.hidden = false
    textA.innerText = p.innerText
    p.hidden = true
 
    textA.addEventListener('keypress', function (e) {
        if (e.keyCode === 13) { // if key pressed is 'enter'
           fetch(`http://localhost:3000/quotes/${quote.id}`, { // do a fetch patch 
               method: "PATCH",
               headers: {"Content-Type": "application/json"},
               body: JSON.stringify({quote: textA.value})
           }).then(response => {
               textA.hidden = true
               p.hidden = false
               p.innerText = textA.value
           })
        }
    }, false); // I don't know what this is


}
