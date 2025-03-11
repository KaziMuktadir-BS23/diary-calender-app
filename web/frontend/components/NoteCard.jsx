import React, { useCallback, useState } from "react";

import { AlphaCard, Button, Text, Icon, Badge } from "@shopify/polaris";
import { EditMinor, DeleteMajor } from "@shopify/polaris-icons";
import { NoteDeleteForm } from "./NoteDeleteForm";
import { NoteUpdateForm } from "./NoteUpdateForm";
import { deleteNoteByIdAPI, updateNoteAPI } from "../rest";
import { useAuthenticatedFetch } from "../hooks";

export const NoteCard = ({ note, handleGetNotes }) => {
  const fetcher = useAuthenticatedFetch();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [isUpdateNoteModalVisible, setIsUpdateNoteModalVisible] =
    useState(false);

  const handleUpdateModalOpenChange = useCallback(
    () => setIsUpdateNoteModalVisible(!isUpdateNoteModalVisible),
    [isUpdateNoteModalVisible]
  );

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteNoteModalVisible, setIsDeleteNoteModalVisible] =
    useState(false);

  const handleDeleteModalOpenChange = useCallback(
    () => setIsDeleteNoteModalVisible(!isDeleteNoteModalVisible),
    [isDeleteNoteModalVisible]
  );

  const handleUpdateNote = async ({ id, title, content, tag }) => {
    setUpdateLoading(true);
    await updateNoteAPI(fetcher, { id, title, content, tag });
    await handleGetNotes();
    handleUpdateModalOpenChange();
    setUpdateLoading(false);
  };

  const handleDeleteNote = async () => {
    setDeleteLoading(true);
    await deleteNoteByIdAPI(fetcher, { id: note.id });
    await handleGetNotes();
    setDeleteLoading(false);
  };

  return (
    <>
      <AlphaCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: "0.5rem",
          }}
        >
          <h3>
            <Text variant="headingLg">
              {note.title}
              <span
                style={{
                  fontWeight: "lighter",
                  fontSize: "0.75rem",
                  marginLeft: "0.5rem",
                }}
              >
                <Badge status="success">{note.tag}</Badge>
              </span>{" "}
            </Text>
          </h3>
          <div
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: "0.75rem",
            }}
          >
            {note.createdAt}
          </div>
        </div>
        <div>{note.content}</div>

        <div
          style={{
            display: "flex",
            justifyContent: "end",
            gap: 10,
            marginTop: 10,
          }}
        >
          <Button onClick={handleUpdateModalOpenChange}>
            <Icon source={EditMinor} color="base" />
          </Button>

          <Button destructive onClick={handleDeleteModalOpenChange}>
            <Icon source={DeleteMajor} color="base" />
          </Button>
        </div>
      </AlphaCard>
      <NoteUpdateForm
        isModalOpen={isUpdateNoteModalVisible}
        handleModalOpenChange={handleUpdateModalOpenChange}
        loading={updateLoading}
        handleUpdateNote={handleUpdateNote}
        note={note}
      />
      <NoteDeleteForm
        isModalOpen={isDeleteNoteModalVisible}
        handleModalOpenChange={handleDeleteModalOpenChange}
        loading={deleteLoading}
        handleDeleteNote={handleDeleteNote}
        note={note}
      />
    </>
  );
};
