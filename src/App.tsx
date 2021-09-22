import { Container } from "@mui/material";
import React, { useCallback, useState } from "react";
import { Editor } from "./Editor";
import { LoadButton } from "./LoadButton";
import { Stream } from "./types";

export function App() {
  const [streams, setStreams] = useState<Stream[]>([]);

  const addStreams = useCallback((stream: Stream) => {
    setStreams((prevStream) => [...prevStream, stream]);
  }, []);

  return (
    <Container>
      <LoadButton addStream={addStreams} />
      <Editor streams={streams} />
    </Container>
  );
}
