const functions = require("firebase-functions");
const express   = require("express");
const basicAuth = require("basic-auth-connect");
const fs        = require("fs");
const filename  = "auth_info.example.txt";

const app  = express();
const text = fs.readFileSync(`${__dirname}/${filename}`, "utf8");
const auth = ((lines) => {
  const ret = {};

  lines.forEach((line, index) => {
    if (!line) return;
    ret[index === 0 ? "username" : "password"] = line;
  });

  return ret;
})(text.toString().split("\n")); 

app.use(basicAuth(auth.username, auth.password));
app.get("/auth", (req, res) => {
  res.redirect("/index.html");
});

exports.app = functions.https.onRequest(app);
