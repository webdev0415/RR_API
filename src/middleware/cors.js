import cors from "cors";

const whitelist = [
  "https://app-dev.riot.fun",
  "https://app.riot.fun",
  "https://metadata.riot.fun",
  "https://riotracers-metadata-dev.herokuapp.com",
  "https://marketplace-dev.riot.fun",
].concat((process.env?.ALLOWED_HOST && process.env?.ALLOWED_HOST?.split(",")) || []);

const ALLOWED_API = ["/api/marketplace/alchemy/webhook"];

const corsOptions = function(req, callback) {
  console.log("origin", req.header("Origin"));
  if (whitelist.indexOf(req.header("Origin")) !== -1 || ALLOWED_API.indexOf(req.originalUrl) !== -1) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
};

export default cors(corsOptions);
