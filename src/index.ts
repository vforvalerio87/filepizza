import { createDictionaryGenerator, createHexGenerator } from "./generators";
import { createServer } from "./http";
import { MemoryStorage } from "./storage";
import { TOPPINGS } from "./toppings";

const server = createServer(
  new MemoryStorage(
    createDictionaryGenerator(TOPPINGS, 5, "-"),
    createHexGenerator(256)
  )
);

const port = parseInt(process.env.PORT || "3001", 10);

server.listen(port);
