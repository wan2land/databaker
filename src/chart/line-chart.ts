import { createCanvas } from "canvas"
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale"
import { schemeCategory10 } from "d3-scale-chromatic"

import { CanvasImage } from "../image/canvas-image"
import { LineChartOptions } from "../interfaces/chart"
import { Image } from "../interfaces/image"
import { drawAxis } from "./utils"

export class LineChart {

  public options: LineChartOptions

  public constructor(options: Partial<LineChartOptions> = {}) {
    this.options = {
      borderColor: options.borderColor || "#FFFFFF",
      textColor: options.textColor || "#FFFFFF",
      lineColors: options.lineColors,
      width: options.width || 800,
      height: options.height || 400,
    }
  }

  public draw(labels: string[], datas: number[][]): Image {
    const canvas = createCanvas(this.options.width, this.options.height)

    const margin = {top: 20, right: 20, bottom: 30, left: 40}
    const width = canvas.width - margin.left - margin.right
    const height = canvas.height - margin.top - margin.bottom

    const x = scaleBand()
      .padding(0.1)
      .rangeRound([0, width])
      .domain(labels)

    const yMin = Math.min(...datas.map(d => Math.min(...d)))
    const yMax = Math.max(...datas.map(d => Math.max(...d)))
    const y = scaleLinear()
      .rangeRound([height, 0])
      .domain([yMin - (yMax - yMin) * 0.03, yMax])

    // draw
    const context = canvas.getContext("2d")
    context.translate(margin.left, margin.top)

    // draw axis
    drawAxis(context, width, height, x, y, this.options)

    const colorScale = scaleOrdinal(schemeCategory10)
    const lineColors = this.options.lineColors && this.options.lineColors.length
      ? this.options.lineColors && this.options.lineColors
      : datas.map((_, index) => colorScale(index + ""))
    const xWidth = x.bandwidth() / 2
    datas.forEach((data, dataIndex) => {
      context.beginPath()
      context.lineWidth = 1.5
      context.strokeStyle = lineColors[dataIndex % lineColors.length]
      let isFirst = true
      labels.forEach((label, labelIndex) => {
        if (isFirst) {
          isFirst = false
          context.moveTo(xWidth + x(label)!, y(data[labelIndex]))
        } else {
          context.lineTo(xWidth + x(label)!, y(data[labelIndex]))
        }
        // if (data[labelIndex]) {
        // }
      })
      context.stroke()
    })

    return new CanvasImage(canvas)
  }
}
