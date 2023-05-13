const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
      name: "some-session",
      secret: "SOME_THING",
      httpOnly: true
    })
);

const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the DataBase!");
  })
  .catch(err => {
    console.log("fail: Cannot connect to the database!", err);
    process.exit();
  });


// simple basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Yazdan's application" });
  res.end();
});

require("./routes/routes.route.js")(app);

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});