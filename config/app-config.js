require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    rime_token: process.env.RIME_TOKEN,
    rime_rent: process.env.RIME_RENT,
    amplace_token: process.env.AMPLACE_TOKEN,
    db_connection: process.env.MONGODB_CONNECTION_STRING,
    insmplace_token: process.env.INSMPLACE_TOKEN,
    db_name : "AVFX_Events"
}
