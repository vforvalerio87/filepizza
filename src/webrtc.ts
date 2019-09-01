export class WebRTCUploadChannel {
  public connection: RTCPeerConnection;
  public channel: RTCDataChannel;

  constructor(dataChannelName: string) {
    this.connection = new RTCPeerConnection();
    this.connection.onicecandidate = this.handleIceCandidate;

    this.channel = this.connection.createDataChannel(dataChannelName);
    this.channel.onopen = this.handleChannelStatusChange;
    this.channel.onclose = this.handleChannelStatusChange;
  }

  public handleChannelStatusChange = () => {
    console.log(this.channel.readyState);
  };

  public handleIceCandidate = async e => {
    console.log(e);
  };

  public async open(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);
    return this.connection.localDescription;
  }

  public async start(
    remoteDescription: RTCSessionDescriptionInit
  ): Promise<void> {
    await this.connection.setRemoteDescription(remoteDescription);
  }
}

export class WebRTCDownloadChannel {
  public connection: RTCPeerConnection;
  public channel: RTCDataChannel;

  constructor() {
    this.connection = new RTCPeerConnection();
    this.connection.ondatachannel = this.handleChannel;
    this.connection.onicecandidate = this.handleIceCandidate;
  }

  public handleChannel = event => {
    this.channel = event.channel;
    this.channel.onmessage = this.handleReceiveMessage;
    this.channel.onopen = this.handleChannelStatusChange;
    this.channel.onclose = this.handleChannelStatusChange;
  };

  public handleIceCandidate = async e => {
    console.log(e);
  };

  public handleReceiveMessage = event => {
    console.log("received", event);
  };

  public handleChannelStatusChange = () => {
    console.log(
      "Receive channel's status has changed to " + this.channel.readyState
    );

    // Here you would do stuff that needs to be done
    // when the channel's status changes.
  };

  public async answer(
    remoteDescription: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> {
    await this.connection.setRemoteDescription(remoteDescription);

    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);
    return this.connection.localDescription;
  }
}
