const express = require("express");
const app = express();
const multer = require("multer");
const docxToPdf = require("docx-pdf");
const path = require("path");
const cors = require("cors");
const port = 3000;

app.use(cors());

//setting up the file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });
app.post('/convert', upload.single('file'), (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        //Defining output file path
        let outputPath = path.join(__dirname,"files",`${req.file.originalname}.pdf`);
        docxToPdf(req.file.path, outputPath,  (err, result)=> {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message:"Some internal Error in converting docx to pdf"
                });
            }
            res.download(outputPath,()=>{
                console.log("file downloaded");
            })
           
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message:"Internal Server Error"
        });
    }
})

app.get("/",(req,res)=>{
    res.send("Welcome to the Home page");
})
app.listen(port, () => {
    console.log(`Server is listening on the port ${port}`);
});