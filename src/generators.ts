import * as cryptoPromise from 'crypto-promise';

export type StringGenerator = () => Promise<string>;

export function createHexGenerator(length: number): StringGenerator {
  return async () => {
    const rand = await cryptoPromise.randomBytes(length)
    return rand.toString('hex')
  }
}

export function createDictionaryGenerator(dictionary: Array<string>, length: number, separator: string): StringGenerator {
  const dictLength = dictionary.length

  return async () => {
    const result = []
    for (let i = 0; i < length; i++) {
      const item = dictionary[Math.floor(Math.random() * dictLength)];
      result.push(item);
    }    

    return result.join(separator)
  }
}
