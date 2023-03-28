
const express = require('express')
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser')
const { Client } = require('pg')
let url = `postgres://postgres:12345@localhost:5432/movies`;
const client = new Client(url)
const moviesData= require('./data.json')
const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const port = 3000



//home page
app.get('/', moviesDataHandler) ;
app.get('/favorite', favoriteHandler) ;
app.get('*', notFoundHandler) ;
app.post('/addMovie', addMovieHandler) ;
app.get('/getMovies', getMoviesHandler);
app.put('/updateMovies/:id',handleUpdate);
app.delete('/deleteMovies/:id', handleDelete);
app.put('/getSpecificMovie/:id', getSpecificMovieHandler)


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
    console.log(req.body);
    let {id, title, personalComments} = req.body;
    let sql = `INSERT INTO movies (id, title, personalComments)
    VALUES ($1,$2,$3) RETURNING *; `
    let values = [id, title, personalComments]
    client.query(sql,values).then((result)=>{
        console.log(result.rows)
        res.status(200).json(result.rows)
    }

    ).catch((err)=>{
        errorHandler(err,req,res);
    })
    
}


function getMoviesHandler(req,res) {
    let sql =`SELECT * FROM movies;`;
    client.query(sql).then((result)=>{
        console.log(result);
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
        console.log(result.rows);
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
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows)
    }).catch((err)=>{
        errorHandler(err,req,res)
    })
}

//constructor
function Movies(title, poster_path, overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}

client.connect().then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
}).catch()
