const that = this
console.log(that) // {}

function addFunc(num1: number, num2: number) {
    console.log('---- Function ----')
    console.log(this)
    console.log('that === this:   ', that === this)
    console.log('global === this: ', global === this)
    console.log('---- Function ----\n\n')
    return num1 + num2
}

const addArrowFunc = (num1: number, num2: number) => {
    console.log('---- Arrow Function ----')
    console.log(this)
    console.log('that === this:   ', that === this)
    // @ts-ignore
    console.log('global === this: ', global === this)
    console.log('---- Arrow Function ----\n\n')
    return num1 + num2
}

// this：从外部（全局环境）继承来的 this，node 中即空对象 {}
addArrowFunc(1, 1)
// this：调用 addFunc 的实例，node 中即 global
addFunc(1, 1)
// this：new 出来的 addFunc 实例
// new addFunc(1, 1);
// TypeError: addArrowFunc is not a constructor
// new addArrowFunc(1, 1);
