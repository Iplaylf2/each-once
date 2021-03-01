import { TransduceFunction, TransduceHandler } from "../type";

export function count<T>(
  tf?: TransduceFunction<T, any>
): TransduceHandler<T, number> {
  let count = 0;
  let transduce: any = () => (count++, true),
    squeeze: any;
  [transduce, squeeze] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    reduce(x) {
      const continue_ = transduce(x);
      if (continue_) {
        return [false];
      } else {
        isDone = true;
        return [true, count];
      }
    },
    done() {
      isDone = true;
      squeeze?.();
      return count;
    },

    get isDone() {
      return isDone;
    },
  };
}