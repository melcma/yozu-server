import express from "express";
import user from "./src/routes/user.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.send("hello");
});

app.use("/user", user);

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
