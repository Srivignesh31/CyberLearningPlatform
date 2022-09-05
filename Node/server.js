const app = require("./app");
const mongoose = require("mongoose");

const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("./swagger.json");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION, APP SHUTTING NOW!!");
  console.log(err.message, err.name);
  process.exit(1);
});

const DB = "mongodb+srv://cyberrange:cb1995@cluster0.4fk6qjd.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
  })
  .then(() => {
    console.log("DB connected successfully");
  });


const port = 3000;

app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

const server = app.listen(port, () => {
  console.log("Server is up listening on port:" + port);
});