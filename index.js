const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
    fs.readdir('./files', (err, files) => {
        if (err) {
            console.error("Error reading files:", err);
        } else {
            console.log("Files in ./files:", files); // 🔹 Will show in terminal
        }
        res.render("index", {files: files }); // Move render here to ensure async completes first
    });
});

app.get('/files/:filename', function(req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
    res.render('show', { filename: req.params.filename, filedata: filedata });

  })
})

app.get('/edit/:filename', function (req, res) {
    res.render("edit", {filename: req.params.filename})
})

app.post('/edit', (req, res) => {
    if(req.body.new) {
        fs.rename(`./files/${req.body.pre}`, `./files/${req.body.new}` , function (err) {
        res.redirect('/')
    })
    }
})

app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.description, function (res, err) {
        res.redirect('/')
    })
})
app.listen(3000, () => {
    console.log("Server running on port 3000"); });
