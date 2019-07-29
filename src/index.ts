import { createServer } from './http';
import { MemoryStorage } from './storage';
import { createHexGenerator, createDictionaryGenerator } from './generators';
import { TOPPINGS } from './toppings';

const server = createServer(
  new MemoryStorage(
    createHexGenerator(16),
    createDictionaryGenerator(TOPPINGS, 5, '/')
  )
)

const port = parseInt(process.env.PORT || '3000', 10);

server.listen(port);
