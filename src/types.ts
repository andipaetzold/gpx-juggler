export type SeriesType =
  | "heartrate"
  | "power"
  | "cadence"
  | "elevation"
  | "coordinate";

export interface BaseSeries<Type extends SeriesType, Value> {
  type: Type;
  data: {
    timestamp: number;
    value: Value;
  }[];
}

export type HeartRateSeries = BaseSeries<"heartrate", number>;
export type CadenceSeries = BaseSeries<"cadence", number>;
export type PowerSeries = BaseSeries<"power", number>;
export type ElevationSeries = BaseSeries<"elevation", number>;
export type CoordinateSeries = BaseSeries<
  "coordinate",
  [latitude: number, longitude: number]
>;

export type Series =
  | HeartRateSeries
  | CadenceSeries
  | PowerSeries
  | ElevationSeries
  | CoordinateSeries;
