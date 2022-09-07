import express from "express";

import { addToken, refreshToken, findTokenByUsername } from "../token.js";

import {
  checkUserInDatabase,
  saveUserToDatabase,
  authenticateUser,
} from "../db.js";

const router = express.Router();

router.post("/login", (request, response) => {
  const { username, password } = request.body;

  if (!username) return response.status(400).send("Username required");
  if (!password) return response.status(400).send("Password required");

  const userAuthenticated = authenticateUser({ username, password });

  if (!userAuthenticated)
    return response.status(400).send("Invalid username or password");

  const indexOfExisitngToken = findTokenByUsername({ username });

  if (indexOfExisitngToken !== -1) {
    refreshToken({ username, authToken: userAuthenticated.authToken });
  } else {
    addToken({
      index: indexOfExisitngToken,
      authToken: userAuthenticated.authToken,
    });
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
