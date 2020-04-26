document.addEventListener("DOMContentLoaded", () =>{
    fetchQuotes()
    const form = document.getElementById("new-quote-form")
    form.onsubmit = submitForm
})

function fetchQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(quotes => quotes.forEach(quote => {
        let likes = quote.likes.length
        renderQuote(quote, likes)}))
}

function renderQuote(quote, likes){
    const li = document.createElement('li'),
        block = document.createElement('blockquote'),
        p = document.createElement('p'),
        footer = document.createElement('footer'),
        br = document.createElement('br'),
        likeButton = document.createElement('button'),
        deleteButton = document.createElement('button'),
        pEditForm = document.createElement('form'),
        pInput = document.createElement('textarea'),
        editButton = document.createElement('button');
        

    document.getElementById('quote-list').appendChild(li)
    li.appendChild(block)
    block.append(p, pEditForm, footer, br, likeButton, deleteButton)
    
    li.className = "quote-card"
    block.className = "blockquote"
    p.className = "bm-0"
    p.innerText = quote.quote
    p.onclick = () => editQuote(p, pEditForm, pInput, quote.id)
    pEditForm.append(pInput, editButton)
    pEditForm.hidden=true
    pInput.rows = "3"
    pInput.cols = "100"
    editButton.innerText = "Edit"
    editButton.type = "submit"
    
    footer.className = "blockquote-footer"
    footer.innerText = quote.author
    likeButton.className = "btn-success"
    likeButton.innerHTML = `Likes <span>${likes}</span>`
    
    likeButton.onclick = () => addLike(event, quote)
    deleteButton.className = "btn-danger"
    deleteButton.innerText = "Delete"
    deleteButton.onclick = () => deleteQuote(quote.id)

}
function submitEdit(event, form, input, p, id){
    
    event.preventDefault()
    
    form.hidden = true
    p.hidden = false
    edit = {
        quote: input.value
    }
   
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accepts: "application/json"
        },
        body: JSON.stringify(edit)
    }).then(p.innerText = input.value)
}
function editQuote(p, form, input, id){
    
   
    p.hidden = true
    form.hidden = false
    input.value = p.innerText
    form.onsubmit = () => submitEdit(event, form, input, p, id)
}

function addLike(event, quote){
  
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
    
    event.preventDefault()
    const quote = this.querySelector('input[name="quote"]').value,
        author = this.querySelector('input[name="author"]').value,
        newQuote={
            quote: quote,
            author: author
        }
    
    
    fetch(`http://localhost:3000/quotes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accepts: "applicaiton/json"
        },
        body: JSON.stringify(newQuote)
    })
    .then(response => response.json())
    .then(quote => {
        let likes = 0
        renderQuote(quote, likes)})
}