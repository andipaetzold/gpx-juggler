import { Stream, StreamType } from "../../types";
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

export async function loadGPXFile(file: File): Promise<Stream[]> {
  const fileData = await readFileAsString(file);
  const xml = parseXml(fileData, options);

  const trackPoints: any[] = xml.gpx[0].trk[0].trkseg[0].trkpt;

  const streams: Stream[] = [];

  Object.entries(valueGetter).forEach(([type, getter]) => {
    if (trackPoints.map(getter).every((value) => value === null)) {
      return;
    }

    const newStream: Stream = {
      type: type as StreamType,
      data: range(0, trackPoints.length).map((i) => ({
        timestamp: getTimestampFromTrackPoint(trackPoints[i]),
        value: getter(trackPoints[i]),
      })),
    };

    streams.push(newStream);
  });

  return streams;
}

function getTimestampFromTrackPoint(trackPoint: any): number {
  return getUnixTime(parseISO(trackPoint.time));
}

const valueGetter: { [type in StreamType]: (trackPoint: any) => any } = {
  heartrate: getHeartRateFromTrackPoint,
  cadence: getCadenceFromTrackPoint,
  coordinate: getCoordinateFromTrackPoint,
  elevation: getElevationFromTrackPoint,
  power: getPowerFromTrackPoint,
};

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
