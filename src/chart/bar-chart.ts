import { createCanvas } from "canvas"
import { max, min, scaleBand, scaleLinear } from "d3"

import { BarChartOptions } from "../interfaces/chart"

export class BarChart {
  public options: BarChartOptions

  public constructor(options: Partial<BarChartOptions> = {}) {
    this.options = {
      width: options.width || 800,
      height: options.height || 400,
    }
  }

  public draw(labels: string[], datas: number[][]) {
    const canvas = createCanvas(this.options.width, this.options.height)
    const context = canvas.getContext("2d")

    const margin = {top: 20, right: 20, bottom: 30, left: 40}
    const width = canvas.width - margin.left - margin.right
    const height = canvas.height - margin.top - margin.bottom

    context.translate(margin.left, margin.top)

    context.strokeStyle = "#ffffff"
    context.fillStyle = "#ffffff"

    const x = scaleBand()
      .rangeRound([0, width])
      .padding(0.1)
      .domain(labels)

    const yMin = min(datas, d => min(d)!)!
    const yMax = max(datas, d => max(d)!)!
    const y = scaleLinear()
      .rangeRound([height, 0])
      .domain([yMin - (yMax - yMin) * 0.03, yMax])

    const yTickCount = 10
    const yTicks = y.ticks(yTickCount)

    context.beginPath()
    x.domain().forEach((label) => {
      context.moveTo((x(label) || 0) + x.bandwidth() / 2, height)
      context.lineTo((x(label) || 0) + x.bandwidth() / 2, height + 6)
    })
    context.stroke()

    context.textAlign = "center"
    context.textBaseline = "top"
    x.domain().forEach((label) => {
      context.fillText(label, (x(label) || 0) + x.bandwidth() / 2, height + 6)
    })

    context.beginPath()
    yTicks.forEach((d) => {
      context.moveTo(0, y(d) + 0.5)
      context.lineTo(-6, y(d) + 0.5)
    })
    context.stroke()

    context.textAlign = "right"
    context.textBaseline = "middle"
    yTicks.forEach((d) => {
      context.fillText(d + "", -9, y(d))
    })

    context.beginPath()
    context.moveTo(-6.5, 0 + 0.5)
    context.lineTo(0.5, 0 + 0.5)
    context.lineTo(0.5, height + 0.5)
    context.lineTo(-6.5, height + 0.5)
    context.stroke()

    context.fillStyle = "steelblue"
    labels.forEach((label, labelIndex) => {
      datas.forEach((data) => {
        if (data[labelIndex]) {
          context.fillRect(x(label)!, y(data[labelIndex]), x.bandwidth(), height - y(data[labelIndex]))
        }
      })
    })

    return canvas
  }
}
