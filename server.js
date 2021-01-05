const express = require("express");
const handlebars = require("handlebars");
const exphbs = require("express-handlebars");
var compression = require('compression')
// Included just in case we get an error when trying to pull data from our DB.
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const db = require("./models");
const app = express();

const playerController = require("./controllers/playerController");

const PORT = process.env.PORT || 8080;

// MIDDLEWARE
// Handle POST body
app.use(compression({ filter: shouldCompress }))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory to be served
app.use(express.static("public"));


function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
 
  // fallback to standard filter function
  return compression.filter(req, res)
}



// Configure express-handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(handlebars),
  })
);
app.set("view engine", "handlebars");

// Requiring our routes
require("./controllers/headController.js")(app);
require("./controllers/playerController.js")(app);
require("./controllers/userController.js")(app);
require("./controllers/htmlRoutes.js")(app);

// db.sequelize.sync({ force: true }).then(() => {
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
  });
});
