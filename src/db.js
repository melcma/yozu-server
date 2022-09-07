import StormDB from "stormdb";
import { randomBytes } from "node:crypto";

const engine = new StormDB.localFileEngine("./db/users");
const users = new StormDB(engine);
users.default([]);

export const authenticateUser = ({ username, password }) => {
  const user = users
    .value()
    .filter((u) => u.username === username && u.password === password);

  const authToken = randomBytes(10).toString("hex");
  if (user.length > 0) {
    return { authToken };
  }

  return null;
};

export const checkUserInDatabase = ({ username = "" }) => {
  return users.value().filter((u) => u.username === username);
};

export const saveUserToDatabase = ({ username, password }) => {
  users.push({ username, password });
  users.save();
};
