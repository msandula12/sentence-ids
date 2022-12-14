export function debounce(cb, delay = 250) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export function isEmptyList(list) {
  return !list || list.length === 0;
}

export function isEqualBy(first, second, ...keys) {
  return keys.every((key) => first[key] === second[key]);
}
