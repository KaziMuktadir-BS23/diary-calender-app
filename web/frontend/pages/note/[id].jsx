import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page, ResourceList, ResourceItem, LegacyCard, EmptyState } from "@shopify/polaris";

import { useAuthenticatedFetch } from "../../hooks";
import { createNoteAPI, getByDMYNoteAPI } from "../../rest";
import { BoxLoading, NoteCard, NoteForm } from "../../components";

const NoteListPage = () => {
  const fetcher = useAuthenticatedFetch();
  const params = useParams();
  const navigate = useNavigate();
  const [date, month, year] = params.id.split("-");

  const [pageLoading, setPageLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [notes, setNotes] = useState([]);
  const [isCreateNoteModalVisible, setIsCreateNoteModalVisible] = useState(false);

  const handleModalOpenChange = useCallback(
    () => setIsCreateNoteModalVisible(!isCreateNoteModalVisible),
    [isCreateNoteModalVisible]
  );

  // FUNCTIONS

  const handleGetNotes = async () => {
    setPageLoading(true);
    const res = await getByDMYNoteAPI(fetcher, { date, month, year });

    if (res.message === "Success") {
      setNotes(res.data || []);
    } else {
      setNotes([]);
    }

    setPageLoading(false);
  };

  const handleCreateNote = async ({ title, content, tag }) => {
    setCreateLoading(true);

    const response = await createNoteAPI(fetcher, { title, content, tag, date, month, year });

    if (response.message === "Success") {
      await handleGetNotes();
    }

    setCreateLoading(false);
    handleModalOpenChange();
  };

  useEffect(() => {
    handleGetNotes();
  }, []);

  return (
    <>
      <Page
        title={`Note List (${date}-${+month + 1}-${year})`}
        backAction={{ content: "back", onAction: () => navigate("/") }}
        primaryAction={{
          content: "Create new note",
          onAction: () => {
            setIsCreateNoteModalVisible(true);
          },
        }}
      >
        {pageLoading ? (
          <BoxLoading />
        ) : notes && notes.length > 0 ? (
          <ResourceList
            resourceName={{ singular: "note", plural: "notes" }}
            items={notes.reverse()}
            renderItem={(note) => (
              <ResourceItem
                id={note.id || Date.now()} // Use Date.now() if no ID exists
                accessibilityLabel={`View details for ${note.title || "Untitled"}`}
                persistActions
              >
                <NoteCard
                  note={{
                    id: note.id || Date.now(),
                    title: note.title || "Untitled",
                    content: note.content || "",
                    tag: note.tag || "",
                    date: note.date || "",
                    month: note.month || "",
                    year: note.year || "",
                  }}
                  handleGetNotes={handleGetNotes}
                />
              </ResourceItem>
            )}
          />
        ) : (
          <LegacyCard sectioned>
            <EmptyState
              heading="Create a new note"
              action={{
                content: "Create",
                onAction: () => {
                  setIsCreateNoteModalVisible(true);
                },
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              fullWidth
            >
              <p>
                Notes enhance memory, organization, understanding, exam prep, recall, creativity, collaboration, and
                personal growth—saving time, fostering comprehension, and enabling efficient knowledge sharing.
              </p>
            </EmptyState>
          </LegacyCard>
        )}
      </Page>
      <NoteForm
        isModalOpen={isCreateNoteModalVisible}
        handleModalOpenChange={handleModalOpenChange}
        loading={createLoading}
        handleCreateNote={handleCreateNote}
      />
    </>
  );
};

export default NoteListPage;
