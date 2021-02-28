import { AsyncTransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";
import { OR } from "./tool";

interface Action<T> {
  (x: T): any;
}

export function foreach<T, K>(
  f: Action<OR<K, T>>,
  tf?: AsyncTransduceFunction<T, K>
): GroupByReduce<T, void> {
  let transduce: any = async (x: any) => (await f(x)) !== false,
    squeeze: any;
  [transduce, squeeze] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        isDone = true;
        return [true] as any;
      }
    },
    async done() {
      isDone = true;
      await squeeze?.();
      return;
    },

    get isDone() {
      return isDone;
    },
  };
}