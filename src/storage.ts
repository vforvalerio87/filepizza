import { StringGenerator } from './generators';

export interface Channel {
  token: string;
  secret?: string;
  publicKey: string;
}

export interface Storage {
  openChannel: (publicKey: string) => Promise<Channel>;
  closeChannel: (token: string) => Promise<void>;
  getChannel: (token: string) => Promise<Channel>;
  postMessage: (token: string, message: string) => Promise<void>;
  receiveMessages: (token: string, secret: string) => Promise<Array<string>>;
}

export class MemoryStorage implements Storage {
  tokenGenerator: StringGenerator;
  secretGenerator: StringGenerator;
  channels: { [token: string]: Channel };
  channelMessages: { [token: string]: Array<string> };

  constructor(tokenGenerator: StringGenerator, secretGenerator: StringGenerator) {
    this.channels = {};
    this.channelMessages = {};
    this.tokenGenerator = tokenGenerator
    this.secretGenerator = secretGenerator
  }

  async openChannel(publicKey: string): Promise<Channel> {
    const token = await this.tokenGenerator();
    const secret = await this.secretGenerator();

    const channel: Channel = {
      token,
      secret,
      publicKey
    }
    this.channels[token] = channel;
    this.channelMessages[token] = [];

    return channel
  }

  async closeChannel(token: string): Promise<void> {
    delete this.channels[token];
    delete this.channelMessages[token];
  }

  async getChannel(token: string): Promise<Channel | null> {
    let channel = this.channels[token];
    if (!channel) {
      return null
    }

    channel = { ...channel, secret: null }

    return channel;
  }

  async postMessage(token: string, message: string): Promise<void> {
    const channel = this.channels[token]
    if (!channel) {
      return
    }

    const messages = this.channelMessages[token];
    messages.push(message);
  }

  async receiveMessages(token: string, secret: string): Promise<Array<string>> {
    const channel = this.channels[token]
    if (!channel || secret !== channel.secret) {
      return []
    }

    return this.channelMessages[token];
  }
}
