import { Converter } from "csvtojson/v2/Converter"
import { Readable } from "stream"

import { Reader } from "../interfaces/reader"


export class CsvReader implements Reader {
  public async readStream<P>(stream: Readable): Promise<P> {
    return await (new Converter()).fromStream(stream) as any
  }

  public async readFile<P>(path: string): Promise<P> {
    return await (new Converter()).fromFile(path) as any
  }

  public readBuffer<P>(context: Buffer): P {
    return (new Converter()).fromString(context.toString()) as any
  }

  public readString<P>(context: string): P {
    return (new Converter()).fromString(context) as any
  }
}
