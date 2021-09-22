import { Stream } from "./types";
import { Button } from "@mui/material";
import styles from "./LoadButton.module.scss";
import { ChangeEvent, useRef } from "react";
import { loadGPXFile } from "./services/loaders/GPXLoader";

interface Props {
  addStream: (stream: Stream) => void;
}

export function LoadButton({ addStream }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    for (let i = 0; i < event.target.files.length; i++) {
      try {
        const stream = await parseFile(event.target.files[i]);
        stream.forEach((s) => addStream(s));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleButtonClick = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.value = "";
    inputRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        accept=".gpx"
        ref={inputRef}
        onChange={handleFileChange}
        className={styles.Input}
      />
      <Button variant="contained" onClick={handleButtonClick}>
        Load GPX
      </Button>
    </>
  );
}

async function parseFile(file: File): Promise<Stream[]> {
  if (!file.name.endsWith(".gpx")) {
    throw new Error("Unsupported file type");
  }

  return await loadGPXFile(file);
}
