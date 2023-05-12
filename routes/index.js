const rentalRoutes = require('../routes/rentalRoute');
const buyRoutes = require('../routes/buyRoute')
const userRoutes = require("../routes/userRoutes")
const collectionRoutes = require("../routes/collectionRoute")
const mintRoutes = require("../routes/mintRoute")
const profileRoutes = require("../routes/profileRoutes")
const assetRoutes = require("../routes/assetRoutes")
const landingRoutes = require("../routes//landingRoutes")

const endPointsHandler = (app) => {
    app.use('/api/rental', rentalRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/buy', buyRoutes);
    app.use('/api/collection', collectionRoutes);
    app.use('/api/mint', mintRoutes);
    app.use('/api/profile', profileRoutes);
    app.use('/api/assets', assetRoutes);
    app.use('/api/landing', landingRoutes);
};

module.exports = { endPointsHandler };