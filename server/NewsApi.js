import { Router } from "express";
import slugify from "slugify";


export function NewsApi(mongoDatabase) {
  const router = new Router();

  router.get('/:slug', async (req, res) => {
    const slug = req.params.slug
    const news = await mongoDatabase
      .collection("news")
      .findOne({slug: slug});
    res.json(news);
  });

  router.get("/", async (req, res) => {
    const filter = {}
    if(req.query.author!=undefined) {
        filter.author = req.query.author
    }

    const news = await mongoDatabase
      .collection("news")
      .find(filter)
      .sort({
        metacritic: -1,
      })
      .map(({_id, title, slug,text,category,author}) => ({
        _id,
        title,
        slug,
        text,
        category,
        author
      }))
      .limit(100)
      .toArray();
    res.json(news);
  });

  router.post("/add", (req, res) => {
    const { title, text, category, author } = req.body;
    const slug = slugify(title);

    const result = mongoDatabase.collection("news").insertOne({
      title,
      slug,
      text,
      category,
      author
    });
    res.status(200).send({ok:true});
  });

  return router;
}