const formatCount = ({count, base = 10}) => {
  if (count > 1000) {
    return `${Math.round((count / 1000) * base) / base}k`;
  } else {
    return count;
  }
};

export {formatCount};
