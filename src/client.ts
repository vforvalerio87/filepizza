import { Channel } from './channel';
import axios from 'axios'

export interface Client {
  openChannel: (publicKey: string) => Promise<Channel>;
  closeChannel: (token: string) => Promise<void>;
  getChannel: (token: string) => Promise<Channel>;
  postMessage: (token: string, message: string) => Promise<void>;
  receiveMessages: (token: string, secret: string) => Promise<Array<string>>;
}

export class AxiosClient implements Client {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async openChannel(publicKey: string): Promise<Channel> {
    const result = await axios.post(
      this.baseURL + '/channels',
      { data: { publicKey } }
    );

    return result.data;
  }

  async closeChannel(token: string): Promise<void>  {
    const result = await axios.delete(
      this.baseURL + '/channels/' + token
    );

    return;
  }

  async getChannel(token: string): Promise<Channel> {
    const result = await axios.get(
      this.baseURL + '/channels/' + token
    );

    return result.data;
  }

  async postMessage(token: string, message: string): Promise<void> {
    const result = await axios.post(
      this.baseURL + '/channels/' + token + '/messages',
      { data: { message } }
    );

    return;
  }

  async receiveMessages(token: string, secret: string): Promise<Array<string>> {
    const result = await axios.get(
      this.baseURL + '/channels/' + token + '/messages',
      { data: { secret } }
    );

    return result.data;
  }
}
