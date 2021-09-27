import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { LineChart } from "./charts/LineChart";
import { GPXData, Stream, StreamType } from "./types";

interface Props {
  gpxData: GPXData[];
  type: StreamType;
}

export function StreamEditor({ gpxData, type }: Props) {
  const filteredStreams = gpxData
    .map((data) => ({ ...data[type], name: data.name }))
    .filter(
      (stream): stream is Stream & { name: string } => stream !== undefined
    );

  if (filteredStreams.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <FormGroup aria-label="position" row>
          {filteredStreams.map((s, si) => (
            <FormControlLabel value={s} control={<Checkbox />} label={s.name} />
          ))}
        </FormGroup>
        <Typography variant="h5" gutterBottom component="div">
          {names[type]}
        </Typography>
        <LineChart streams={filteredStreams} />
      </CardContent>
    </Card>
  );
}

const names: { [type in StreamType]: string } = {
  cadence: "Cadence",
  elevation: "elevation",
  heartrate: "Heart Rate",
  power: "Power",
  coordinate: "Map",
};
