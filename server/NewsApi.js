import { Router } from "express";

const news = [
  {
    title: "Article 1",
  },
  {
    title: "Article 2",
  },
];

export function MoviesApi() {
  const router = new Router();

  router.get("/", (req, res) => {
    res.json(news);
  });

  router.post("/add", (req, res) => {
    res.sendStatus(500);
  });

  return router;
}