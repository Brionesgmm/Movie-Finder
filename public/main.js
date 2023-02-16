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

backToTopBtn.onclick = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
})
usesrActorName.addEventListener('blur', getActorId)
searchBtnEl.addEventListener('click', getMovies)
rightBtnArrow.addEventListener('click', nextMoviePage)
leftBtnArrow.addEventListener('click', perviousMoviePage)
searchAgainBtn.addEventListener('click', searchAgainReset)

async function getGenres() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=3bd6d50a0681c06a9878c9c95e57ae68&language=en-US`)
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
                selectedGenres.push(button.value)
                console.log(selectedGenres)
            }
        })
    })
}

async function getActorId() {
    actor = usesrActorName.value.toLowerCase().trim().split(' ').join('+')
    console.log(actor)
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=3bd6d50a0681c06a9878c9c95e57ae68&language=en-US&query=${actor}`)
        const data = await response.json()
        if (actor === '') {
            actorId = 0
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
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=1`)
        const data = await response.json()
        console.log(`https://api.themoviedb.org/3/discover/movie?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=1`)
        console.log(data)
        pageTotal = data.total_pages
        moviesInfo = data.results
        console.log(pageTotal)
        console.log(moviesInfo)
        moviesHTML = ''
        removeSearchAndAddArrows()
        showMovies()
    } catch (err) {
        console.log(err)
    }
}

function showMovies() {
    moviesInfo.forEach(el => {
        moviesHTML += `
            <article class='movie'>
                <h1>${el.title}</h1>
                <img src='https://image.tmdb.org/t/p/w500${el.poster_path}' alt='${el.title} movie poster'>
                <p>${el.overview}</p>
            </article>`
    })
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
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=${currentPage}`)
        const data = await response.json()
        console.log(`https://api.themoviedb.org/3/discover/movie?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=1`)
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
            if(pageTotal >= 500){
                currentPage = 500
            }else{
                currentPage = pageTotal
            }
        }
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=${currentPage}`)
        const data = await response.json()
        console.log(`https://api.themoviedb.org/3/discover/movie?api_key=3bd6d50a0681c06a9878c9c95e57ae68&sort_by=popularity.desc&with_genres=${searchGenres}&with_cast=${actorId}&page=${currentPage}`)
        console.log(data)
        moviesInfo = data.results
        moviesHTML = ''
        showMovies()
    } catch (err) {
        console.log(err)
    }
}

function searchAgainReset() {
    searchForm.classList.remove("hidden")
    nextBackArrows.classList.add('hidden')
    searchAgainBtn.classList.add('hidden')
    backToTopBtn.classList.add('hidden')
    moviesSection.innerHTML = ''
    buttons.forEach(button => {
        button.classList.remove('selected')
    })
    selectedGenres = []
    usesrActorName.value = ''
    actor = ''
    actorId = ''
    currentPage = 1
}

getGenres()