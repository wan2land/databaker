import { rgb } from "d3-color"
import { ScaleBand, ScaleLinear } from "d3-scale"


export function drawAxis(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  x: ScaleBand<string>,
  y: ScaleLinear<number, number>,
  options: {borderColor: string, textColor: string}
) {
  const borderColor = rgb(options.borderColor)!

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

  const yTickCount = 10
  const yTicks = y.ticks(yTickCount)
  yTicks.forEach((d) => {
    const yPx = y(d) + 0.5
    context.moveTo(0, yPx)
    context.lineTo(width, yPx)
  })
  borderColor.opacity = 0.2
  context.strokeStyle = borderColor + ""
  context.stroke()

  context.fillStyle = options.textColor
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
}
