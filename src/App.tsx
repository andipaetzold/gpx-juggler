import { AppBar, Container, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Editor } from "./Editor";
import { LoadButton } from "./LoadButton";
import { SaveButton } from "./SaveButton";
import { useStore } from "./store";

export function App() {
  const addFile = useStore((s) => s.addFile);

  return (
    <>
      <AppBar position="static" sx={{ mb: 1 }}>
        <Toolbar>
          <Container>
            <Typography variant="h6">GPX Juggler</Typography>
          </Container>
        </Toolbar>
      </AppBar>
      <Container>
        <Stack spacing={2} direction="column">
          <Stack spacing={2} direction="row">
            <LoadButton addGPXData={addFile} />
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
          </Stack>
          <Editor />
        </Stack>
      </Container>
    </>
  );
}
