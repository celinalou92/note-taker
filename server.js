// --------------------------------- Dependencies ---------------------------------//
const { query } = require('express');
const express = require('express');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3001;

const fs = require('fs');

// -------------------------------- Middleware -------------------------------- //
// public folder readily available no request needed
app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());




// ----------------- Functions --------------------------------//

function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if(query.title) {
        filteredResults = filteredResults.filter(note => note.title === query.title);
    };
    // TODO: add another if statement to query by id?
    return filteredResults;
}





// ---------------------------------- HTML Routes ---------------------------------- //

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/notes.html'));
});




// ---------------------------------- API Routes ---------------------------------- //


app.get('/api/notes', (req, res) => {
    // read db.json file and return saved notes as JSON
    fs.readFile(path.join(__dirname,'./db/db.json'), (err, data) => {
        if(err) {
            res.status(500);
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    // receive a new note to save on the req body give it unique id
    let id = Math.floor(Math.random() * 10000);
    let note  = req.body;
    note.id = id;
    // add it to db.json
    fs.readFile(path.join(__dirname,'./db/db.json'), (err, data) => {
        if(err){
            res.status(500);
        }
        let savedNotes = JSON.parse(data);
        savedNotes.push(note);

        fs.writeFile(path.join(__dirname,'./db/db.json'), JSON.stringify(savedNotes), (err) => {
            if(err) {
                res.status(500);
            }
            // return the new note to client
            res.json(note);
        })
    });
})

app.delete('/api/notes/:id', (req,res) => {
    let id = req.params;
    fs.readFile(path.join(__dirname,'./db/db.json'), (err, data) => {
        if(err) {
            console.log(`error here`)
            res.status(500);
            
        }
        let savedNotes = JSON.parse(data);
        let editedNotes = savedNotes.filter( (data) => {
            console.log(`NOTE ${data}`)
            return data.id !== id;
        });
// ------ not working!! ------ //
        fs.writeFile(path.join(__dirname,'./db/db.json'), JSON.stringify(editedNotes), (err) => {
            if(err) {
                res.status(500);
            }
            console.log(editedNotes)
            res.json(`end`);
        })
    })
})

// ---------------------------------- END API Routes ---------------------------------- //


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
});




// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column