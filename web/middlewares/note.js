import { NoteDB } from "../db.js";
import shopify from "../shopify.js";

export const NoteAPI = (app) => {
  // Create
  app.post("/api/note", async (req, res) => {
    try {
      const client = new shopify.api.clients.Rest({
        session: res.locals.shopify.session,
      });
      const response = await client.get({
        path: `/admin/api/2023-07/shop.json`,
      });

      const shopId = response?.body?.shop?.id;

      const result = await NoteDB.create({
        shopId: shopId,
        title: req.body.title,
        content: req.body.content,
        tag: req.body.tag,
        date: +req.body.date,
        month: +req.body.month,
        year: +req.body.year,
      });
      res.status(200).send({ message: "success", data: result });
    } catch (err) {
      console.log({ err });
      res.status(400).send({ message: "failed", error: err });
    }
  });

  //Get
  app.get("/api/note", async (req, res) => {
    try {
      const result = await NoteDB.list();
      res.status(200).send({ message: "success", data: result });
    } catch (err) {
      // console.log({ err });
      res.status(200).send({ message: "failed", error: err });
    }
  });

  app.get("/api/note/:date/:month/:year", async (req, res) => {
    try {
      const client = new shopify.api.clients.Rest({
        session: res.locals.shopify.session,
      });
      const response = await client.get({
        path: `/admin/api/2023-07/shop.json`,
      });

      const shopId = response?.body?.shop?.id;

      const result = await NoteDB.read({
        shopId: shopId,
        date: +req.params.date,
        month: +req.params.month,
        year: +req.params.year,
      });

      res.status(200).send({ message: "success", data: result });
    } catch (err) {
      console.log({ err });
      res.status(200).send({ message: "failed", error: err });
    }
  });

  app.get("/api/note/:month/:year", async (req, res) => {
    try {
      const client = new shopify.api.clients.Rest({
        session: res.locals.shopify.session,
      });
      const response = await client.get({
        path: `/admin/api/2023-07/shop.json`,
      });
      const shopId = response?.body?.shop?.id;
      const result = await NoteDB.readByMonth({
        shopId: shopId,
        month: +req.params.month,
        year: +req.params.year,
      });

      res.status(200).send({ message: "success", data: result });
    } catch (err) {
      console.log({ err });
      res.status(200).send({ message: "failed", error: err });
    }
  });

  // Put
  app.put("/api/note/:id", async (req, res) => {
    try {
      await NoteDB.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        tag: req.body.tag,
      });

      res.status(200).send({ message: "success", data: req.params.id });
    } catch (err) {
      console.log({ err });
      res.status(200).send({ message: "failed", error: err });
    }
  });

  // Delete
  app.delete("/api/note/:id", async (req, res) => {
    try {
      await NoteDB.delete({ id: req.params.id });

      res.status(200).send({ message: "success", data: req.params.id });
    } catch (err) {
      console.log({ err });
      res.status(200).send({ message: "failed", error: err });
    }
  });
};

// Get ALL
// app.get("/api/mystery-box", async (req, res) => {
//   try {
//     const result = await MysteryBoxDB.list();

//     const queryParam =
//       result &&
//       result.length > 0 &&
//       result?.map((res) => res.product_id).join(",");

//     const client = new shopify.api.clients.Rest({
//       session: res.locals.shopify.session,
//     });

//     const response = await client.get({
//       path: `/products.json?ids=${queryParam}`,
//     });

//     res
//       .status(200)
//       .send({ message: "Success", data: response?.body?.products });
//   } catch (err) {
//     // console.log({ err });
//     res.status(200).send({ message: "failed", data: [] });
//   }
// });

// // Get Single Product
// app.get("/api/mystery-box/:id", async (req, res) => {
//   try {
//     const result = await MysteryBoxDB.read(req.params.id);

//     const client = new shopify.api.clients.Rest({
//       session: res.locals.shopify.session,
//     });

//     const response = await client.get({
//       path: `/products/${result.product_id}.json`,
//     });

//     const responseCollection = await client.get({
//       path: `/admin/api/2023-04/collections/${result.collection_id}.json`,
//     });

//     res.status(200).send({
//       message: "Success",
//       data: {
//         ...response?.body?.product,
//         mystery_collection: responseCollection?.body?.collection,
//       },
//     });
//   } catch (err) {
//     // console.log({ err });
//   }
// });
