// useTimeSpent.ts
import { useState, useEffect } from 'react';

const useTimeSpent = () => {
  const [startTime] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setTimeSpent(currentTime - startTime);
    }, 1000);

    return () => {
      clearInterval(interval);
      //   const endTime = Date.now();
      //   const totalTimeSpent = (endTime - startTime) / 1000; // in seconds
      //   console.log(
      //     `You spent ${totalTimeSpent} seconds on this page.`
      //   );
    };
  }, [startTime]);

  return Math.floor(timeSpent / 1000); // returns time spent in seconds
};

export default useTimeSpent;
