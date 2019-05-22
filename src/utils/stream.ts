import { createWriteStream } from "fs"
import { Readable, Writable } from "stream"

export function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.from("")
    stream.on("data", (chunk) => buffer = Buffer.concat([buffer, chunk]))
    stream.on("error", (e) => reject(e))
    stream.on("end", () => resolve(buffer))
    stream.on("close", () => resolve(buffer))
  })
}

export function streamToStream(stream: Readable, output: Writable): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.pipe(output)
    stream.on("error", (e) => reject(e))
    stream.on("end", () => resolve())
    stream.on("close", () => resolve())
  })
}

export function streamToFile(stream: Readable, filename: string): Promise<void> {
  return streamToStream(stream, createWriteStream(filename))
}
