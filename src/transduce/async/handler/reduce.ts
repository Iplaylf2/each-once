import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";
import { OR } from "./tool";

interface ReduceFunction<T, K> {
  (r: K, x: T): K | Promise<K>;
}

export function reduce<T, K, R>(
  rf: ReduceFunction<OR<K, T>, R>,
  v: R,
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, R> {
  let r = v;
  let transduce: any = async (x: any) => ((r = await rf(r, x)), true),
    dispose: any;
  if (tf) {
    [transduce, dispose] = tf(transduce);
  }

  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        await dispose?.(false);

        return [true, r];
      }
    },
    async done() {
      await dispose?.(true);
      return r;
    },
  };
}
