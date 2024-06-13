import { MLCEngineWorkerHandler, MLCEngine } from "https://esm.run/@mlc-ai/web-llm"

const engine = new MLCEngine()
const handler = new MLCEngineWorkerHandler(engine)

onmessage = msg => {
  console.log('Worker received message:', msg)
  handler.onmessage(msg)
}