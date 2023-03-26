const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

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

  const swaggerDocs = swaggerJsdoc(swaggerOptions);

  module.exports = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }
  