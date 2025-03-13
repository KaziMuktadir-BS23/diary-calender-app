import { NoteDB } from "../db.js";
import shopify from "../shopify.js";
import { randomUUID } from "crypto"; // Built-in Node.js module

export const NoteAPI = (app) => {
  // Create

  app.post("/api/note", async (req, res) => {
    try {
      const session = res.locals.shopify.session;
      if (!session) {
        return res.status(401).send({ message: "Unauthorized: Missing session" });
      }
      const client = new shopify.api.clients.Rest({ session });

      const shopResponse = await client.get({ path: "/admin/api/2025-01/shop.json" });
      const shopId = shopResponse?.body?.shop?.id;
      if (!shopId) {
        return res.status(400).send({ message: "Failed to retrieve shop ID" });
      }

      // Fetch existing metafield
      const metafieldsResponse = await client.get({ path: `/admin/api/2025-01/metafields.json` });
      const existingMetafield = metafieldsResponse?.body?.metafields.find(
        (metafield) => metafield.namespace === "BS_DiaryCalenderApp" && metafield.key === "BSDiaryCalenderAppNote"
      );

      let notes = [];
      if (existingMetafield) {
        try {
          const parsedValue = JSON.parse(existingMetafield.value);
          notes = Array.isArray(parsedValue) ? parsedValue : [parsedValue];
        } catch (parseError) {
          console.error("Error parsing existing metafield:", parseError);
          notes = [];
        }
      }

      console.log("Existing Notes:", notes);

      const newNote = {
        id: randomUUID(), // Generate unique ID
        title: req.body.title,
        content: req.body.content,
        tag: req.body.tag,
        date: req.body.date,
        month: req.body.month,
        year: req.body.year,
      };

      notes.push(newNote);

      // Save updated notes to the metafield
      const metafieldResponse = await client.post({
        path: `/admin/api/2025-01/metafields.json`,
        data: {
          metafield: {
            namespace: "BS_DiaryCalenderApp",
            key: "BSDiaryCalenderAppNote",
            value: JSON.stringify(notes),
            type: "json",
          },
        },
      });

      console.log("Updated Metafield Response:", metafieldResponse.body);
      res.status(200).send({ message: "Success", data: newNote });
    } catch (err) {
      console.error("Error:", err);
      res.status(400).send({ message: "Failed", error: err.message });
    }
  });

  //Get
  app.get("/api/note", async (req, res) => {
    try {
      const result = await NoteDB.list();
      res.status(200).send({ message: "success", data: result });
    } catch (err) {
      res.status(200).send({ message: "failed", error: err });
    }
  });

  app.get("/api/note/:date/:month/:year", async (req, res) => {
    try {
      const session = res.locals.shopify.session;

      if (!session) {
        return res.status(401).send({ message: "Unauthorized: Missing session" });
      }

      const client = new shopify.api.clients.Rest({ session });

      const shopResponse = await client.get({
        path: "/admin/api/2023-07/shop.json",
      });
      const shopId = shopResponse?.body?.shop?.id;
      if (!shopId) {
        return res.status(400).send({ message: "Failed to retrieve shop ID" });
      }

      const metafieldsResponse = await client.get({
        path: `/admin/api/2025-01/metafields.json`,
      });
      console.log("Metafields Response:", metafieldsResponse.body);

      const notesMetafield = metafieldsResponse?.body?.metafields.find(
        (metafield) => metafield.namespace === "BS_DiaryCalenderApp" && metafield.key === "BSDiaryCalenderAppNote"
      );
      console.log("Notes Metafield:", notesMetafield);
      if (!notesMetafield) {
        return res.status(200).send({ message: "Success", data: [] }); // No notes found
      }

      let notes;
      try {
        notes = JSON.parse(notesMetafield.value);
        if (!Array.isArray(notes)) {
          notes = [];
        }
      } catch (parseError) {
        console.error("Error parsing metafield value:", parseError);
        notes = [];
      }
      console.log("Notes:", notes);

      const filteredNotes = notes.filter(
        (note) =>
          +note.date === +req.params.date && +note.month === +req.params.month && +note.year === +req.params.year
      );
      console.log("Filtered Notes:", filteredNotes);

      res.status(200).send({ message: "Success", data: filteredNotes });
    } catch (err) {
      console.error("Error:", err);
      res.status(400).send({ message: "Failed", error: err.message });
    }
  });

  // Put
  app.get("/api/note/:month/:year", async (req, res) => {
    try {
      const session = res.locals.shopify.session;
      if (!session) {
        return res.status(401).send({ message: "Unauthorized: Missing session" });
      }

      const client = new shopify.api.clients.Rest({ session });

      const shopResponse = await client.get({
        path: "/admin/api/2023-07/shop.json",
      });
      const shopId = shopResponse?.body?.shop?.id;
      if (!shopId) {
        return res.status(400).send({ message: "Failed to retrieve shop ID" });
      }

      const metafieldsResponse = await client.get({
        path: `/admin/api/2025-01/metafields.json`,
      });

      const notesMetafield = metafieldsResponse?.body?.metafields.find(
        (metafield) => metafield.namespace === "BS_DiaryCalenderApp" && metafield.key === "BSDiaryCalenderAppNote"
      );

      if (!notesMetafield) {
        return res.status(200).send({ message: "Success", data: [] }); // No notes found
      }

      let notes;
      try {
        notes = JSON.parse(notesMetafield.value);
        if (!Array.isArray(notes)) {
          notes = [notes]; // Convert object to array if necessary
        }
      } catch (parseError) {
        console.error("Error parsing metafield value:", parseError);
        notes = [];
      }

      // Filter notes based on selected month and year
      const filteredNotes = notes.filter(
        (note) => +note.month === +req.params.month && +note.year === +req.params.year
      );

      console.log("Filtered Notes:", filteredNotes);
      res.status(200).send({ message: "Success", data: filteredNotes });
    } catch (err) {
      console.error("Error:", err);
      res.status(400).send({ message: "Failed", error: err.message });
    }
  });
  // update
  app.put("/api/note/:id", async (req, res) => {
    try {
      const session = res.locals.shopify.session;
      if (!session) {
        return res.status(401).send({ message: "Unauthorized: Missing session" });
      }

      const client = new shopify.api.clients.Rest({ session });

      // Fetch existing metafield
      const metafieldsResponse = await client.get({ path: `/admin/api/2025-01/metafields.json` });
      const notesMetafield = metafieldsResponse?.body?.metafields.find(
        (metafield) => metafield.namespace === "BS_DiaryCalenderApp" && metafield.key === "BSDiaryCalenderAppNote"
      );

      if (!notesMetafield) {
        return res.status(400).send({ message: "Failed", error: "Metafield not found" });
      }

      let notes = JSON.parse(notesMetafield.value) || [];

      // Find the note and update it
      const noteIndex = notes.findIndex((note) => note.id === req.params.id);
      if (noteIndex === -1) {
        return res.status(404).send({ message: "Failed", error: "Note not found" });
      }

      notes[noteIndex] = {
        ...notes[noteIndex],
        title: req.body.title,
        content: req.body.content,
        tag: req.body.tag,
      };

      // Save updated notes back to metafield
      const updateResponse = await client.put({
        path: `/admin/api/2025-01/metafields/${notesMetafield.id}.json`,
        data: {
          metafield: {
            id: notesMetafield.id,
            namespace: "BS_DiaryCalenderApp",
            key: "BSDiaryCalenderAppNote",
            value: JSON.stringify(notes), // Save updated list
            type: "json",
          },
        },
      });

      res.status(200).send({ message: "Success", data: notes[noteIndex] });
    } catch (err) {
      console.error("Error updating note:", err);
      res.status(400).send({ message: "Failed", error: err.message });
    }
  });

  // Delete
  app.delete("/api/note/:id", async (req, res) => {
    try {
      const session = res.locals.shopify.session;
      if (!session) {
        return res.status(401).send({ message: "Unauthorized: Missing session" });
      }

      const client = new shopify.api.clients.Rest({ session });

      // Fetch existing metafield
      const metafieldsResponse = await client.get({ path: `/admin/api/2025-01/metafields.json` });
      const notesMetafield = metafieldsResponse?.body?.metafields.find(
        (metafield) => metafield.namespace === "BS_DiaryCalenderApp" && metafield.key === "BSDiaryCalenderAppNote"
      );

      if (!notesMetafield) {
        return res.status(400).send({ message: "Failed", error: "Metafield not found" });
      }

      let notes = JSON.parse(notesMetafield.value) || [];

      // Remove the note with the given id
      notes = notes.filter((note) => note.id !== req.params.id);

      // Save updated notes back to metafield
      const updateResponse = await client.put({
        path: `/admin/api/2025-01/metafields/${notesMetafield.id}.json`,
        data: {
          metafield: {
            id: notesMetafield.id,
            namespace: "BS_DiaryCalenderApp",
            key: "BSDiaryCalenderAppNote",
            value: JSON.stringify(notes), // Save updated list
            type: "json",
          },
        },
      });

      res.status(200).send({ message: "Success", data: req.params.id });
    } catch (err) {
      console.error("Error deleting note:", err);
      res.status(400).send({ message: "Failed", error: err.message });
    }
  });
};
