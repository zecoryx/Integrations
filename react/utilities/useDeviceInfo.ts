import { useState, useEffect } from 'react';

// A custom hook to detect and provide information about the user's device and operating system.
export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: '',
    os: '',
    browser: '',
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    let os = 'Unknown';
    let browser = 'Unknown';
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;

    // Detect OS
    if (userAgent.match(/Win/i)) os = 'Windows';
    else if (userAgent.match(/Mac/i)) os = 'macOS';
    else if (userAgent.match(/Linux/i)) os = 'Linux';
    else if (userAgent.match(/Android/i)) os = 'Android';
    else if (userAgent.match(/iOS|iPhone|iPad|iPod/i)) os = 'iOS';

    // Detect Browser
    if (userAgent.match(/Firefox/i)) browser = 'Firefox';
    else if (userAgent.match(/SamsungBrowser/i)) browser = 'Samsung Browser';
    else if (userAgent.match(/Opera|OPR/i)) browser = 'Opera';
    else if (userAgent.match(/Trident|MSIE/i)) browser = 'IE';
    else if (userAgent.match(/Edge/i)) browser = 'Edge';
    else if (userAgent.match(/Chrome/i)) browser = 'Chrome';
    else if (userAgent.match(/Safari/i)) browser = 'Safari';

    // Detect Device Type
    isMobile = /Mobi|Android|iPhone|iPod|BlackBerry|Opera Mini|Windows Phone|Palm|IEMobile|Symbian|Fennec/i.test(userAgent);
    isTablet = /iPad|Android(?!.*Mobi)|(?:Mobile)/i.test(userAgent); // Android tablets often have "Mobile" in UA
    isDesktop = !isMobile && !isTablet;

    setDeviceInfo({
      userAgent,
      os,
      browser,
      isMobile,
      isTablet,
      isDesktop,
    });
  }, []);

  return deviceInfo;
};