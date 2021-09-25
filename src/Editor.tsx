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
import { GPXData, Stream, StreamType } from "./types";

interface Props {
  gpxData: GPXData[];
}

export function Editor({ gpxData }: Props) {
  const [name, setName] = useState(gpxData[0].name);
  const [type, setType] = useState(gpxData[0].type);

  return (
    <>
      <Card sx={{ mb: 3 }}>
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
        const filteredStreams = gpxData
          .map((data) => ({ ...data[type], name: data.name }))
          .filter(
            (stream): stream is Stream & { name: string } =>
              stream !== undefined
          );

        if (filteredStreams.length === 0) {
          return null;
        }

        return (
          <Card key={type} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom component="div">
                {streamNames[type]}
              </Typography>
              <LineChart streams={filteredStreams} />
            </CardContent>
          </Card>
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
