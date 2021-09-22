import { Container } from "@mui/material";
import React, { useCallback, useState } from "react";
import { Editor } from "./Editor";
import { LoadButton } from "./LoadButton";
import { Series } from "./types";

export function App() {
  const [series, setSeries] = useState<Series[]>([]);

  const addSeries = useCallback((series: Series) => {
    setSeries((prevSeries) => [...prevSeries, series]);
  }, []);

  return (
    <Container>
      <LoadButton addSeries={addSeries} />
      <Editor series={series} />
    </Container>
  );
}
