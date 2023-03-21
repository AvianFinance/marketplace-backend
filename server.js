const express = require('express')
const cors = require("cors");
const bodyParser = require("body-parser")
const config = require("./config/app-config")
const logger = require("./utils/logger")
const swaggerDoc = require("./config/swagger-config")
const routes = require('./routes');
const dbo = require("./database/conn");
const errorHandler = require("./utils/errorHandler")

const app = express()
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))

swaggerDoc(app);
routes.endPointsHandler(app);
app.use(errorHandler);

// Initial worker thread
const { Worker } = require("worker_threads");
const worker = new Worker("./workers/index", { workerData: "Main listner" });

const PORT = config.port || 8080;
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    logger.info(`Server is running on port: ${PORT}`);
  });
});
