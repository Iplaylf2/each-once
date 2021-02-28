# each-once 

For each item in collection once.

## feature

- Easy to use.
- Data structure is basic.
- Efficient.

## install

``` bash
npm install each-once
```

## usage

``` typescript
import { combine, map, filter, take, reduce } from "each-once";

const tf = combine(
  map((x: number) => x * 2),
  filter((x: number) => x % 4 === 0),
  take<number>(10)
);

const transduce = reduce((r, x) => r + x, 0, tf);

const s = function* () {
  let x = 0;
  while (true) {
    yield x++;
  }
};

const result = transduce(s()); // transduce([0, 1, 2...])

console.log(result); // 180

```

## benchmark

Benchmark which map n times and reduce once. [from benchmark.ts](https://github.com/Iplaylf2/each-once/blob/main/debug/benchmark.ts)

array

|             | 100     | 1000  | 10000 | 100000 | (array length) |
| ----------- | ------- | ----- | ----- | ------ | -------------- |
| 2           | 1193319 | 28799 | 2688  | 195    |                |
| 3           | 199984  | 22248 | 2166  | 155    |                |
| 4           | 167229  | 17363 | 1685  | 126    |                |
| 5           | 144092  | 14313 | 1356  | 96.84  |                |
| (map times) |         |       |       |        | (ops/sec)      |

each-once

|             | 100    | 1000  | 10000 | 100000 | (array length) |
| ----------- | ------ | ----- | ----- | ------ | -------------- |
| 2           | 524905 | 50661 | 5370  | 562    |                |
| 3           | 373222 | 38385 | 4066  | 397    |                |
| 4           | 284126 | 31329 | 3133  | 315    |                |
| 5           | 233850 | 25214 | 2499  | 242    |                |
| (map times) |        |       |       |        | (ops/sec)      |

each-once is more efficient than native array method!