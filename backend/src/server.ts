import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const server = app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`Backend listening on port ${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}. Closing server...`);
  await new Promise<void>((resolve) => {
    server.close(async () => {
      await prisma.$disconnect();
      resolve();
    });
  });
  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
