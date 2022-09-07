import express from "express";

import {
  checkUserInDatabase,
  saveUserToDatabase,
  authenticateUser,
} from "../db.js";

const router = express.Router();

const tokens = [];

router.post("/login", (request, response) => {
  const { username, password } = request.body;

  if (!username) return response.status(400).send("Username required");
  if (!password) return response.status(400).send("Password required");

  const userAuthenticated = authenticateUser({ username, password });

  if (!userAuthenticated)
    return response.status(400).send("Invalid username or password");

  const indexOfExisitngToken = tokens.findIndex(
    (user) => user.username === username
  );

  if (indexOfExisitngToken !== -1) {
    tokens[indexOfExisitngToken].authToken = userAuthenticated.authToken;
  } else {
    tokens.push({ username, authToken: userAuthenticated.authToken });
  }

  response.send(userAuthenticated.authToken);
});

router.post("/register", (request, response) => {
  const { username, password } = request.body;
  const isUserInDatabase = checkUserInDatabase({ username }).length > 0;

  if (!username) return response.status(400).send("Username required");
  if (!password) return response.status(400).send("Password required");
  if (isUserInDatabase) return response.status(400).send("User already exists");

  saveUserToDatabase({ username, password });

  response.status(200).send("Successfully created user");
});

export default router;
