const quoteList = document.querySelector('#quote-list')

loadQuotes()

function loadQuotes(){
    
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(res => {
        quoteList.innerHTML = ""
        res.forEach(quote => addQuote(quote))
    })
}

function addQuote(quote) {

    const blockQuote = document.createElement('blockquote')

    let li = document.createElement('li')
    li.class = 'quote-card'
    
    let p = document.createElement('p')
    p.class = "mb-0"
    p.innerText = quote.quote

    let footer = document.createElement('footer')
    footer.class = "blockquote-footer"
    footer.innerText = quote.author
    
    let button1 = document.createElement('button')
    button1.className = 'btn-success'
    button1.innerHTML = `Likes: <span>${quote.likes.length}</span> `

    button1.addEventListener("click", function(){
        let configObj = {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quoteId: parseInt(quote.id, 10),
                createdAt: Date.now()
            })
            
        }
        fetch("http://localhost:3000/likes", configObj)
        .then(res => res.json())
        .then(loadQuotes())
    })

    let button2 = document.createElement('button')
    button2.className = "btn-danger"
    button2.innerText = "Delete"
    button2.addEventListener('click', () =>{
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: 'DELETE',
        }).then(li.remove())
    })

    blockQuote.append(p, footer, button1, button2)
    li.append(blockQuote)
    quoteList.append(li)
}

const form = document.querySelector('#new-quote-form')

form.addEventListener('submit', (event) => {
    event.preventDefault
    postQuote(event)
})

function postQuote(event){
    fetch("http://localhost:3000/quotes", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify ({
            "quote": event.target.quote.value,
            "author": event.target.author.value
        })
    })
    .then(response => response.json())
    .then(quoteObj => addQuote(quoteObj))
}
