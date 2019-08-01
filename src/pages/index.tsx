import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import axios from 'axios'
import { createLibp2p } from 'libp2p'

export default function Home() {
  const [files, setFiles] = useState([])
  const [channel, setChannel] = useState(null)

  const onDrop = useCallback(
    acceptedFiles => {
      const newFiles = files.concat(acceptedFiles)
      setFiles(newFiles)
      console.log(files, acceptedFiles, newFiles)
    },
    [files, setFiles]
  )

  const onStart = useCallback(
    async () => {
      const publicKey = 'foobar'

      const result = await axios.post(
        'http://localhost:3001/channels',
        { data: { publicKey } }
      );

      setChannel(result.data);

      createLibp2p({}, (err, libp2p) => {
        console.error(err)

        libp2p.start((err) => {
          console.error(err)
          console.log(libp2p)
        })
      })

      console.log(result.data)
    },
    [setChannel]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

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
    </div>
  )
}
