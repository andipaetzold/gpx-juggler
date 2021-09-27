import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as LineChartComponent,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../constants";
import { GPXData, StreamType } from "../types";
import uniq from "lodash/uniq";
import { formatTime } from "../util";

interface Props {
  files: Array<GPXData & { id: string }>;
  type: StreamType;
}

export function LineChart({ files, type }: Props) {
  const timestamps = uniq(
    files.flatMap((file) => file[type]!.data.map((d) => d.timestamp))
  );

  const firstTimestamp = Math.min(...timestamps);

  const data = timestamps.map((t) => ({
    timestamp: (t - firstTimestamp) / 60,

    ...Object.fromEntries(
      files
        .map((file) => {
          // @ts-ignore
          const value = file[type]!.data.find((d) => d.timestamp === t)?.value;
          if (value !== undefined) {
            return [file.id, value];
          }

          return null;
        })
        .filter((s): s is any[] => s !== null)
    ),
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChartComponent
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={["dataMin", (dataMax: number) => Math.ceil(dataMax)]}
            allowDecimals={false}
            tickFormatter={(timestamp) => `${timestamp}min`}
          />
          <YAxis
            domain={["dataMin", "dataMax"]}
            type="number"
            allowDecimals={false}
          />
          <Tooltip
            labelFormatter={(value: number) => formatTime(value)}
            formatter={(value: number) => Math.round(value)}
          />
          <Legend />
          {files.map((file, fileIndex) => (
            <Line
              key={file.id}
              type="monotone"
              dataKey={file.id}
              isAnimationActive={false}
              dot={false}
              stroke={COLORS[fileIndex % COLORS.length]}
              name={file.name}
            />
          ))}
        </LineChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
