import {
  Card,
  CardContent,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { ACTIVITY_TYPE, STREAM_TYPES } from "./constants";
import { useStore } from "./store";
import { StreamEditor } from "./StreamEditor";

export function Editor() {
  const fileCount = useStore((state) => state.files.length);
  const [name, setName] = useStore((s) => [s.name, s.setName]);
  const [type, setType] = useStore((s) => [s.type, s.setType]);

  if (fileCount === 0) {
    return null;
  }

  return (
    <Stack spacing={2} direction="column">
      <Card>
        <CardContent>
          <Stack spacing={1} direction="row">
            <TextField
              placeholder="Name"
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
          </Stack>
        </CardContent>
      </Card>

      {STREAM_TYPES.filter((t) => t !== "coordinate").map((type) => (
        <StreamEditor type={type} key={type} />
      ))}
    </Stack>
  );
}
