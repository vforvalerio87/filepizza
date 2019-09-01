import { ec as EC } from "elliptic";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AxiosClient } from "../client";
import { WebRTCUploadChannel } from "../webrtc";
import FileGallery from "./FileGallery";
import Logo from "./Logo";
import UploadOptions from "./UploadOptions";

const client = new AxiosClient("http://localhost:3001");

export default function UploaderApp() {
  const [files, setFiles] = useState([]);
  const [channel, setChannel] = useState(null);
  const [connection, setConnection] = useState(null);
  const [remoteDescription, setRemoteDescription] = useState("");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onDrop = useCallback(
    acceptedFiles => {
      const newFiles = files.concat(acceptedFiles);
      setFiles(newFiles);
    },
    [files, setFiles]
  );

  const onStart = useCallback(() => {
    const ec = new EC("ed25519");

    const key = ec.genKeyPair();
    const publicKey = key.getPublic().encode("hex");

    client.openChannel(publicKey).then(async result => {
      setChannel(result);

      const conn = new WebRTCUploadChannel("channel");
      setConnection(conn);

      const desc = await conn.open();
      console.log(desc);
    });
  }, [setChannel, setConnection]);

  return (
    <div className="wrapper" {...getRootProps()}>
      <div>
        <Logo />
        {files.length > 0 ? (
          <>
            <FileGallery files={files} />
            <UploadOptions />
            <button onClick={onStart}>start</button>
          </>
        ) : (
          <>
            <p>Free peer-to-peer file transfers in your browser.</p>
            <p>We never store anything. Files only served fresh.</p>
            <input {...getInputProps()} />
            <button>select a file</button>
          </>
        )}
      </div>
      <style jsx>{`
        .wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        button {
        }
      `}</style>
    </div>
  );
}
