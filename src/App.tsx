import { Container } from "@mui/material";
import React, { useCallback, useState } from "react";
import { Editor } from "./Editor";
import { LoadButton } from "./LoadButton";
import { SaveButton } from "./SaveButton";
import { GPXData } from "./types";

export function App() {
  const [gpxData, setGPXData] = useState<GPXData[]>([]);

  const addGPXData = useCallback((data: GPXData) => {
    setGPXData((prevData) => [...prevData, data]);
  }, []);

  return (
    <Container>
      <LoadButton addGPXData={addGPXData} />
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
      {gpxData.length > 0 && <Editor gpxData={gpxData} />}
    </Container>
  );
}
