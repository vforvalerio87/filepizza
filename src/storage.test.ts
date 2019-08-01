import { MemoryStorage } from './storage'
import { createHexGenerator, createDictionaryGenerator } from './generators'

describe('MemoryStorage', () => {
  const DICTIONARY = [
    'FOO',
    'BAR',
    'BAZ'
  ]

  const tokenGenerator = createDictionaryGenerator(DICTIONARY, 4, '/');
  const secretGenerator = createHexGenerator(16);

  let storage
  let publicKey

  beforeEach(async () => {
    storage = new MemoryStorage(tokenGenerator, secretGenerator);
    publicKey = await createHexGenerator(4)();
  })

  it('opens channels', async () => {
    const channel = await storage.openChannel(publicKey)

    const tokenParts = channel.token.split('/');
    expect(tokenParts.length).toEqual(4)
    for (const p of tokenParts) {
      expect(DICTIONARY).toContain(p)
    }

    expect(channel.secret).toMatch(/^[a-f0-9]{32}$/)
    expect(channel.publicKey).toEqual(publicKey)
  })

  it('retrieves channels by token, hiding the secret', async () => {
    const channel = await storage.openChannel(publicKey)
    const retrievedChannel = await storage.getChannel(channel.token)
    expect(retrievedChannel.token).toEqual(channel.token)
    expect(retrievedChannel.secret).toEqual(undefined)
    expect(retrievedChannel.publicKey).toEqual(publicKey)
  })

  it('closes channels', async () => {
    const channel = await storage.openChannel(publicKey)
    await storage.closeChannel(channel.token)

    const retrievedChannel = await storage.getChannel(channel.token)
    expect(retrievedChannel).toBeNull()
  })

  it('posts messages to a channel token', async () => {
    const channel = await storage.openChannel(publicKey)

    const gen = createHexGenerator(4);
    const messages = [];
    for (let i = 0; i < 4; i++) {
      const msg = gen()
      messages.push(msg)
      await storage.postMessage(channel.token, msg);
    }

    const receivedMessages = await storage.receiveMessages(channel.token, channel.secret)
    expect(receivedMessages).toEqual(messages)
  })
})
