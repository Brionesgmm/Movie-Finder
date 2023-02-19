const genresSection = document.querySelector('.genres')
const usesrActorName = document.querySelector('#actorName')
const searchForm = document.querySelector('form')
const searchBtnEl = document.querySelector('.searchBtn')
const bodyEl = document.querySelector('body')
const moviesSection = document.querySelector('.allMovies')
const nextBackArrows = document.querySelector('.pageButtons')
const backToTopBtn = document.getElementById("back-to-top")
const leftBtnArrow = document.querySelector('.left-btn')
const rightBtnArrow = document.querySelector('.right-btn')
const searchAgainBtn = document.querySelector('.search-again')
const displayUserInputsSection = document.querySelector('.displayUserInputs')
const tvPickBtn = document.querySelector('.tvButton')
const moviePickBtn = document.querySelector('.movieButton')
const actorsSuggestionsList = document.querySelector('.actorsSuggestions')
const tvMovieAreaSection = document.querySelector('.tvMovieArea')
const tvMovieChoiceArea = document.querySelector('.pickTvMovie')
const usesrActorNameLabel = document.querySelector('label')
const backToMovieTvSelectionArea = document.querySelector('.backToTVMovieChoice')

let buttons
let genresArray = []
let selectedGenres = []
let buttonHTML = ''
let actor = ''
let actorId = ''
let pageTotal = 0
let moviesInfo = []
let moviesHTML = ''
let currentPage = 1
let searchGenres
let actorNameDisplay = ''
let genresUserInputs = []
let mediaType = 'movie'

usesrActorName.addEventListener("input", (event) => {
    const inputText = usesrActorName.value.toLowerCase();
    const filteredActors = actorName.filter(actor => actor.toLowerCase().includes(inputText));
    actorsSuggestionsList.innerHTML = '';
    filteredActors.forEach(actor => {
        const li = document.createElement('li');
        li.textContent = actor;
        li.addEventListener('click', () => {
            usesrActorName.value = actor;
            actorsSuggestionsList.innerHTML = '';
        });
        actorsSuggestionsList.appendChild(li);
    });
});

document.addEventListener('click', (event) => {
    if (event.target !== usesrActorName) {
        actorsSuggestionsList.innerHTML = '';
    }
})

tvPickBtn.addEventListener('click', e => {
    tvMovieChoiceArea.classList.add("hidden")
    mediaType = 'tv'
    buttonHTML = ''
    genresSection.innerHTML = ''
    tvMovieAreaSection.classList.remove('hidden')
    usesrActorName.classList.add('hidden')
    usesrActorNameLabel.classList.add('hidden')
    getGenres()
})

moviePickBtn.addEventListener('click', e => {
    tvMovieChoiceArea.classList.add("hidden")
    mediaType = 'movie'
    buttonHTML = ''
    genresSection.innerHTML = ''
    tvMovieAreaSection.classList.remove('hidden')
    usesrActorName.classList.remove('hidden')
    usesrActorNameLabel.classList.remove('hidden')
    getGenres()
})

backToMovieTvSelectionArea.addEventListener('click', e => {
    tvMovieChoiceArea.classList.remove("hidden")
    tvMovieAreaSection.classList.add("hidden")
    selectedGenres = []
    genresUserInputs = []
})

backToTopBtn.onclick = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
})

usesrActorName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
})
usesrActorName.addEventListener('blur', getActorId)
searchBtnEl.addEventListener('click', async e => {
    await getActorId()
    getMovies()
})
rightBtnArrow.addEventListener('click', nextMoviePage)
leftBtnArrow.addEventListener('click', perviousMoviePage)
searchAgainBtn.addEventListener('click', searchAgainReset)

async function getGenres() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/${mediaType}/list?api_key=3bd6d50a0681c06a9878c9c95e57ae68&language=en-US`)
        const data = await response.json()
        genresArray = data.genres
        console.log(genresArray)
        getButtons()
    } catch (err) {
        console.log(err)
    }
}

function getButtons() {
    genresArray.forEach((el) => {
        buttonHTML += `<button type='button' class='genre' value='${el.id}'>${el.name}</button>`
    })
    genresSection.innerHTML = buttonHTML
    checkSelectedButtons()
}

function checkSelectedButtons() {
    buttons = document.querySelectorAll('.genre')
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.classList.contains('selected')) {
                button.classList.remove('selected')
                const index = selectedGenres.indexOf(button.value);
                if (index > -1) {
                    selectedGenres.splice(index, 1)
                }
                console.log(selectedGenres)
            } else {
                button.classList.add('selected')
                genresUserInputs.push(button.textContent)
                selectedGenres.push(button.value)
                console.log(selectedGenres)
            }
        })
    })
}

async function getActorId() {
    actor = usesrActorName.value.toLowerCase().trim().split(' ').join('+')
    actorNameDisplay = usesrActorName.value.toLowerCase().split(' ').map(el => {
        return el.charAt(0).toUpperCase() + el.slice(1)
    }).join(' ')
    console.log(actorNameDisplay)
    console.log(actor)
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=3bd6d50a0681c06a9878c9c95e57ae68&language=en-US&query=${actor}`)
        const data = await response.json()
        if (actor === '') {
            actorId = ''
        } else {
            actorId = data.results[0].id
        }
        console.log(data)
        console.log(actorId)
    } catch (err) {
        console.log(err)
    }
}

async function getMovies() {
    searchGenres = selectedGenres.map(el => {
        return `${el}|`
    }).join('')
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/${mediaType}?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=1`)
        const data = await response.json()
        console.log(`https://api.themoviedb.org/3/discover/${mediaType}?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=1`)
        console.log(response)
        console.log(data)
        pageTotal = data.total_pages
        moviesInfo = data.results
        console.log(pageTotal)
        console.log(moviesInfo)
        moviesHTML = ''
        backToMovieTvSelectionArea.classList.add('hidden')
        showUserInputs()
        removeSearchAndAddArrows()
        showMovies()
    } catch (err) {
        console.log(err)
    }
}

function showMovies() {
    if (mediaType === 'movie') {
        moviesInfo.forEach(el => {
            moviesHTML += `
                <article class='movie'>
                    <h1>${el.title}</h1>
                    <img src='https://image.tmdb.org/t/p/w500${el.poster_path}' alt='${el.title} movie poster'>
                    <p>${el.overview}</p>
                </article>`
        })
    } else {
        moviesInfo.forEach(el => {
            moviesHTML += `
                <article class='movie'>
                    <h1>${el.name}</h1>
                    <img src='https://image.tmdb.org/t/p/w500${el.poster_path}' alt='${el.name} movie poster'>
                    <p>${el.overview}</p>
                </article>`
        })
    }
    moviesSection.innerHTML = moviesHTML
}

function removeSearchAndAddArrows() {
    searchForm.classList.add("hidden")
    nextBackArrows.classList.remove('hidden')
    searchAgainBtn.classList.remove('hidden')
    backToTopBtn.classList.remove('hidden')
}

async function nextMoviePage() {
    try {
        if (currentPage >= 500) {
            currentPage = 0
        }
        currentPage++
        if (currentPage > pageTotal) {
            currentPage = 1
        }
        const response = await fetch(`https://api.themoviedb.org/3/discover/${mediaType}?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=${currentPage}`)
        const data = await response.json()
        console.log(`https://api.themoviedb.org/3/discover/${mediaType}?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=1`)
        console.log(data)
        moviesInfo = data.results
        moviesHTML = ''
        showMovies()
    } catch (err) {
        console.log(err)
    }
}

async function perviousMoviePage() {
    try {
        currentPage--
        if (pageTotal === 1) {
            currentPage = 1
        } else if (currentPage < 1) {
            if (pageTotal >= 500) {
                currentPage = 500
            } else {
                currentPage = pageTotal
            }
        }
        const response = await fetch(`https://api.themoviedb.org/3/discover/${mediaType}?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=${currentPage}`)
        const data = await response.json()
        console.log(`https://api.themoviedb.org/3/discover/${mediaType}?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=${currentPage}`)
        console.log(data)
        moviesInfo = data.results
        moviesHTML = ''
        showMovies()
    } catch (err) {
        console.log(err)
    }
}

function showUserInputs() {
    displayUserInputsSection.classList.remove('hidden')
    let genresUserInputsHTML = ''
    console.log(genresUserInputs)
    genresUserInputs.forEach(el => {
        console.log(el)
        genresUserInputsHTML += `${genresUserInputs.indexOf(el) !== genresUserInputs.length - 1 ? `${el}/ `: `${el}`}`
    })
    displayUserInputsSection.innerHTML = `
    <h1>${actorNameDisplay}</h2>
    <h2>${genresUserInputsHTML}</h2>
    `
}

function searchAgainReset() {
    searchForm.classList.remove("hidden")
    nextBackArrows.classList.add('hidden')
    searchAgainBtn.classList.add('hidden')
    backToTopBtn.classList.add('hidden')
    displayUserInputsSection.classList.add('hidden')
    moviesSection.innerHTML = ''
    buttons.forEach(button => {
        button.classList.remove('selected')
    })
    selectedGenres = []
    usesrActorName.value = ''
    actor = ''
    actorId = ''
    currentPage = 1
    displayUserInputsSection.innerHTML = ''
    genresUserInputs = []
    backToMovieTvSelectionArea.classList.remove('hidden')
}



getGenres()

const actorName = [
    "Adam Sandler",
    "Aishwarya Rai Bachchan",
    "Angelina Jolie",
    "Anne Hathaway",
    "Anthony Hopkins",
    "Arnold Schwarzenegger",
    "Ben Affleck",
    "Brad Pitt",
    "Cameron Diaz",
    "Cate Blanchett",
    "Charlize Theron",
    "Chris Evans",
    "Chris Hemsworth",
    "Chris Pratt",
    "Christian Bale",
    "Dakota Johnson",
    "Denzel Washington",
    "Dwayne Johnson",
    "Emma Stone",
    "Emma Watson",
    "Gal Gadot",
    "George Clooney",
    "Harrison Ford",
    "Hugh Jackman",
    "Jack Nicholson",
    "Jackie Chan",
    "Jake Gyllenhaal",
    "Javier Bardem",
    "Jennifer Aniston",
    "Jennifer Lawrence",
    "Jessica Alba",
    "Jim Carrey",
    "Joan Crawford",
    "John Travolta",
    "Johnny Depp",
    "Judi Dench",
    "Julia Roberts",
    "Kate Winslet",
    "Keanu Reeves",
    "Kevin Hart",
    "Kevin James",
    "Keira Knightley",
    "Kevin Costner",
    "Leonardo DiCaprio",
    "Liam Neeson",
    "Marilyn Monroe",
    "Mark Wahlberg",
    "Matt Damon",
    "Matthew McConaughey",
    "Meryl Streep",
    "Michael Caine",
    "Mila Kunis",
    "Morgan Freeman",
    "Natalie Portman",
    "Nicole Kidman",
    "Owen Wilson",
    "Penélope Cruz",
    "Peter Sellers",
    "Rachel McAdams",
    "Reese Witherspoon",
    "Robert De Niro",
    "Robert Downey Jr.",
    "Robin Williams",
    "Russell Crowe",
    "Ryan Gosling",
    "Ryan Reynolds",
    "Samuel L. Jackson",
    "Scarlett Johansson",
    "Sean Connery",
    "Shah Rukh Khan",
    "Sophia Loren",
    "Steve Carell",
    "Sylvester Stallone",
    "Tim Allen",
    "Tom Cruise",
    "Tom Hanks",
    "Tom Hardy",
    "Uma Thurman",
    "Viola Davis",
    "Will Ferrell",
    "Will Smith",
    "Woody Allen",
    "Zac Efron",
    "Zoe Saldana"
]