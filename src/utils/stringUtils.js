export const replaceUnderScoreBySpace = (value, toCapitalize = true) => {
  if (value) {
    if (toCapitalize) {
      return capitalize(value.replace(/_/g, ' '));
    }
    return value.replace(/_/g, ' ');
  }
  return value;
};

export const capitalize = (str, lower = false) => {
  try {
    return str
      ? (lower ? str.toLowerCase() : str).replace(
          /(?:^|\s|["'([{])+\S/g,
          (match) => match.toUpperCase()
        )
      : '';
  } catch (e) {
    console.log('capitalize error', str, e);
    return str;
  }
};

export const zeroFill = (number, width = 2) => {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ''; // always return a string
};

export const padZero = (int) => {
  return int > 9 ? int.toString() : '0' + int.toString();
};
