import axios from "axios";
import { Channel } from "./channel";

export interface Client {
  openChannel: (publicKey: string) => Promise<Channel>;
  closeChannel: (token: string) => Promise<void>;
  getChannel: (token: string) => Promise<Channel>;
  postMessage: (token: string, message: string) => Promise<void>;
  receiveMessages: (token: string, secret: string) => Promise<string[]>;
}

export class AxiosClient implements Client {
  public baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  public async openChannel(publicKey: string): Promise<Channel> {
    const result = await axios.post(this.baseURL + "/channels", {
      data: { publicKey }
    });

    return result.data;
  }

  public async closeChannel(token: string): Promise<void> {
    const result = await axios.delete(this.baseURL + "/channels/" + token);

    return;
  }

  public async getChannel(token: string): Promise<Channel> {
    const result = await axios.get(this.baseURL + "/channels/" + token);

    return result.data;
  }

  public async postMessage(token: string, message: string): Promise<void> {
    const result = await axios.post(
      this.baseURL + "/channels/" + token + "/messages",
      { data: { message } }
    );

    return;
  }

  public async receiveMessages(
    token: string,
    secret: string
  ): Promise<string[]> {
    const result = await axios.get(
      this.baseURL + "/channels/" + token + "/messages",
      { data: { secret } }
    );

    return result.data;
  }
}
