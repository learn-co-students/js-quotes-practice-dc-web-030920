document.addEventListener('DOMContentLoaded', function(){
    fetchQuotes()
    formNode = document.querySelector('#new-quote-form')
    formNode.addEventListener('submit', handleForm)
})

function handleForm(event) {
    event.preventDefault()
    const quote = document.querySelector('#new-quote').value
    const author = document.querySelector('#author').value
    const object = {
        "quote": quote,
        "author": author,
        "likes": []
    }
    fetch('http://localhost:3000/quotes?_embed=likes', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(object)
    }).then(response => response.json())
    .then(quote => displayQuote(quote))
    event.target.reset()
}

function fetchQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotesArray => quotesArray.forEach(quote => displayQuote(quote)))
}

function displayQuote(quote) {
    const ulNode = document.querySelector('#quote-list')
    liNode = document.createElement('li')
    liNode.className = 'quote-card'
    const blockNode = document.createElement('blockquote')
    blockNode.className = 'blockquote'
    const quoteNode = document.createElement('p')
    quoteNode.innerText = quote.quote
    quoteNode.className = "mb-0"
    const authorNode = document.createElement('footer')
    authorNode.innerText = quote.author
    authorNode.className = "blockquote-footer"
    const brNode = document.createElement('br')
    const likeNode = document.createElement('button')
    likeNode.addEventListener('click', () => addLike(event, quote))
    likeNode.className = 'btn-success'
    likeNode.innerText = "Likes: "
    const likeNum = document.createElement('span')
    likeNum.innerText = quote.likes.length
    likeNode.append(likeNum)
    const deleteNode = document.createElement('button')
    deleteNode.className = 'btn-danger'
    deleteNode.innerText = "Delete"
    deleteNode.addEventListener('click', () => deleteQuote(event, quote))
    ulNode.append(liNode)
    liNode.append(blockNode)
    blockNode.append(quoteNode, authorNode, brNode, likeNode, deleteNode)
}

function deleteQuote(event, quote){
    id = quote.id 
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "DELETE"
    })
    const div = event.target.parentElement
    const li = div.parentElement
    li.remove()
}

function addLike(event, quote){
    const blockNode = event.target.parentNode 
    const id = quote.id 
    fetch(`http://localhost:3000/likes`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"quoteId": id})
    }).then(response => response.json())
    .then(like=> newLike(blockNode))
}

function newLike(blockNode) {
    likeNode = blockNode.querySelector('span')
    const num = Number(blockNode.querySelector('span').innerText) + 1 
    likeNode.innerText = num 
}
