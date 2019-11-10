const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer")();
const jwt = require("jsonwebtoken");
const { getTasks, addTask, editTask } = require("./data");
const _debug = require("debug");
var debug = _debug("server");
var apiRouter = express.Router();
const jwt_secret_key = "secret_key";
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "0.5mb" }));
app.use(express.static(path.join(__dirname, "/../../build")));

apiRouter.get("/", (req, res) => {
  if (!req.query.developer) {
    res.json({ status: "error", message: "Не передано имя разработчика" });
    return;
  }
  const { tasks, total_task_count } = getTasks(req.query);
  res.json({ status: "ok", message: { tasks, total_task_count } });
});

apiRouter.post("/create", multer.none(), (req, res) => {
  let error = false;
  const username = req.body.username;
  const email = req.body.email;
  const text = req.body.text;
  if (!username) {
    error = true;
    message = "Поле username обязательно для заполнения";
  }
  if (!text) {
    error = true;
    message = "Поле text обязательно для заполнения";
  }
  if (
    !email ||
    !email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
  ) {
    error = true;
    message = "Неверный email";
  }
  if (!error) {
    const task = addTask(username, email, text);
    res.json({
      status: "ok",
      message: task
    });
  } else {
    res.json({ status: "error", message });
  }
});

apiRouter.post("/edit/:id", multer.none(), (req, res) => {
  let error = false;
  const id = req.params.id;
  const text = req.body.text;
  const status = req.body.status;
  const token = req.body.token;
  try {
    jwt.verify(token, jwt_secret_key);
  } catch (e) {
    error = true;
    message = "Токен истек";
  }
  if (!error) {
    editTask(id, text, status);
    res.json({
      status: "ok"
    });
  } else {
    res.json({ status: "error", message });
  }
});

apiRouter.post("/login", multer.none(), (req, res) => {
  let error = false;
  const username = req.body.username;
  const password = req.body.password;
  if (!username) {
    error = true;
    message = "Поле username обязательно для заполнения";
  }
  if (username != "admin" || password != "123") {
    error = true;
    message = "Неверный логин или пароль";
  }
  if (!error) {
    const token = jwt.sign({}, jwt_secret_key, { expiresIn: "24h" });
    res.json({
      status: "ok",
      token
    });
  } else {
    res.json({ status: "error", message });
  }
});

app.use("/v2/", apiRouter);

let server = async () => {
  debug("Starting server...");
  let httpServer = http.Server(app);
  app.use(function(req, res) {
    res.sendFile(path.join(__dirname, "/../../build", "index.html"));
  });
  const port = process.env.PORT || 5000;
  httpServer.listen(port, () => {
    debug(`Server running on ${port}.`);
  });
};
server();
