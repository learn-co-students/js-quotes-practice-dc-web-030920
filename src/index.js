// Populate page with quotes with a GET request to http://localhost:3000/quotes?_embed=likes. 
// The query string in this URL tells json-server to include the likes for a quote in the JSON of the response. You should not use this query string when creating or deleting a quote.

document.addEventListener("DOMContentLoaded", () => {
    console.log("Hello")
    fetchQuotes()
    const form = document.getElementById("new-quote-form")
    form.onsubmit = handleForm
    
})

function fetchQuotes() {
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(quotesArray => quotesArray.forEach(renderQuotes))
}

function renderQuotes(q) {
    const ul = document.getElementById("quote-list")
    const li = document.createElement("li")
    li.className = "quote-card"
    const blockquote = document.createElement("blockquote")
    blockquote.className = "blockquote"
    const p = document.createElement("p")
    p.className = "mb-0"
    p.innerText = q.quote
    const footer = document.createElement("footer")
    footer.className = "blockquote-footer"
    footer.innerText = q.author
    const br = document.createElement("br")
    const likeButton = document.createElement("button")
    likeButton.innerText = "Likes: "
    likeButton.className = "btn-success"
    const span = document.createElement("span")
    span.innerText = q.likes.length
    const deleteButton = document.createElement("button")
    deleteButton.innerText = "Delete "
    deleteButton.className = "btn-danger"
    
    ul.appendChild(li)
    li.appendChild(blockquote)
    likeButton.appendChild(span)
    blockquote.append(p, footer, br, likeButton, deleteButton)

    deleteButton.onclick = () => deleteQuote(q.id)
    likeButton.onclick = () => addLike(event, q.id)
}

// Submitting the form creates a new quote and adds it to the list of quotes without having to refresh the page. Pessimistic rendering is reccommended.

function handleForm(event) {
    event.preventDefault()
    const inputQ = document.getElementById("new-quote").value
    const inputA = document.getElementById("author").value
    
    const obj = {
        quote: inputQ,
        author: inputA,
        likes: []
    }

    fetch("http://localhost:3000/quotes?_embed=likes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accepts: "application/json"
        },
        body: JSON.stringify(obj)
        }).then(resp => resp.json())
        .then(q => {renderQuotes(q)})

}

// Clicking the delete button should delete the respective quote from the API and remove it from the page without having to refresh.

function deleteQuote(id) {
    const quoteBlock = event.target.parentElement
    const li = quoteBlock.parentElement
    li.remove()
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "DELETE"
    })

}

// Clicking the like button will create a like for this particular quote in the API and update the number of likes displayed on the page without having to refresh.

function addLike(event, id) {
    console.log("Like")
    const span = event.target.parentElement.querySelector("span")
    // Use a POST request to http://localhost:3000/likes
    const obj = {
        quoteId: id
    }
    fetch("http://localhost:3000/likes", {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(obj)
    }).then(resp => resp.json())
    .then(++span.innerText)
}
