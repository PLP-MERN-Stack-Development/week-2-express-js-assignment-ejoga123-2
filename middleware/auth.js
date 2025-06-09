const API_KEY = "my-secret-api-key"; // Change this to your secret

module.exports = (req, res, next) => {
  if (req.path.startsWith("/api")) {
    const apiKey = req.header("x-api-key");
    if (apiKey !== API_KEY) {
      return res.status(401).json({ error: "Unauthorized: Invalid API key" });
    }
  }
  next();
};
