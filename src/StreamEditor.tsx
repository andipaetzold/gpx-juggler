import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { LineChart } from "./charts/LineChart";
import { useStore } from "./store";
import { StreamType } from "./types";

interface Props {
  type: StreamType;
}

export function StreamEditor({ type }: Props) {
  const files = useStore((s) => s.files);

  const filesWithType = files.filter((file) => file[type]);

  if (filesWithType.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <FormGroup aria-label="position" row>
          {filesWithType.map((file) => (
            <FormControlLabel
              key={file.id}
              value={file.id}
              control={<Checkbox />}
              label={file.name}
            />
          ))}
        </FormGroup>
        <Typography variant="h5" gutterBottom component="div">
          {names[type]}
        </Typography>
        <LineChart files={filesWithType} type={type} />
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
