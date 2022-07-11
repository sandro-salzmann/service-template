const express = require("express");
const app = express();
const port = 8070;

app.get("/", (req, res) => {
  res.send("Hello world from service-template.");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
