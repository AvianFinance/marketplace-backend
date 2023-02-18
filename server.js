const express = require('express')
const cors = require("cors");

const dbo = require("./database/conn");
const rentalRoutes = require('./routes/rentalRoute');
const buyRoutes = require('./routes/buyRoute')
const userRoutes = require("./routes/userRoutes")
const collectionRoutes = require("./routes/collectionRoute")

const app = express()
app.use(cors());
app.use(express.json());

//Middleware
app.use('/api/rental', rentalRoutes);
app.use('/api/user', userRoutes);
app.use('/api/buy', buyRoutes);
app.use('/api/collection', collectionRoutes);

//Main Route
app.get('/', (req,res) => {
    res.send("We are online")
})

//Initial worker thread
// const {Worker} = require("worker_threads");
// const worker = new Worker("./workers/index",{workerData: "Main listner"});

const PORT = process.env.PORT || 8080;
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
