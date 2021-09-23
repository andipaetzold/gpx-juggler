import { BaseStream, GPXData, StreamType } from "../../types";
import { readFileAsString } from "../../util";
import { parse as parseXml, X2jOptionsOptional } from "fast-xml-parser";
import parseISO from "date-fns/parseISO";
import getUnixTime from "date-fns/getUnixTime";
import range from "lodash/range";

const options: X2jOptionsOptional = {
  arrayMode: true,
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseAttributeValue: true,
};

export async function loadGPXFile(file: File): Promise<GPXData> {
  const fileData = await readFileAsString(file);
  const xml = parseXml(fileData, options);

  const trk = xml.gpx[0].trk[0];
  const trackPoints: any[] = trk.trkseg[0].trkpt;

  return {
    name: trk.name,
    type: trk.type,
    coordinate: getStream<[number, number], "coordinate">(
      trackPoints,
      "coordinate",
      getCoordinateFromTrackPoint
    ),
    cadence: getStream<number, "cadence">(
      trackPoints,
      "cadence",
      getCadenceFromTrackPoint
    ),
    elevation: getStream<number, "elevation">(
      trackPoints,
      "elevation",
      getElevationFromTrackPoint
    ),
    heartrate: getStream<number, "heartrate">(
      trackPoints,
      "heartrate",
      getHeartRateFromTrackPoint
    ),
    power: getStream<number, "power">(
      trackPoints,
      "power",
      getPowerFromTrackPoint
    ),
  };
}

function getStream<StreamValue, Type extends StreamType, TrackPoint = any>(
  trackPoints: TrackPoint[],
  type: Type,
  getter: (trackPoint: TrackPoint) => any
): BaseStream<Type, StreamValue> {
  return {
    type: type,
    data: range(0, trackPoints.length).map((i) => ({
      timestamp: getTimestampFromTrackPoint(trackPoints[i]),
      value: getter(trackPoints[i]),
    })),
  };
}

function getTimestampFromTrackPoint(trackPoint: any): number {
  return getUnixTime(parseISO(trackPoint.time));
}

function getHeartRateFromTrackPoint(trackPoint: any): number | null {
  return (
    trackPoint.extensions?.[0]?.["gpxtpx:TrackPointExtension"]?.[0]?.[
      "gpxtpx:hr"
    ] ?? null
  );
}

function getCadenceFromTrackPoint(trackPoint: any): number | null {
  return (
    trackPoint.extensions?.[0]?.["gpxtpx:TrackPointExtension"]?.[0]?.[
      "gpxtpx:cad"
    ] ?? null
  );
}

function getCoordinateFromTrackPoint(
  trackPoint: any
): [latitude: number, longitude: number] {
  return [trackPoint.lat, trackPoint.lon];
}

function getPowerFromTrackPoint(trackPoint: any): number | null {
  return trackPoint.extensions?.[0]?.power ?? null;
}

function getElevationFromTrackPoint(trackPoint: any): number | null {
  return trackPoint.ele ?? null;
}
