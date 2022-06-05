const express = require('express');
const fs = require('fs');
const path = require('path');
const {uuid} = require('uuidv4');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// html routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

// API route
app.get('/api/notes', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    res.json(notes);
});
app.post('/api/notes', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    let newNote = req.body;
    newNote.id = uuid();
    let combineNotes = [...notes, newNote];

    fs.writeFileSync('./db/db.json', JSON.stringify(combineNotes));
    res.json(combineNotes);
})
app.delete('/api/notes/:id', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    let delNote = req.params.id;
    let updatedNotes = [];
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id !== delNote) {
            updatedNotes.push(notes[i]);
        }
    }
    fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes));
    res.json(updatedNotes);
})


app.listen(PORT, () => console.log(`Listening on port ${PORT}`))