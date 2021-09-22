import shuffle from "lodash/shuffle";
import { SeriesType } from "./types";

export const SERIES_TYPES: SeriesType[] = [
  "heartrate",
  "power",
  "cadence",
  "elevation",
  "coordinate",
];

export const COLORS = shuffle([
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#9E9E9E",
  "#607D8B",
]);
