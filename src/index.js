var baseUrl = 'http://localhost:3000/quotes'


document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM loaded');
    fetchQuotes();
    const form = document.querySelector('form')
    form.addEventListener('submit', handleForm)

});


function handleForm(e){
    e.preventDefault()

    let quote = e.target.children[0].children[1].value 
    let author = e.target.children[1].children[1].value 

    let quoteObj = {
        quote: e.target.children[0].children[1].value,
        author: e.target.children[1].children[1].value,
        likes: [ ]
    }


    fetch(baseUrl, {
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(quoteObj)
    })
    .then((response) => {
        return response.json()
    })
    .then((quote) => displayQuote(quote))
};


function fetchQuotes(){

    fetch('http://localhost:3000/quotes?_embed=likes')
    .then ((response) => {
        return response.json()
    })
    .then ((quotesArray) => quotesArray.forEach(quote => displayQuote(quote)))
};


function displayQuote(quote){
    const quotesList  = document.getElementById('quote-list')
    const li = document.createElement('li')
    li.className = 'quote-card'
    const blockquote = document.createElement('blockquote')
    blockquote.className = 'blockquote'
    const quoteP = document.createElement('p')
    quoteP.className = `mb-${quote.id}`
    quoteP.innerText = quote.quote
    const quoteFooter = document.createElement('footer')
    quoteFooter.className = 'blockquote-footer'
    quoteFooter.innerText = quote.author
    const br = document.createElement('br')
    const likeBtn = document.createElement('button')
    likeBtn.className = 'btn-success'
    likeBtn.innerHTML =  `Likes: <span>${quote.likes.length}</span>`
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn-danger'
    deleteBtn.innerText = 'Delete'
    quotesList.appendChild(li)
    li.appendChild(blockquote)
    blockquote.append(quoteP, quoteFooter, br, likeBtn, deleteBtn)
    deleteBtn.addEventListener('click', (e) => deleteQuote(e, li))
    likeBtn.addEventListener('click', (e) => addLike(e, quote))
}

function addLike(e, quote){

let span = e.target.children[0]
let quoteLikes = quote.likes

   const id = quote.id
    let likeObj = {
        quoteId: id,
        createdAt: Date.now()
    }

    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(likeObj)
    })

    .then(span.innerText = quoteLikes.length)
   
    
}

function deleteQuote(e, li){

    let id = parseInt(e.target.parentElement.children[0].className.split('-')[1])

    fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {"Content-Type":"application/json"}
    })
    .then( li.remove() )

}

