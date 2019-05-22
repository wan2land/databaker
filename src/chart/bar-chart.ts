import { createCanvas } from "canvas"
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale"
import { schemeCategory10 } from "d3-scale-chromatic"

import { CanvasImage } from "../image/canvas-image"
import { BarChartOptions } from "../interfaces/chart"
import { Image } from "../interfaces/image"
import { drawAxis } from "./utils"

export class BarChart {

  public options: BarChartOptions

  public constructor(options: Partial<BarChartOptions> = {}) {
    this.options = {
      borderColor: options.borderColor || "#FFFFFF",
      textColor: options.textColor || "#FFFFFF",
      barColors: options.barColors,
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

    const bar = scaleBand()
      .padding(0.2)
      .rangeRound([0, x.bandwidth()])
      .domain(Object.keys(datas))


    const colorScale = scaleOrdinal(schemeCategory10)
    const barColors = this.options.barColors && this.options.barColors.length
      ? this.options.barColors && this.options.barColors
      : datas.map((_, index) => colorScale(index + ""))
    datas.forEach((data, dataIndex) => {
      context.fillStyle = barColors[dataIndex % barColors.length]
      labels.forEach((label, labelIndex) => {
        if (data[labelIndex]) {
          context.fillRect(
            x(label)! + bar(dataIndex + "")!,
            y(data[labelIndex]),
            bar.bandwidth(),
            height - y(data[labelIndex])
          )
        }
      })
    })

    return new CanvasImage(canvas)
  }
}
