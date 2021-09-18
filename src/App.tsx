import React, { useCallback, useState } from "react";
import { Container } from "@mui/material";
import { Series } from "./types";
import { LoadButton } from "./LoadButton";

export function App() {
  const [series, setSeries] = useState<Series[]>([]);

  const addSeries = useCallback((series: Series) => {
    setSeries((prevSeries) => [...prevSeries, series]);
  }, []);

  return (
    <Container>
      <LoadButton addSeries={addSeries} />
    </Container>
  );
}
