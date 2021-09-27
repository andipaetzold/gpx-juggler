import { Button } from "@mui/material";
import { ChangeEvent, useRef } from "react";
import styles from "./LoadButton.module.scss";
import { loadGPXFile } from "./services/loaders/GPXLoader";
import { GPXData } from "./types";

interface Props {
  addGPXData: (data: GPXData) => void;
}

export function LoadButton({ addGPXData }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    for (let i = 0; i < event.target.files.length; i++) {
      try {
        const gpxData = await parseFile(event.target.files[i]);
        addGPXData(gpxData);
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
        multiple
        onChange={handleFileChange}
        className={styles.Input}
      />
      <Button variant="contained" onClick={handleButtonClick}>
        Load GPX
      </Button>
    </>
  );
}

async function parseFile(file: File): Promise<GPXData> {
  if (!file.name.endsWith(".gpx")) {
    throw new Error("Unsupported file type");
  }

  return await loadGPXFile(file);
}
