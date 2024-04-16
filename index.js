const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");



const Users=require("./routes/usersRouter.js") 















  

const express = require("express");
const app = express();
const cors = require("cors");


app.use(fileUpload())
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('./uploads'))
app.use(cors({origin: '*'}))


app.use("/api/v1/", Users)



app.listen(4005, () => {
    console.log("SERVER IS RUNNING");
  });
  
  