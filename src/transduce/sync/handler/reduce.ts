import { TransduceFunction, TransduceHandler } from "../type";
import { OR } from "./tool";

interface ReduceFunction<T, K> {
  (r: K, x: T): K;
}

export function reduce<T, K, R>(
  rf: ReduceFunction<OR<K, T>, R>,
  v: R,
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, R> {
  let r = v;
  let transduce: any = (x: any) => ((r = rf(r, x)), true),
    dispose: any;
  [transduce, dispose] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    reduce(x) {
      const continue_ = transduce(x);
      if (continue_) {
        return [false];
      } else {
        dispose?.(false);
        isDone = true;
        return [true, r];
      }
    },
    done() {
      isDone = true;
      dispose?.(true);
      return r;
    },
  };
}
