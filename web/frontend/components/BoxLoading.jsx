import React from "react";
import { Spinner, VerticalStack, HorizontalStack, Box } from "@shopify/polaris";
export const BoxLoading = () => {
  return (
    <Box style={{ marginTop: "20vh" }}>
      <VerticalStack align="center">
        <HorizontalStack align="center">
          <Spinner accessibilityLabel="Spinner" size="large" />
        </HorizontalStack>
      </VerticalStack>
    </Box>
  );
};
