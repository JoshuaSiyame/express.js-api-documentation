// import required modules/packages
const express = require("express");
const http = require("http");
const logger = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// api documentation setup
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express.js REST api documentation project",
            version: "1.0.0"
        },
    },
    apis: ["./routes/routes.js"]
};

const openapiSpecifications = swaggerJsDoc(options);

// import routes
const appRoutes = require("./routes/routes");

// dotenv configuration
dotenv.config();

// connection to database
mongoose.set("strictQuery", true);

// connect based on the mode of environment
if(process.env.MODE !== "production"){
    console.log(`MODE: ${process.env.MODE}`);
    mongoose.connect(process.env.MONGODB_URI_DEV).then(()=>{
        console.log("Connected to the Database");
    }).catch((err)=>{
        console.log("Failed to connect to Database", err);
    });
}else{
    console.log(`MODE: ${process.env.MODE}`);
    mongoose.connect(process.env.MONGODB_URI_PROD).then(()=>{
        console.log("Connected to the Database");
    }).catch((err)=>{
        console.log("Failed to connect to Database", err);
    });
}

// app instance
const app = express();

// app configurations
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configure swagger to the app
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecifications));

// routes configurations
app.use("/", appRoutes);

// server instance
const server = http.createServer(app);

server.listen(process.env.PORT, ()=>{
    console.log(`Server up and running on port: ${process.env.PORT}`);
});