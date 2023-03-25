
const express = require('express')
const moviesData= require('./data.json')
const app = express()
const port = 3000



//home page
app.get('/', moviesDataHandler) ;
 
function moviesDataHandler(req,res){
    let newMovie = new Movies(moviesData.title, moviesData.poster_path, moviesData.overview);
    res.json(newMovie);
}


//favorite page 
app.get('/favorite', favoriteHandler) ;

function favoriteHandler(req,res){
    res.json("Welcome to Favorite Page");
}

//status 404 
app.get('*', notFoundHandler) ;

function notFoundHandler(req,res){
    res.status(404).send("page not found error")

}


//constructor
function Movies(title, poster_path, overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

