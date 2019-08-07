type SortFunc = (arr: number[]) => number[]

/**
 * 快排
 * @param arr
 */
export const quickSort: SortFunc = (arr) => {
  if (arr.length <= 1) return arr

  const left = 0
  const right = arr.length - 1
  const mid = Math.floor((left + right) / 2)
  const leftArr = []
  const rightArr = []
  const midArr = []

  for (const item of arr) {
    if (item < arr[mid]) leftArr.push(item)
    else if (item > arr[mid]) rightArr.push(item)
    else midArr.push(item)
  }

  return quickSort(leftArr).concat(midArr).concat(quickSort(rightArr))
}
