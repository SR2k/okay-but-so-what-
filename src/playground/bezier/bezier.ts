interface Point {
  x: number
  y: number
}

declare function requestAnimationFrame(fn: Function): void

declare interface VueOptions {
  el: string
  data: any
  computed?: { [key: string]: Function }
  methods?: { [key: string]: Function }
}
declare class Vue {
  constructor(options: VueOptions)
}

/**
 * Split line by given ratio and line
 * @param t Current ratio
 * @param x1 Starting point x
 * @param y1 Starting point y
 * @param x2 Ending point x
 * @param y2 Ending point y
 */
const splitLine = (t: number, { x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point): Point => ({
  x: t * (x2 - x1) + x1,
  y: t * (y2 - y1) + y1,
})

/**
 * Calculate one point by given ratio and control points
 * @param t Current ratio
 * @param points Control points
 */
const getBezierPoint = (t: number, points: Point[]): Point => {
  if (points.length < 1) throw new TypeError('Bezier need at least 1 point')
  if (points.length === 1) return {
    x: points[0].x,
    y: points[0].y,
  }
  if (points.length === 2) return splitLine(t, points[0], points[1])

  const newPoints = []
  for (let i = 1; i < points.length; i++) {
    newPoints.push(splitLine(t, points[i - 1], points[i]))
  }
  return getBezierPoint(t, newPoints)
}

/**
 * Generate bezier curse
 * @param precision How many points there will be on the generated curse
 * @param points Control points
 */
const getBezierCurse = (precision: number, ...points: Point[]) => {
  const results = []
  for (let t = 0; t <= 1; t += 1 / precision) {
    results.push(getBezierPoint(t, points))
  }
  return results
}

/**
 * Normalize number
 */
const limit = (x: number) => {
  if (x >= 1) return 1
  if (x <= 0) return 0
  return parseFloat(x.toFixed(3))
}

const getMousePos = ({ clientX, clientY }: MouseEvent, point: Point) => {
  point.x = clientX
  point.y = clientY
}

const getTouchPos = ({ touches }: TouchEvent, point: Point) => {
  point.x = (touches[0].clientX)
  point.y = (touches[0].clientY)
}

function startMove(self: any, flag: string, evt: MouseEvent & TouchEvent) {
  const touch = (evt.type === 'touchstart')
  if (!touch && evt.button !== 0) return
  const events = touch ? {
    move: 'touchmove',
    stop: 'touchend',
  } : {
    move: 'mousemove',
    stop: 'mouseup',
  }
  const elem = (<any>evt.currentTarget).closest('svg')
  const point = elem.createSVGPoint()
  const transform = elem.getScreenCTM().inverse()
  const circlePos = typeof flag === 'string' ? (flag === 'a' ? self.a : self.b) : self.dots[flag]
  const getPos = touch ? getTouchPos : getMousePos

  let moving = true
  let newPt

  const updateFn = () => {
    if (moving) requestAnimationFrame(updateFn)

    newPt = point.matrixTransform(transform)
    const x = (newPt.x - 5) / 100
    const y = 1 - (newPt.y - 5) / 100

    circlePos.x = limit(x)
    circlePos.y = limit(y)
  }
  const moveFn = (evt: MouseEvent & TouchEvent) => getPos(evt, point)
  const stopFn = () => {
    moving = false
    elem.removeEventListener(events.move, moveFn)
    elem.removeEventListener(events.stop, stopFn)
  }

  requestAnimationFrame(updateFn)
  moveFn(evt)

  elem.addEventListener(events.move, moveFn)
  elem.addEventListener(events.stop, stopFn)
}

new Vue({
  el: '#cubicBezier',
  data: {
    a: {x: 0, y: 1},
    b: {x: 1, y: 0},
    precision: 100,
  },
  computed: {
    points() {
      return getBezierCurse(
        this.precision,
        {
          x: 0,
          y: 0,
        }, {
          x: this.a.x * 100,
          y: this.a.y * 100,
        }, {
          x: this.b.x * 100,
          y: this.b.y * 100,
        }, {
          x: 100,
          y: 100,
        },
      )
    },
  },
  methods: {
    startMove(flag: string, evt: MouseEvent & TouchEvent) {
      startMove(this, flag, evt)
    },
  }
})

new Vue({
  el: '#bezier',
  data: {
    precision: 100,
    dots: [
      {
        x: 0.199,
        y: 0.702,
      }, {
        x: 0.131,
        y: 0.455,
      }, {
        x: 0.666,
        y: 0.777,
      },
    ]
  },
  computed: {
    points() {
      return getBezierCurse(this.precision, ...this.dots)
    },
  },
  methods: {
    addDot() {
      this.dots.push({
        x: 0.5,
        y: 0.5
      })
    },
    removeDot(index: number) {
      this.dots.splice(index, 1)
    },
    startMove(flag: string, evt: MouseEvent & TouchEvent) {
      startMove(this, flag, evt)
    },
  }
})
