import React from "react";
import { Text, Modal, LegacyStack } from "@shopify/polaris";

export const NoteDeleteForm = ({
  isModalOpen,
  handleModalOpenChange,
  loading,
  handleDeleteNote,
  note,
}) => {
  return (
    <Modal
      open={isModalOpen}
      onClose={handleModalOpenChange}
      title={`Delete Note: ${note.title}`}
      primaryAction={{
        content: "Delete",
        onAction: handleDeleteNote,
        destructive: true,
        loading: loading,
      }}
      secondaryActions={{
        content: "Cancel",
        onAction: handleModalOpenChange,
      }}
    >
      <Modal.Section>
        <LegacyStack vertical>
          <LegacyStack.Item>
            <Text>
              <p>
                Are you sure you want to delete this file? This action cannot be
                undone.
              </p>
            </Text>
          </LegacyStack.Item>
        </LegacyStack>
      </Modal.Section>
    </Modal>
  );
};
