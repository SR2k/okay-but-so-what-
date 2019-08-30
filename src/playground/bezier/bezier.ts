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

const split = (t: number, x: number, y: number) => {
  return x + (y - x) * t
}

const bezier = (t: number, points: Point[]): Point => {
  if (points.length < 1) throw new TypeError('Bezier need at least 1 point')
  if (points.length === 1) return {
    x: points[0].x,
    y: points[0].y,
  }
  if (points.length === 2) return {
    x: split(t, points[0].x, points[1].x),
    y: split(t, points[0].y, points[1].y),
  }

  const newPoints = []
  for (let i = 1; i < points.length; i++) {
    newPoints.push({
      x: split(t, points[i - 1].x, points[i].x),
      y: split(t, points[i - 1].y, points[i].y),
    })
  }
  return bezier(t, newPoints)
}

const getBezier = (precision: number, ...points: Point[]) => {
  const results = []
  for (let t = 0; t <= 1; t += 1 / precision) {
    results.push(bezier(t, points))
  }
  return results
}

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
      return getBezier(
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
      return getBezier(this.precision, ...this.dots)
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
