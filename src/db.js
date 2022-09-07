import StormDB from "stormdb";
import { randomBytes } from "node:crypto";
import { getTime } from "date-fns";

const engine = new StormDB.localFileEngine("./db/users");
const users = new StormDB(engine);
users.default({ users: [] });

export const authenticateUser = ({ username, password }) => {
  const user = users
    .get("users")
    .filter((u) => u.username === username && u.password === password)
    .value();

  const authToken = randomBytes(10).toString("hex");
  if (user.length > 0) {
    return { authToken };
  }

  return null;
};

export const checkUserInDatabase = ({ username = "" }) => {
  return users
    .get("users")
    .value()
    .filter((u) => u.username === username);
};

export const saveUserToDatabase = ({ username, password }) => {
  users.get("users").push({ username, password, posts: [] });
  users.save();
};

export const getFeed = ({ username }) => {
  const posts = users
    .get("users")
    .filter((u) => u.username === username)
    .value();

  return posts.length > 0 ? posts[0].posts : [];
};

export const addFeed = ({ username, title, message, tags }) => {
  const indexOfExistingUser = users
    .get("users")
    .value()
    .findIndex((u) => u.username === username);

  const nowTimestamp = getTime(new Date());
  const oneDay = 1000 * 60 * 60 * 24;

  const postsWithSameTitle = users
    .get("users")
    .filter((user) => user.username === username)
    .value()[0]
    .posts.filter((post) => post.title === title);

  const postsOnCooldown = postsWithSameTitle.filter((post) => {
    return nowTimestamp - post.date > oneDay;
  });

  if (postsOnCooldown.length < 0) {
    return false;
  }

  if (indexOfExistingUser !== -1) {
    users
      .get("users")
      .get(indexOfExistingUser)
      .get("posts")
      .push({ title, message, tags: tags.split(","), date: nowTimestamp });

    users.save();

    return true;
  }

  return false;
};
