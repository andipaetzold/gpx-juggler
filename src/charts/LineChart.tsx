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
import { Stream } from "../types";
import uniq from "lodash/uniq";
import { values } from "lodash";
import { formatTime } from "../util";

interface Props {
  streams: (Stream & { name: string })[];
}

export function LineChart({ streams }: Props) {
  const timestamps = uniq(
    streams.flatMap((stream) => stream.data.map((d) => d.timestamp))
  );

  const firstTimestamp = Math.min(...timestamps);

  const data = timestamps.map((t) => ({
    timestamp: (t - firstTimestamp) / 60,

    ...Object.fromEntries(
      streams
        .map((stream, si) => {
          // @ts-ignore
          const value = stream.data.find((d) => d.timestamp === t)?.value;
          if (value !== undefined) {
            return [`s${si}`, value];
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
          {streams.map((s, si) => (
            <Line
              key={si}
              type="monotone"
              dataKey={`s${si}`}
              isAnimationActive={false}
              dot={false}
              stroke={COLORS[si % COLORS.length]}
              name={s.name}
            />
          ))}
        </LineChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
