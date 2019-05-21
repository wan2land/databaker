import "jest"

import { createReadStream, readFileSync } from "fs"

import { CsvReader } from "../../src/reader/csv-reader"


const expected = require("../stubs/data.json") // eslint-disable-line

interface DataRow {
  letter: string
  frequency: string
}

describe("testsuite of reader/csv-reader", () => {
  const reader = new CsvReader()

  it("test readStream", async () => {
    const rows = await reader.readStream<DataRow[]>(createReadStream(__dirname + "/../stubs/data.csv"))
    expect(rows.map(({letter, frequency}) => ({letter, frequency: +frequency}))).toEqual(expected)
  })

  it("test readFile", async () => {
    const rows = await reader.readFile<DataRow[]>(__dirname + "/../stubs/data.csv")
    expect(rows.map(({letter, frequency}) => ({letter, frequency: +frequency}))).toEqual(expected)
  })

  it("test readBuffer", async () => {
    const rows = await reader.readBuffer<DataRow[]>(readFileSync(__dirname + "/../stubs/data.csv"))
    expect(rows.map(({letter, frequency}) => ({letter, frequency: +frequency}))).toEqual(expected)
  })

  it("test readString", async () => {
    const rows = await reader.readString<DataRow[]>(readFileSync(__dirname + "/../stubs/data.csv").toString())
    expect(rows.map(({letter, frequency}) => ({letter, frequency: +frequency}))).toEqual(expected)
  })
})
