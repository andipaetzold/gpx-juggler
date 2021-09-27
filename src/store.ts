import create from "zustand";
import { GPXData, StreamType } from "./types";
import { nanoid } from "nanoid";

interface State {
  streams: {
    [type in StreamType]: {
      enabledFiles: string[];
      aggregation: "average";
    };
  };

  files: Array<{ id: string } & GPXData>;
  addFile: (data: GPXData) => void;

  name: string;
  setName: (name: string) => void;

  type: number;
  setType: (type: number) => void;
}

export const useStore = create<State>((set) => ({
  files: [],
  name: "",
  type: 0,
  streams: {
    cadence: {
      enabledFiles: [],
      aggregation: "average",
    },
    coordinate: {
      enabledFiles: [],
      aggregation: "average",
    },
    elevation: {
      enabledFiles: [],
      aggregation: "average",
    },
    heartrate: {
      enabledFiles: [],
      aggregation: "average",
    },
    power: {
      enabledFiles: [],
      aggregation: "average",
    },
  },
  setName: (name: string) => set(() => ({ name })),
  setType: (type: number) => set(() => ({ type })),
  addFile: (data: GPXData) =>
    set((state) => {
      const id = nanoid();

      const addFileToStream = (streamType: StreamType) => ({
        ...state.streams[streamType],
        enabledFiles: [...state.streams[streamType].enabledFiles, id],
      });

      return {
        files: [...state.files, { ...data, id }],
        streams: {
          cadence: addFileToStream("cadence"),
          coordinate: addFileToStream("coordinate"),
          elevation: addFileToStream("elevation"),
          heartrate: addFileToStream("heartrate"),
          power: addFileToStream("power"),
        },
      };
    }),
}));
