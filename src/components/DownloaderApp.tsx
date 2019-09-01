import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AxiosClient } from "../client";
import { WebRTCDownloadChannel } from "../webrtc";

const client = new AxiosClient("http://localhost:3001");

export default function DownloaderApp() {
  const router = useRouter();
  const [remoteDescription, setRemoteDescription] = useState("");

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      const c = new WebRTCDownloadChannel();
      const r = JSON.parse(remoteDescription);
      c.answer(r).then(x => {
        console.log(JSON.stringify(x));
      });
    },
    [remoteDescription]
  );

  useEffect(() => {
    const token = (router.query.token || "").toString();
    client.getChannel(token).then(console.log);
  }, [router]);

  // const result = await axios.post(
  //   CHANNELS_URL,
  //   { data: { publicKey } }
  // );

  return (
    <div>
      <form method="get" action="#" onSubmit={onSubmit}>
        <input
          type="text"
          value={remoteDescription}
          onChange={e => setRemoteDescription(e.target.value)}
        />
      </form>
    </div>
  );
}
