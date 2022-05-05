import express from "express";
import * as path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { fetchJSON } from "./utils.js";

dotenv.config();



const app = express();


app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));





const discovery_endpoint =
  "https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration";
const client_id = process.env.CLIENT_ID;
const scope = "openid";

if (!client_id) {
  throw new Error("Must setup CLIENT_ID environment");
}

app.get("/api/config", (req, res) => {
  res.json({ discovery_endpoint, client_id, scope });
});


app.get("/api/login", async (req, res) => {
  const { access_token } = req.signedCookies;

  const { userinfo_endpoint } = await fetchJSON(discovery_endpoint);

  const userinfo = await fetch(userinfo_endpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (userinfo.status === 401) {
    return res.sendStatus(401);
  } else if (userinfo.ok) {
    res.json(await userinfo.json());
  } else {
    console.error(`Failed: ${userinfo.status} ${userinfo.statusText}`);
    return res.sendStatus(500);
  }
});

app.post("/api/login", (req, res) => {
  const { access_token } = req.body;
  res.cookie("access_token", access_token, { signed: true });
  res.sendStatus(200);
});


app.use(express.static("../client/dist"));
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Started on http://localhost:${server.address().port}`);
});
