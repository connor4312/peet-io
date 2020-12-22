export const classes = (...classes: (string | null | false | undefined)[]) =>
  classes.filter((c) => !!c).join(' ');

export const memoize = <A extends unknown[], T>(
  fn: (...args: A) => T,
  map: (...args: A) => unknown = (...a) => a[0],
): ((...args: A) => T) => {
  const fns = new Map<unknown, T>();
  return (...args) => {
    const key = map(...args);
    if (fns.has(key)) {
      return fns.get(key) as T;
    }

    const value = fn(...args);
    fns.set(key, value);
    return value;
  };
};

const unset = Symbol('unset');

export const once = <T, Args extends unknown[]>(
  fn: (...args: Args) => T,
): ((...args: Args) => T) => {
  let value: T | typeof unset = unset;
  return (...args) => {
    if (value === unset) {
      value = fn(...args);
    }

    return value;
  };
};
