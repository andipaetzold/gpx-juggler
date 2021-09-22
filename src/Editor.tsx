import { Typography } from "@mui/material";
import React, { Fragment } from "react";
import { LineChart } from "./charts/LineChart";
import { STREAM_TYPES } from "./constants";
import { Stream, StreamType } from "./types";

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
            <Typography variant="h3">{streamNames[type]}</Typography>

            <LineChart streams={filteredStreams} />
          </Fragment>
        );
      })}
    </>
  );
}

const streamNames: { [type in StreamType]: string } = {
  cadence: "Cadence",
  elevation: "elevation",
  heartrate: "Heart Rate",
  power: "Power",
  coordinate: "Map",
};
