export type StreamType =
  | "heartrate"
  | "power"
  | "cadence"
  | "elevation"
  | "coordinate";

export interface BaseStream<Type extends StreamType, Value> {
  type: Type;
  data: {
    timestamp: number;
    value: Value;
  }[];
}

export type HeartRateStream = BaseStream<"heartrate", number>;
export type CadenceStream = BaseStream<"cadence", number>;
export type PowerStream = BaseStream<"power", number>;
export type ElevationStream = BaseStream<"elevation", number>;
export type CoordinateStream = BaseStream<
  "coordinate",
  [latitude: number, longitude: number]
>;

export type Stream =
  | HeartRateStream
  | CadenceStream
  | PowerStream
  | ElevationStream
  | CoordinateStream;

export interface GPXData {
  name: string;
  type: number;
  coordinate: CoordinateStream;
  heartrate?: HeartRateStream;
  cadence?: CadenceStream;
  power?: PowerStream;
  elevation?: ElevationStream;
}
