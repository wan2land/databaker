import { Canvas } from "canvas/types"
import { Readable } from "stream"

import { Image } from "../interfaces/image"
import { streamToBuffer, streamToFile } from "../utils/stream"

const OSC = "\u001B]"
const BEL = "\u0007"

export class CanvasImage implements Image {
  public constructor(public canvas: Canvas) {
  }

  public save(filename: string): Promise<void> {
    return streamToFile(this.canvas.createPNGStream(), filename)
  }

  public async show(): Promise<void> {
    if (process.env && process.env.TERM_PROGRAM === "iTerm.app") {
      const body = (await streamToBuffer(this.canvas.createPNGStream())).toString("base64")
      process.stdout.write(`${OSC}1337;File=inline=1:${body}${BEL}\n`)
    } else {
      throw new Error("show method is only available in iTerm2.")
    }
  }

  public stream(): Readable {
    return this.canvas.createPNGStream()
  }
}
