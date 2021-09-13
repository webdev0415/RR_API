import { isArray } from 'lodash';
export const splitString = (stringToSplit, separator = ',') => {
  const arrayOfStrings = stringToSplit.split(separator);
  return arrayOfStrings;
};

export const convertStrToArr = (str = '', separator = ',') => {
  if (str === 'undefined') {
    return [];
  }
  if (isArray(str)) {
    return str;
  }
  return splitString(str, separator);
};
