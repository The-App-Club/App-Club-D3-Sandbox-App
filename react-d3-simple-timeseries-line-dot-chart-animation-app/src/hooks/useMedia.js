import {useEffect, useState} from 'react';

const useMedia = ({queries, values, defaultValue}) => {
  const match = () => {
    return (
      values[
        queries.findIndex((q) => {
          return matchMedia(q).matches;
        })
      ] || defaultValue
    );
  };
  const [value, setVaule] = useState(match);
  useEffect(() => {
    const handleResize = () => {
      setVaule(match);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return value;
};

export {useMedia};
