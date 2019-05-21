import { Readable, Writable } from "stream"

const OSC = "\u001B]"
const BEL = "\u0007"

export class ImageWriter {
  public constructor(public stream: Writable = process.stdout) {
  }

  public writeStream(stream: Readable): Promise<void> {
    return new Promise((resolve) => {
      this.stream.write(`${OSC}1337;File=inline=1`)
      this.stream.write(":")
      let buf = new Buffer("")
      stream.on("data", (chunk) => buf = Buffer.concat([buf, chunk]))
      stream.on("end", () => {
        this.stream.write(`${buf.toString("base64")}${BEL}\n`)
        resolve()
      })
    })
  }
}
