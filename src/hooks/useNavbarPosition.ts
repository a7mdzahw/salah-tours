import React, { useLayoutEffect } from "react";

export default function useNavbarPosition() {
  const [fixed, setFixed] = React.useState(false);
  const placeholderRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (placeholderRef.current) {
        const placeholderTop =
          placeholderRef.current!.getBoundingClientRect().top;

        // Toggle sticky class when bar reaches or leaves the top
        if (placeholderTop <= 0) {
          setFixed(true);
        } else {
          setFixed(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { fixed, placeholderRef };
}
