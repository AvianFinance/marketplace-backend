const express = require('express')
const cors = require("cors");
const bodyParser = require("body-parser")
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const config = require("./config/app-config")

const dbo = require("./database/conn");
const rentalRoutes = require('./routes/rentalRoute');
const buyRoutes = require('./routes/buyRoute')
const userRoutes = require("./routes/userRoutes")
const collectionRoutes = require("./routes/collectionRoute")
const mintRoutes = require("./routes/mintRoute")
const profileRoutes = require("./routes/profileRoutes")

const app = express()
app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
      description:
        "NFT marketplace CRUD API application made with Express and documented with Swagger",
    },
    host: 'localhost:8080', // the host or url of the app
    basePath: '/api', // the basepath of your endpoint
    servers: [
      {
        url: "http://localhost:8080/api/",
        description: "Local",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Middleware
app.use('/api/rental', rentalRoutes);
app.use('/api/user', userRoutes);
app.use('/api/buy', buyRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/mint', mintRoutes);
app.use('/api/profile', profileRoutes);

//Main Route
app.get('/', (req,res) => {
    res.send("We are online")
})

// Initial worker thread
const {Worker} = require("worker_threads");
const worker = new Worker("./workers/index",{workerData: "Main listner"});

const PORT = config.port || 8080;
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
