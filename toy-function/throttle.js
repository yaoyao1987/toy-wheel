function throttle(fn, wait, options = {}) {
  let timeout, context, args, result;
  let previous = 0;

  const later = function () {
    previous = options.leading === false ? 0 : +new Date();
    clearTimeout(timeout);
    timeout = null;
    result = fn.apply(context, args);
    if (!timeout) context = args = null;
  };

  const throttled = function () {
    let now = +new Date();
    if (!previous || options.leading === false) previous = now;
    let remaining = wait - (now - previous);

    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = fn.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };
  return throttled;
}