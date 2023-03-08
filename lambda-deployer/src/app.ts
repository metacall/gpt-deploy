import express,{Request, Response} from "express";
(await import("dotenv")).config();
import {api} from "./routes/index.js";
const app = express();
app.use(express.static("build"));
app.use("/api", api);

app.get("/", (_req: Request, res: Response) => {
  res.sendFile("index.html");
});

export default app;
