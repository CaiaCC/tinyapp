
function generateRandomString() {
  const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let randomURL = "";
  for (let i = 0; i< 6; i++) {
    randomURL += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  };
  return randomURL;
};

module.exports = {generateRandomString}