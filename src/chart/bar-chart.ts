import { createCanvas } from "canvas"
import { rgb } from "d3-color"
import { scaleBand, scaleLinear } from "d3-scale"

import { CanvasImage } from "../image/canvas-image"
import { BarChartOptions } from "../interfaces/chart"
import { Image } from "../interfaces/image"

export class BarChart {

  public options: BarChartOptions

  public constructor(options: Partial<BarChartOptions> = {}) {
    this.options = {
      borderColor: options.borderColor || "#FFFFFF",
      textColor: options.textColor || "#FFFFFF",
      barColors: options.barColors && options.barColors.length ? options.barColors : [
        "#0074D9",
        "#B10DC9",
        "#7FDBFF",
        "#F012BE",
        "#39CCCC",
        "#85144b",
        "#3D9970",
        "#FF4136",
        "#2ECC40",
        "#FF851B",
        "#01FF70",
        "#FFDC00",
      ],
      width: options.width || 800,
      height: options.height || 400,
    }
  }

  public draw(labels: string[], datas: number[][]): Image {
    const canvas = createCanvas(this.options.width, this.options.height)

    const margin = {top: 20, right: 20, bottom: 30, left: 40}
    const width = canvas.width - margin.left - margin.right
    const height = canvas.height - margin.top - margin.bottom
    const borderColor = rgb(this.options.borderColor)!

    const x = scaleBand()
      .padding(0.1)
      .rangeRound([0, width])
      .domain(labels)

    const yMin = Math.min(...datas.map(d => Math.min(...d)))
    const yMax = Math.max(...datas.map(d => Math.max(...d)))
    const y = scaleLinear()
      .rangeRound([height, 0])
      .domain([yMin - (yMax - yMin) * 0.03, yMax])

    const yTickCount = 10
    const yTicks = y.ticks(yTickCount)

    // draw
    const context = canvas.getContext("2d")
    context.translate(margin.left, margin.top)

    // draw axis
    context.beginPath()
    context.moveTo(0.5, .5)
    context.lineTo(0.5, height + .5)
    context.lineTo(width, height + .5)

    x.domain().forEach((label) => {
      const xPx = x(label)! + x.bandwidth() / 2
      context.moveTo(xPx, height)
      context.lineTo(xPx, height + 6)
    })
    context.strokeStyle = borderColor.toString()
    context.stroke()

    context.beginPath()
    yTicks.forEach((d) => {
      const yPx = y(d) + 0.5
      context.moveTo(0, yPx)
      context.lineTo(width, yPx)
    })
    borderColor.opacity = 0.2
    context.strokeStyle = borderColor + ""
    context.stroke()

    context.fillStyle = this.options.textColor
    context.textAlign = "center"
    context.textBaseline = "top"
    x.domain().forEach((label) => {
      context.fillText(label, x(label)! + x.bandwidth() / 2, height + 7)
    })

    context.textAlign = "right"
    context.textBaseline = "middle"
    yTicks.forEach((d) => {
      context.fillText(d + "", -9, y(d))
    })


    const bar = scaleBand()
      .padding(0.2)
      .rangeRound([0, x.bandwidth()])
      .domain(Object.keys(datas))

    labels.forEach((label, labelIndex) => {
      datas.forEach((data, dataIndex) => {
        context.fillStyle = this.options.barColors[dataIndex % this.options.barColors.length]
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
