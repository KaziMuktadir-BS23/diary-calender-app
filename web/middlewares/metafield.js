import shopify from "../../shopify.js";

export const MetaFieldAPI = (app) => {};
// app.post("/api/note", async (req, res) => {
//   try {
//     const session = res.locals.shopify.session;
//     console.log("Session:", session);

//     if (!session) {
//       return res.status(401).send({ message: "Unauthorized: Missing session" });
//     }

//     // Fetch shop details
//     const client = new shopify.api.clients.Rest({ session });
//     console.log("Client:", client);
//     const response = await client.get({
//       path: "/admin/api/2023-07/shop.json",
//     });
//     const shopId = response?.body?.shop?.id;
//     console.log("Shop ID:", shopId);

//     // ✅ Corrected: Use POST to create a metafield
//     const metafieldResponse = await client.post({
//       path: `/admin/api/2025-01/metafields.json`,
//       data: {
//         metafield: {
//           namespace: "BS_DiaryCalenderApp",
//           key: "BSDiaryCalenderAppNote",
//           value: JSON.stringify({
//             title: req.body.title,
//             content: req.body.content,
//             tag: req.body.tag,
//             date: req.body.date,
//             month: req.body.month,
//             year: req.body.year,
//           }),
//           type: "json",
//         },
//       },
//     });

//     console.log("Metafield Response:", metafieldResponse.body);
//     res.status(200).send({ message: "Success", data: metafieldResponse.body });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(400).send({ message: "Failed", error: err.message });
//   }
// });
