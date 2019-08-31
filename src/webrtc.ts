export class WebRTCUploadChannel {
  connection: RTCPeerConnection;
  channel: RTCDataChannel;

  constructor(dataChannelName: string) {
    this.connection = new RTCPeerConnection();
    this.connection.onicecandidate = this.handleIceCandidate;

    this.channel = this.connection.createDataChannel(dataChannelName);
    this.channel.onopen = this.handleChannelStatusChange;
    this.channel.onclose = this.handleChannelStatusChange;
  }

  handleChannelStatusChange = () => {
    console.log(this.channel.readyState);
  }

  handleIceCandidate = async e => {
    console.log(e);
  }

  async open(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);
    return this.connection.localDescription;
  }

  async start(remoteDescription: RTCSessionDescriptionInit): Promise<void> {
    await this.connection.setRemoteDescription(remoteDescription);
  }
}

export class WebRTCDownloadChannel {
  connection: RTCPeerConnection;
  channel: RTCDataChannel;

  constructor() {
    this.connection = new RTCPeerConnection();
    this.connection.ondatachannel = this.handleChannel;
    this.connection.onicecandidate = this.handleIceCandidate;
  }

  handleChannel = event => {
    this.channel = event.channel;
    this.channel.onmessage = this.handleReceiveMessage;
    this.channel.onopen = this.handleChannelStatusChange;
    this.channel.onclose = this.handleChannelStatusChange;
  }

  handleIceCandidate = async e => {
    console.log(e)
  }

  handleReceiveMessage = event => {
    console.log('received', event)
  }

  handleChannelStatusChange = () => {
    console.log(
      "Receive channel's status has changed to " +
      this.channel.readyState
    );

    // Here you would do stuff that needs to be done
    // when the channel's status changes.
  }

  async answer(remoteDescription: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    await this.connection.setRemoteDescription(remoteDescription);

    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);
    return this.connection.localDescription;
  }
}
