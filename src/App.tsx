import { Container } from "@mui/material";
import React, { useCallback, useState } from "react";
import { Editor } from "./Editor";
import { LoadButton } from "./LoadButton";
import { SaveButton } from "./SaveButton";
import { Stream } from "./types";

export function App() {
  const [streams, setStreams] = useState<Stream[]>([]);

  const addStreams = useCallback((stream: Stream) => {
    setStreams((prevStream) => [...prevStream, stream]);
  }, []);

  return (
    <Container>
      <LoadButton addStream={addStreams} />
      <SaveButton
        data={{
          name: "Test",
          type: 5,
          coordinate: {
            type: "coordinate",
            data: [
              {
                timestamp: 0,
                value: [0, 0],
              },
            ],
          },
        }}
      />
      <Editor streams={streams} />
    </Container>
  );
}
