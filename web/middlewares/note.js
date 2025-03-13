import { NoteDB } from "../db.js";
import shopify from "../shopify.js";
import { randomUUID } from "crypto"; // Built-in Node.js module

export const NoteAPI = (app) => {
  const validateSession = (req, res, next) => {
    const session = res.locals.shopify.session;
    if (!session) {
      return res.status(401).send({ message: "Unauthorized: Missing session" });
    }
    res.locals.client = new shopify.api.clients.Rest({ session });
    next();
  };

  // Helper function to get shop ID
  const getShopId = async (client) => {
    const shopResponse = await client.get({ path: "/admin/api/2025-01/shop.json" });
    return shopResponse?.body?.shop?.id;
  };

  // Helper function to get notes metafield
  const getNotesMetafield = async (client) => {
    const metafieldsResponse = await client.get({ path: `/admin/api/2025-01/metafields.json` });
    return metafieldsResponse?.body?.metafields.find(
      (metafield) => metafield.namespace === "BS_DiaryCalenderApp" && metafield.key === "BSDiaryCalenderAppNote"
    );
  };

  // Helper function to parse notes from metafield
  const parseNotes = (metafield) => {
    if (!metafield) return [];

    try {
      const parsedValue = JSON.parse(metafield.value);
      return Array.isArray(parsedValue) ? parsedValue : [parsedValue];
    } catch (parseError) {
      console.error("Error parsing metafield value:", parseError);
      return [];
    }
  };

  // Helper function to save notes to metafield
  const saveNotesToMetafield = async (client, notes, existingMetafieldId = null) => {
    const metafieldData = {
      metafield: {
        namespace: "BS_DiaryCalenderApp",
        key: "BSDiaryCalenderAppNote",
        value: JSON.stringify(notes),
        type: "json",
      },
    };

    if (existingMetafieldId) {
      metafieldData.metafield.id = existingMetafieldId;
      return await client.put({
        path: `/admin/api/2025-01/metafields/${existingMetafieldId}.json`,
        data: metafieldData,
      });
    } else {
      return await client.post({
        path: `/admin/api/2025-01/metafields.json`,
        data: metafieldData,
      });
    }
  };

  // Create Note
  app.post("/api/note", validateSession, async (req, res) => {
    try {
      const { client } = res.locals;

      const shopId = await getShopId(client);
      if (!shopId) {
        return res.status(400).send({ message: "Failed to retrieve shop ID" });
      }

      const existingMetafield = await getNotesMetafield(client);
      const notes = parseNotes(existingMetafield);

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

      const metafieldResponse = await saveNotesToMetafield(client, notes, existingMetafield?.id);

      res.status(200).send({ message: "Success", data: newNote });
    } catch (err) {
      console.error("Error:", err);
      res.status(400).send({ message: "Failed", error: err.message });
    }
  });

  // Get all notes (using NoteDB)
  app.get("/api/note", async (req, res) => {
    try {
      const result = await NoteDB.list();
      res.status(200).send({ message: "success", data: result });
    } catch (err) {
      res.status(200).send({ message: "failed", error: err });
    }
  });

  // Get notes by date
  app.get("/api/note/:date/:month/:year", validateSession, async (req, res) => {
    try {
      const { client } = res.locals;

      const shopId = await getShopId(client);
      if (!shopId) {
        return res.status(400).send({ message: "Failed to retrieve shop ID" });
      }

      const notesMetafield = await getNotesMetafield(client);
      const notes = parseNotes(notesMetafield);

      const filteredNotes = notes.filter(
        (note) =>
          +note.date === +req.params.date && +note.month === +req.params.month && +note.year === +req.params.year
      );

      res.status(200).send({ message: "Success", data: filteredNotes });
    } catch (err) {
      console.error("Error:", err);
      res.status(400).send({ message: "Failed", error: err.message });
    }
  });

  // Get notes by month and year
  app.get("/api/note/:month/:year", validateSession, async (req, res) => {
    try {
      const { client } = res.locals;

      const shopId = await getShopId(client);
      if (!shopId) {
        return res.status(400).send({ message: "Failed to retrieve shop ID" });
      }

      const notesMetafield = await getNotesMetafield(client);
      const notes = parseNotes(notesMetafield);

      // Filter notes based on selected month and year
      const filteredNotes = notes.filter(
        (note) => +note.month === +req.params.month && +note.year === +req.params.year
      );

      res.status(200).send({ message: "Success", data: filteredNotes });
    } catch (err) {
      console.error("Error:", err);
      res.status(400).send({ message: "Failed", error: err.message });
    }
  });

  // Update note
  app.put("/api/note/:id", validateSession, async (req, res) => {
    try {
      const { client } = res.locals;

      const notesMetafield = await getNotesMetafield(client);
      if (!notesMetafield) {
        return res.status(400).send({ message: "Failed", error: "Metafield not found" });
      }

      let notes = parseNotes(notesMetafield);

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
      await saveNotesToMetafield(client, notes, notesMetafield.id);

      res.status(200).send({ message: "Success", data: notes[noteIndex] });
    } catch (err) {
      console.error("Error updating note:", err);
      res.status(400).send({ message: "Failed", error: err.message });
    }
  });

  // Delete note
  app.delete("/api/note/:id", validateSession, async (req, res) => {
    try {
      const { client } = res.locals;

      const notesMetafield = await getNotesMetafield(client);
      if (!notesMetafield) {
        return res.status(400).send({ message: "Failed", error: "Metafield not found" });
      }

      let notes = parseNotes(notesMetafield);

      // Remove the note with the given id
      notes = notes.filter((note) => note.id !== req.params.id);

      // Save updated notes back to metafield
      await saveNotesToMetafield(client, notes, notesMetafield.id);

      res.status(200).send({ message: "Success", data: req.params.id });
    } catch (err) {
      console.error("Error deleting note:", err);
      res.status(400).send({ message: "Failed", error: err.message });
    }
  });
};
