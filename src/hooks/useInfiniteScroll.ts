import { useEffect } from "react";

export function useInfiniteScroll(
  ref: React.RefObject<Element | null>,
  callback: () => void,
  options?: IntersectionObserverInit
) {
  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);
}

export default useInfiniteScroll;
