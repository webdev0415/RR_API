import passport from "passport";
import httpCodes from "http-codes";
import { sign, verify } from "jsonwebtoken";
import crypto from "crypto";
import { has } from "lodash";

export const generateAuthToken = (userId) => `bearer ${sign({ userId }, process.env.JWT_SECRET, { expiresIn: "2h" })}`;

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || token === "null") {
    return res.status(httpCodes.UNAUTHORIZED).send("Token is required!");
  }

  const authCallback = function (info, user, err) {
    if (err) {
      return res
        .status(httpCodes.UNAUTHORIZED)
        .json({ message: err?.message || "Unauthorized" });
    }
    if (!user) {
      return res
        .status(httpCodes.UNAUTHORIZED)
        .json({ message: "Bad authorization token" });
    }
    req.user = user;
    next();
  };

  passport.authenticate("jwt", { session: false }, authCallback)(req, res, next);
};

export const validateWebhook = async (req, res, next) => {
  const token = process.env.ALCHEMY_AUTH_TOKEN;
  const { headers, body } = req;

  console.log("Alchemyapi Webhook", headers, body);
  if (!has(headers, "x-alchemy-signature")) {
    return res.status(httpCodes.UNAUTHORIZED).send("Invalid webhook");
  }
  const signature = headers["x-alchemy-signature"]; // Lowercase for NodeJS
  const hmac = crypto.createHmac("sha256", token); // Create a HMAC SHA256 hash using the auth token
  hmac.update(JSON.stringify(body), "utf8"); // Update the token hash with the request body using utf8
  const digest = hmac.digest("hex");

  if (signature === digest) {
    next();
  } else {
    res.status(httpCodes.UNAUTHORIZED).send("Invalid webhook");
  }
};
