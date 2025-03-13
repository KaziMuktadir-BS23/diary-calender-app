export const createNoteAPI = async (fetcher, { title, content, tag, date, month, year }) => {
  try {
    const response = await fetcher("/api/note", {
      method: "POST",
      body: JSON.stringify({
        title,
        content,
        tag,
        date,
        month,
        year,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const resJson = await response.json();

    console.log("response in createNoteAPI", resJson);
    return resJson;
  } catch (err) {
    console.log("Error in createNoteAPI: ", err);
    return err;
  }
};

export const getAllNoteAPI = async (fetcher) => {
  try {
    const response = await fetcher("/api/note", {
      method: "GET",

      headers: { "Content-Type": "application/json" },
    });
    const resJson = await response.json();

    console.log("response in getAllNoteAPI", resJson);
    return resJson;
  } catch (err) {
    console.log("Error in getAllNoteAPI: ", err);
    return err;
  }
};

export const getByDMYNoteAPI = async (fetcher, { date, month, year }) => {
  try {
    const response = await fetcher(`/api/note/${date}/${month}/${year}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const resJson = await response.json();
    console.log("Response in getByDMYNoteAPI:", resJson);

    return resJson;
  } catch (err) {
    console.log("Error in getByDMYNoteAPI:", err);
    return { message: "Failed", error: err.message };
  }
};

export const getByMYNoteAPI = async (fetcher, { month, year }) => {
  try {
    const response = await fetcher(`/api/note/${month}/${year}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const resJson = await response.json();

    console.log("Response in getByMYNoteAPI:", resJson);
    return resJson;
  } catch (err) {
    console.log("Error in getByMYNoteAPI:", err);
    return { message: "Failed", error: err.message };
  }
};

// export const deleteNoteByIdAPI = async (fetcher, { id }) => {
//   try {
//     const response = await fetcher(`/api/note/${id}`, {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//     });
//     const resJson = await response.json();

//     console.log("response in deleteNoteByIdAPI", resJson);
//     return resJson;
//   } catch (err) {
//     console.log("Error in deleteNoteByIdAPI: ", err);
//     return err;
//   }
// };
export const updateNoteAPI = async (fetcher, { id, title, content, tag }) => {
  try {
    const response = await fetcher(`/api/note/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        content,
        tag,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const resJson = await response.json();
    console.log("Response in updateNoteAPI:", resJson);
    return resJson;
  } catch (err) {
    console.log("Error in updateNoteAPI:", err);
    return { message: "Failed", error: err.message };
  }
};

// export const updateNoteAPI = async (fetcher, { id, title, content, tag }) => {
//   try {
//     const response = await fetcher(`/api/note/${id}`, {
//       method: "PUT",
//       body: JSON.stringify({
//         title,
//         content,
//         tag,
//       }),
//       headers: { "Content-Type": "application/json" },
//     });
//     const resJson = await response.json();

//     console.log("response in updateNoteAPI", resJson);
//     return resJson;
//   } catch (err) {
//     console.log("Error in updateNoteAPI: ", err);
//     return err;
//   }
// };
export const deleteNoteByIdAPI = async (fetcher, { id }) => {
  try {
    const response = await fetcher(`/api/note/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const resJson = await response.json();
    console.log("Response in deleteNoteByIdAPI:", resJson);
    return resJson;
  } catch (err) {
    console.log("Error in deleteNoteByIdAPI:", err);
    return { message: "Failed", error: err.message };
  }
};
