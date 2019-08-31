import React, {useCallback, useState, useEffect} from 'react'
import { useRouter } from 'next/router';
import {useDropzone} from 'react-dropzone'
import { AxiosClient } from '../client'
import { WebRTCDownloadChannel } from '../webrtc'

export default function DownloaderApp() {
  const router = useRouter();
  const [remoteDescription, setRemoteDescription] = useState("")

  const client = new AxiosClient('http://localhost:3000')

  const onSubmit = useCallback(e => {
    e.preventDefault()
    const c = new WebRTCDownloadChannel()
    const r = JSON.parse(remoteDescription)
    c.answer(r).then(x => {
      console.log(JSON.stringify(x))
    })
  }, [remoteDescription])

  useEffect(() => {
    const token = (router.query.token || '').toString()
    client.getChannel(token).then(console.log)
  }, [router])

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
  )
}
