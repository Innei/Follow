import { app } from "../server/index"

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit("request", req, res)
}
