let express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');

const uploadDir = path.join(__dirname, 'uploaded');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static(path.join(__dirname, "uploaded")));
app.use(fileUpload());

const port = process.env.PORT || 5000;

app.post('/upload', (req, res) => {
    if (Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.uploadedFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path.join(uploadDir, sampleFile.name), (err) => {
        if (err)
            return res.status(500).send(err);

        res.status(200).json({'ok':true});
    });
});

app.post('/delete', (req, res) => {
    const file = req.body.file;
    fs.unlink(path.join(uploadDir, file), (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({'ok':true});
    });
})

app.get('/files', (req, res) => {
    fs.readdir(uploadDir,  (err, files) => {
        //handling error
        if (err) {
            return res.status(500).send(err);
        }
        //listing all files using forEach
        files.forEach( (file, index) => {
            // Do whatever you want to do with the file
            if(file === '.gitkeep'){
                files.splice(index,1);
            }
        });
        res.status(200).json({files});
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});

module.exports = app;
