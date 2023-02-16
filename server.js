const express = require('express')
const app = express()
const PORT = 8000

app.use(express.static('public'))

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})