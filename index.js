
const express = require('express')
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const bodyParser = require('body-parser')
const { Client } = new require('pg')
const url = process.env.URL
const client = new Client(url)
const moviesData= require('./data.json')
const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const port = process.env.PORT;
const my_key= process.env.MY_KEY;



//home page
app.get('/', moviesDataHandler) ;
app.get('/favorite', favoriteHandler) ;
app.post('/addMovie', addMovieHandler) ;
app.get('/getMovies', getMoviesHandler);
app.put('/updateMovies/:id',handleUpdate);
app.delete('/deleteMovies/:id', handleDelete);
app.get('/getSpecificMovie/:id', getSpecificMovieHandler);
app.get('/trending', trendingHandler);
app.get('/search', searchHandler);
app.get('/certification', certificationHandler);
app.get('/popular', popularHandler);
app.get('*', notFoundHandler) ;


//Handler
function moviesDataHandler(req,res){
    let newMovie = new Movies(moviesData.title, moviesData.poster_path, moviesData.overview);
    res.json(newMovie);
}

function favoriteHandler(req,res){
    res.json("Welcome to Favorite Page");
}

function notFoundHandler(req,res){
    res.status(404).send("page not found error")
    
}

function addMovieHandler(req,res){
    let {title, personalComments} = req.body;
    let sql = `INSERT INTO movies (title, personalComments)
    VALUES ($1,$2) RETURNING *; `
    let values = [title, personalComments]
    client.query(sql,values).then((result)=>{
        res.status(200).json(result.rows)
    }

    ).catch((err)=>{
        errorHandler(err,req,res);
    })
    
}


function getMoviesHandler(req,res) {
    let sql =`SELECT * FROM movies;`;
    client.query(sql).then((result)=>{
        res.json(result.rows)
    }).catch((err)=>{
        errorHandler(err,req,res)
    })
}

function errorHandler(error,req,res){
    res.status(500).send(error)
}

function handleUpdate(req,res){
    let moviesId = req.params.id;
    let {personalComments} = req.body;
    let sql=`UPDATE movies SET personalComments = $1 
    WHERE id = $2 RETURNING *;`;
    let values = [personalComments,moviesId];
    client.query(sql,values).then(result=>{
        res.send(result.rows)
    }).catch()

}

function handleDelete(req,res){
    let {id} = req.params;
    let sql=`DELETE FROM movies WHERE id = $1;` ;
    let value = [id];
    client.query(sql,value).then(result=>{
        res.status(204).send("deleted");
    }).catch()
}

function getSpecificMovieHandler(req,res) {
    let {id} = req.params;
    let sql =`SELECT * FROM movies WHERE id = $1;`;
    let value = [id];
    client.query(sql, value).then((result)=>{
        res.json(result.rows)
    }).catch((err)=>{
        errorHandler(err,req,res)
    })
}

function trendingHandler(req, res){
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${my_key}&language=en-US`;
    axios.get(url)
    .then((result)=>{
         let trendDataForMovie = result.data.results.map((movies)=>{
             return new trendMovie(movies.id, movies.title, movies.release_date, movies.poster_path , movies.overview);
         })
    
         res.json(trendDataForMovie);
    })
    .catch((err)=>{
        console.log(err);
    })
}

function searchHandler(req, res){
    let movieName = req.query.title;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${my_key}&query=${movieName}`;
    axios.get(url)
    .then((result)=>{
         let requestedMovie = result.data.results.map((movies)=>{
             return new trendMovie(movies.id, movies.title, movies.release_date, movies.poster_path , movies.overview);
         })
         res.json(requestedMovie);
    })
    .catch((err)=>{
        console.log(err);
    })
}

function certificationHandler(req, res){
    let url = `https://api.themoviedb.org/3/certification/movie/list?api_key=${my_key}`;
    axios.get(url)
    .then((result)=>{
         let movieCertification = result.data.certifications.AU.map((certif)=>{
             return new Certification(certif.certification, certif.meaning, certif.order);
         })
    
         res.json(movieCertification);
    })
    .catch((err)=>{
        console.log(err);
    })
}

function popularHandler(req, res){
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${my_key}&language=en-US&page=1`;
    axios.get(url)
    .then((result)=>{
         let popularMovies = result.data.results.map((movies)=>{
             return new PopularMovie(movies.id, movies.title, movies.popularity);
         })
    
         res.json(popularMovies);
    })
    .catch((err)=>{
        console.log(err);
    })
}

//constructor
function Movies(title, poster_path, overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}

function trendMovie(id, title, release_date, poster_path, overview){
    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;
}

function Certification(certification, meaning, order){
    this.certification=certification;
    this.meaning=meaning;
    this.order=order;
}

function PopularMovie(id, title, popularity){
    this.id=id;
    this.title=title;
    this.popularity=popularity;
}

client.connect().then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
}).catch()
