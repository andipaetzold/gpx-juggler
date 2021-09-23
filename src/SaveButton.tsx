import { Button } from "@mui/material";
import formatISO from "date-fns/formatISO";
import { sortBy, uniq } from "lodash";
import builder from "xmlbuilder";
import { GPXData } from "./types";
import FileSaver from "file-saver";
import slugify from "slugify";

interface Props {
  data: GPXData;
}

export function SaveButton({ data }: Props) {
  const handleClick = () => {
    const fileData = createXML(data);
    FileSaver.saveAs(
      new Blob([fileData], { type: "text/xml" }),
      `${slugify(data.name || "export")}.gpx`
    );
  };

  return (
    <Button variant="contained" onClick={handleClick}>
      Save
    </Button>
  );
}

function createXML({
  name,
  type,
  coordinate,
  cadence,
  elevation,
  heartrate,
  power,
}: GPXData): string {
  const timestamps = sortBy(
    uniq(
      [
        coordinate,
        ...(cadence ? [cadence] : []),
        ...(elevation ? [elevation] : []),
        ...(heartrate ? [heartrate] : []),
        ...(power ? [power] : []),
      ].flatMap((stream) => stream.data.map((d) => d.timestamp))
    )
  );
  const firstTimestamp = Math.min(...timestamps);

  const obj = {
    gpx: {
      "@creator": "GPX Juggler",
      "@xmlns": "http://www.topografix.com/GPX/1/1",
      "@version": "1.1",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@xsi:schemaLocation": [
        "http://www.topografix.com/GPX/1/1",
        "http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3",
        "http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd",
        "http://www.garmin.com/xmlschemas/TrackPointExtension/v1",
        "http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd",
      ].join(" "),
      metadata: {
        time: { "#text": formatISO(firstTimestamp * 1_000) },
      },
      trk: {
        name: { "#text": name },
        type: { "#text": type },
      },
      trkseg: {
        trkpt: timestamps.map((timestamp) => ({
          ...(coordinate.data.find((d) => d.timestamp === timestamp)
            ? {
                "@lat": coordinate.data.find((d) => d.timestamp === timestamp)!
                  .value[0],
                "@lon": coordinate.data.find((d) => d.timestamp === timestamp)!
                  .value[1],
              }
            : {}),
          time: { "#text": formatISO(timestamp * 1_000) },
          ...(elevation?.data.find((d) => d.timestamp === timestamp)
            ? {
                ele: {
                  "#text": elevation.data.find(
                    (d) => d.timestamp === timestamp
                  )!.value,
                },
              }
            : {}),
          extensions: {
            ...(power?.data.find((d) => d.timestamp === timestamp)
              ? {
                  power: {
                    "#text": power.data.find((d) => d.timestamp === timestamp)!
                      .value,
                  },
                }
              : {}),

            "gpxtpx:TrackPointExtension": {
              ...(heartrate?.data.find((d) => d.timestamp === timestamp)
                ? {
                    "gpxtpx:hr": {
                      "#text": heartrate.data.find(
                        (d) => d.timestamp === timestamp
                      )!.value,
                    },
                  }
                : {}),

              ...(cadence?.data.find((d) => d.timestamp === timestamp)
                ? {
                    "gpxtpx:cad": {
                      "#text": cadence.data.find(
                        (d) => d.timestamp === timestamp
                      )!.value,
                    },
                  }
                : {}),
            },
          },
        })),
      },
    },
  };
  return builder.create(obj).end({ pretty: true });
}
