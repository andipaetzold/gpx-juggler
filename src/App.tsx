import { Container, Typography } from "@mui/material";
import uniq from "lodash/uniq";
import React, { Fragment, useCallback, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS, SERIES_TYPES } from "./constants";
import { LoadButton } from "./LoadButton";
import { Series } from "./types";

export function App() {
  const [series, setSeries] = useState<Series[]>([]);

  const addSeries = useCallback((series: Series) => {
    setSeries((prevSeries) => [...prevSeries, series]);
  }, []);

  return (
    <Container>
      <LoadButton addSeries={addSeries} />

      {SERIES_TYPES.filter((t) => t !== "coordinate").map((type) => {
        const filteredSeries = series.filter((s) => s.type === type);

        if (filteredSeries.length === 0) {
          return null;
        }

        const timestamps = uniq(
          filteredSeries.flatMap((s) => s.data.map((d) => d.timestamp))
        );

        const firstTimestamp = Math.min(...timestamps);

        const data = timestamps.map((t) => ({
          timestamp: (t - firstTimestamp) / 60,

          ...Object.fromEntries(
            filteredSeries
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
                  {filteredSeries.map((_s, si) => (
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
    </Container>
  );
}
