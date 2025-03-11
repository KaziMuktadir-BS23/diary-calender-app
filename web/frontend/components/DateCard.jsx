import {
  AlphaCard,
  VerticalStack,
  Text,
  Badge,
  HorizontalStack,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export const DateCard = ({ date, month, year, index, today, notes }) => {
  const navigate = useNavigate();

  return (
    <div
      key={index}
      style={{ minWidth: "200px" }}
      className={`date__card ${today ? "today" : ""} grid-item`}
      onClick={() => navigate(`/note/${date}-${month}-${year}`)}
    >
      <div>
        <VerticalStack gap={4}>
          <Text alignment="end" variant="headingMd">
            {date}
          </Text>

          <HorizontalStack gap={4}>
            {notes?.map((note) => (
              <div style={{ marginTop: 2, marginRight: 2 }}>
                <Badge status="info">{note.title}</Badge>
              </div>
            ))}
          </HorizontalStack>
        </VerticalStack>
      </div>
    </div>
  );
};
