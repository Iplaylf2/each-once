import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/sync/type";

interface ReduceFunction<T, K> {
  (r: K, x: T): K;
}

export function reduce<T extends TransduceFunction<any, any>, K>(
  tf: T,
  rf: ReduceFunction<TransduceFunctionOut<T>, K>,
  v: K
) {
  return function (iter: Iterable<TransduceFunctionIn<T>>): K {
    let r = v;
    const [transduce, squeeze] = tf((x) => ((r = rf(r, x)), true));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return r;
      }
    }

    squeeze?.();
    return r;
  };
}
