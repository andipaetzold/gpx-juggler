import { Typography } from "@mui/material";
import React, { Fragment } from "react";
import { LineChart } from "./charts/LineChart";
import { STREAM_TYPES } from "./constants";
import { Stream } from "./types";

interface Props {
  streams: Stream[];
}

export function Editor({ streams }: Props) {
  return (
    <>
      {STREAM_TYPES.filter((t) => t !== "coordinate").map((type) => {
        const filteredStreams = streams.filter((s) => s.type === type);

        if (filteredStreams.length === 0) {
          return null;
        }

        return (
          <Fragment key={type}>
            <Typography variant="h3">{type}</Typography>

            <LineChart streams={filteredStreams} />
          </Fragment>
        );
      })}
    </>
  );
}
