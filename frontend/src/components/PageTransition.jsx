import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Classic subtle page transition.
 * Fades + gently slides content in on every route change.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [stage, setStage] = useState('enter'); // 'enter' | 'exit'
  const prevKey = useRef(location.key);

  useEffect(() => {
    if (location.key !== prevKey.current) {
      // Route changed — start exit
      setStage('exit');

      const timer = setTimeout(() => {
        // After exit animation, swap content and enter
        setDisplayChildren(children);
        setStage('enter');
        prevKey.current = location.key;
      }, 150); // exit duration

      return () => clearTimeout(timer);
    } else {
      // Same route, just update children
      setDisplayChildren(children);
    }
  }, [location.key, children]);

  return (
    <div className={`page-transition page-${stage}`}>
      {displayChildren}
    </div>
  );
}
