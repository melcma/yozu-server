const tokens = [];

export const findTokenByUsername = ({ username }) => {
  return tokens.findIndex((user) => user.username === username);
};

export const addToken = ({ username, authToken }) => {
  tokens.push({ username, authToken });
};
export const refreshToken = ({ index, authToken }) => {
  tokens[index].authToken = authToken;
};

export default tokens;
