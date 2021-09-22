import { Typography } from "@mui/material";
import uniq from "lodash/uniq";
import React, { Fragment } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS, STREAM_TYPES } from "./constants";
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

        const timestamps = uniq(
          filteredStreams.flatMap((s) => s.data.map((d) => d.timestamp))
        );

        const firstTimestamp = Math.min(...timestamps);

        const data = timestamps.map((t) => ({
          timestamp: (t - firstTimestamp) / 60,

          ...Object.fromEntries(
            filteredStreams
              .map((s, si) => {
                // @ts-ignore
                const value = s.data.find((d) => d.timestamp === t)?.value;
                if (value !== undefined) {
                  return [`s${si}`, value];
                }

                return null;
              })
              .filter((s): s is any[] => s !== null)
          ),
        }));

        return (
          <Fragment key={type}>
            <Typography variant="h3">{type}</Typography>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart
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
                    domain={[
                      "dataMin",
                      (dataMax: number) => Math.ceil(dataMax),
                    ]}
                    allowDecimals={false}
                    tickFormatter={(timestamp) => `${timestamp}min`}
                  />
                  <YAxis
                    domain={["dataMin", "dataMax"]}
                    type="number"
                    allowDecimals={false}
                  />
                  <Tooltip />
                  {filteredStreams.map((_s, si) => (
                    <Line
                      key={si}
                      type="monotone"
                      dataKey={`s${si}`}
                      isAnimationActive={false}
                      dot={false}
                      stroke={COLORS[si % COLORS.length]}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Fragment>
        );
      })}
    </>
  );
}
