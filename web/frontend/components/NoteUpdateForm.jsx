import { useEffect, useState } from "react";
import { Modal, Box, TextField, Select, ExceptionList } from "@shopify/polaris";
import { CircleInformationMajor } from "@shopify/polaris-icons";

export const NoteUpdateForm = ({
  isModalOpen,
  handleModalOpenChange,
  loading,
  handleUpdateNote,
  note,
}) => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [tag, setTag] = useState();
  const [customTag, setCustomTag] = useState("");

  const onUpdateNoteAction = async () => {
    if (!title || !content || !tag) {
      alert("Please complete the form.");
    } else if (tag === "Other" && customTag === "") {
      alert("Please write a custom tag.");
    } else {
      handleUpdateNote({
        id: note.id,
        title,
        content,
        tag: tag === "Other" ? customTag : tag,
      });
    }
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);

      if (
        [
          "Content",
          "Customer",
          "Inventory",
          "Marketing",
          "Order",
          "Product",
          "Sales",
          "Stock",
          "Supplier",
          "Operations",
          "Other",
        ].includes(note.tag)
      ) {
        setTag(note.tag);
      } else {
        setTag("Other");
        setCustomTag(note.tag);
      }
    }
  }, [note]);

  return (
    <div>
      <Modal
        open={isModalOpen}
        onClose={handleModalOpenChange}
        title="Update Note."
        primaryAction={{
          content: "Update",
          loading: loading,
          onAction: onUpdateNoteAction,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleModalOpenChange,
          },
        ]}
      >
        <Modal.Section flush style={{ paddingTop: 0, paddingBottom: 50 }}>
          <Box
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              paddingRight: 30,
              paddingLeft: 30,
            }}
          >
            <TextField
              type="text"
              value={title}
              label="Title"
              onChange={(val) => {
                setTitle(val);
              }}
              autoComplete="off"
            />

            <TextField
              label="Content"
              value={content}
              onChange={(val) => {
                setContent(val);
              }}
              multiline={4}
              autoComplete="off"
            />

            <div style={{ marginBottom: 3 }}>
              <Select
                onChange={(val) => setTag(val)}
                label="Select a tag for the note"
                value={tag}
                options={[
                  "Content",
                  "Customer",
                  "Inventory",
                  "Marketing",
                  "Order",
                  "Product",
                  "Sales",
                  "Stock",
                  "Supplier",
                  "Operations",
                  "Other",
                ]?.map((col) => {
                  return {
                    label: col,
                    value: col,
                  };
                })}
                placeholder="Select a Tag"
              />
            </div>
            <div style={{ padding: "5px 0px" }}>
              <ExceptionList
                items={[
                  {
                    icon: CircleInformationMajor,
                    description: "Use tag for better managing note.",
                  },
                ]}
              />
            </div>
            {tag === "Other" ? (
              <TextField
                type="text"
                value={customTag}
                label="Custom Tag"
                onChange={(val) => {
                  setCustomTag(val);
                }}
                autoComplete="off"
              />
            ) : null}
          </Box>
        </Modal.Section>
      </Modal>
    </div>
  );
};
