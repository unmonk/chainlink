import { useEffect, useState } from "react";

interface WindowSize {
  width: number;
  height: number;
}

const getWindowSize = (): WindowSize => {
  // Prevents SSR issues
  if (typeof window !== "undefined") {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  // Default fallback values for SSR
  return {
    width: 1200,
    height: 800,
  };
};

export function useWindowSize(): [number, number] {
  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize());

  useEffect(() => {
    function handleResize() {
      setWindowSize(getWindowSize());
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount

  return [windowSize.width, windowSize.height];
}
