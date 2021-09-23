import {
  Card,
  CardContent,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import { LineChart } from "./charts/LineChart";
import { ACTIVITY_TYPE, STREAM_TYPES } from "./constants";
import { Stream, StreamType } from "./types";

interface Props {
  streams: Stream[];
}

export function Editor({ streams }: Props) {
  const [name, setName] = useState("Name");
  const [type, setType] = useState(0);

  return (
    <>
      <Card>
        <CardContent>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as number)}
            size="small"
          >
            {Object.entries(ACTIVITY_TYPE).map(([typeId, type]) => (
              <MenuItem key={typeId} value={typeId}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </CardContent>
      </Card>

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
