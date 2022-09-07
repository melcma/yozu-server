import express from "express";

import { getFeed, addFeed } from "../db.js";

const router = express.Router();

router.get("/:username", (request, response) => {
  const username = request.params.username;
  const feed = getFeed({ username });
  if (feed) return response.send(feed);

  response.status(400).send("No user found");
});

router.post("/add", (request, response) => {
  const { username, title, message, tags } = request.body;

  if (!username) return response.status(400).send("Username required");
  if (!title) return response.status(400).send("Title required");
  if (!message) return response.status(400).send("Message required");
  if (!tags) return response.status(400).send("Tags required");

  const status = addFeed({ username, title, message, tags });

  if (status === true) {
    return response.status(200).send("Post successfully added");
  }

  response.status(400).send("No user found");
});

export default router;
