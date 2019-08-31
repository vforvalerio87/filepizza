import React, {useCallback, useState, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import axios from 'axios'
import { WebRTCUploadChannel } from '../webrtc'

const CHANNELS_URL = 'http://localhost:3001/channels';

export default function UploaderApp() {
  const [files, setFiles] = useState([])
  const [channel, setChannel] = useState(null)
  const [connection, setConnection] = useState(null)

  const onDrop = useCallback(
    acceptedFiles => {
      const newFiles = files.concat(acceptedFiles)
      setFiles(newFiles)
    },
    [files, setFiles]
  )

  const onStart = useCallback(
    async () => {
      const publicKey = 'foobar' // TODO(@kern): Generate public key

      const result = await axios.post(
        CHANNELS_URL,
        { data: { publicKey } }
      );

      setChannel(result.data);

      const conn = new WebRTCUploadChannel("channel");
      setConnection(conn)

      const remoteDescription = await conn.open()
      console.log(remoteDescription)
    },
    [setChannel, setConnection]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const [remoteDescription, setRemoteDescription] = useState("")

  const onSubmit = useCallback(e => {
    e.preventDefault()
    const r = JSON.parse(remoteDescription)
    connection.start(r).then(x => {
      console.log(JSON.stringify(x))
    })
  }, [connection, remoteDescription])


  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
        }
        <div>
          {files.map(f => (<li key={f.name}>{f.name}</li>))}
        </div>
      </div>
      {channel || files.length === 0
        ? null
        : <button onClick={onStart}>Start</button>}
      <form method="get" action="#" onSubmit={onSubmit}>
        <input
          type="text"
          value={remoteDescription}
          onChange={e => setRemoteDescription(e.target.value)}
        />
      </form>
    </div>
  )
}
