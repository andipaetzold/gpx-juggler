import {
  Card,
  CardContent,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { ACTIVITY_TYPE, STREAM_TYPES } from "./constants";
import { StreamEditor } from "./StreamEditor";
import { GPXData } from "./types";

interface Props {
  gpxData: GPXData[];
}

export function Editor({ gpxData }: Props) {
  const [name, setName] = useState(gpxData[0].name);
  const [type, setType] = useState(gpxData[0].type);

  return (
    <Stack spacing={2} direction="column">
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

      {STREAM_TYPES.filter((t) => t !== "coordinate").map((type) => (
        <StreamEditor type={type} key={type} gpxData={gpxData} />
      ))}
    </Stack>
  );
}
