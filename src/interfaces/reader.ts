import { Readable } from "stream"

export interface Reader {
  readStream<P>(stream: Readable): Promise<P>
  readFile<P>(path: string): Promise<P>
  readBuffer<P>(context: Buffer): P
  readString<P>(context: string): P
}
