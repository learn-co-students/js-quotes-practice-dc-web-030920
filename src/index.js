document.addEventListener("DOMContentLoaded", () =>{
    fetchQuotes()
    const form = document.getElementById("new-quote-form")
    form.onsubmit = submitForm
})

function fetchQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(quotes => quotes.forEach(renderQuote))
}

function renderQuote(quote){
    const li = document.createElement('li'),
        block = document.createElement('blockquote'),
        p = document.createElement('p'),
        footer = document.createElement('footer'),
        br = document.createElement('br'),
        likeButton = document.createElement('button'),
        deleteButton = document.createElement('button');
        

    document.getElementById('quote-list').appendChild(li)
    li.appendChild(block)
    block.append(p, footer, br, likeButton, deleteButton)
    
    li.className = "quote-card"
    block.className = "blockquote"
    p.className = "bm-0"
    p.innerText = quote.quote
    footer.className = "blockquote-footer"
    footer.innerText = quote.author
    likeButton.className = "btn-success"
    likeButton.innerHTML = `Likes <span>${quote.likes.length}</span>`
    
    likeButton.onclick = () => addLike(quote)
    deleteButton.className = "btn-danger"
    deleteButton.innerText = "Delete"
    deleteButton.onclick = () => deleteQuote(quote.id)

}

function addLike(quote){
    console.log(quote.id)
    const span = event.target.querySelector("span")
    let likes = +span.innerText
    span.innerText = ++likes
    newLike = {
        quoteId: +quote.id,
        createdAt: +new Date
    }
    fetch(`http://localhost:3000/likes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accepts: "application/json"
        },
        body: JSON.stringify(newLike)
    })
    
}

function deleteQuote(id){
    console.log(id)
    event.target.parentNode.parentNode.remove()
    fetch(`http://localhost:3000/quotes/${id}`, {method: "DELETE"})
    
}
function submitForm(event){
    // debugger
    event.preventDefault()
    const quote = this.querySelector('input[name="quote"]').value,
        author = this.querySelector('input[name="author"]').value,
        newQuote={
            quote: quote,
            author: author
        }
    console.log(`${quote} by ${author}`)
    
    fetch(`http://localhost:3000/quotes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accepts: "applicaiton/json"
        },
        body: JSON.stringify(newQuote)
    })
    .then(response => response.json())
    .then(renderQuote)
}