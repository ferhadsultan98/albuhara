import { useEffect, useState } from "react";

export default function usePlatform() {
  const [platform, setPlatform] = useState("other");

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(ua)) {
      setPlatform("android");
      document.body.classList.add("android");
    } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      setPlatform("ios");
      document.body.classList.add("ios");
    } else {
      setPlatform("other");
      document.body.classList.add("other");
    }
  }, []);

  return platform;
}
