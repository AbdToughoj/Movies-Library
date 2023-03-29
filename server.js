
const express = require('express')
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser')
const { Client } = new require('pg')
const client = new Client(process.env.URL)
const moviesData= require('./data.json')
const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const port = process.env.port;



//home page
app.get('/', moviesDataHandler) ;
app.get('/favorite', favoriteHandler) ;
app.post('/addMovie', addMovieHandler) ;
app.get('/getMovies', getMoviesHandler);
app.put('/updateMovies/:id',handleUpdate);
app.delete('/deleteMovies/:id', handleDelete);
app.get('/getSpecificMovie/:id', getSpecificMovieHandler)
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
