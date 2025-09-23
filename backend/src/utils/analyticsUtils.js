// Utility functions for extracting analytics data from requests

export const parseUserAgent = (userAgent) => {
  if (!userAgent) return {};

  const ua = userAgent.toLowerCase();

  // Detect device type
  let deviceType = 'desktop';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    deviceType = 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'tablet';
  }

  // Detect browser
  let browser = 'Unknown';
  let browserVersion = '';

  if (ua.includes('chrome')) {
    browser = 'Chrome';
    const match = ua.match(/chrome\/(\d+)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
    const match = ua.match(/firefox\/(\d+)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
    const match = ua.match(/version\/(\d+)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('edge')) {
    browser = 'Edge';
    const match = ua.match(/edge\/(\d+)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.includes('opera')) {
    browser = 'Opera';
    const match = ua.match(/opera\/(\d+)/);
    browserVersion = match ? match[1] : '';
  }

  // Detect OS
  let os = 'Unknown';
  let osVersion = '';

  if (ua.includes('windows')) {
    os = 'Windows';
    const match = ua.match(/windows nt (\d+\.\d+)/);
    osVersion = match ? match[1] : '';
  } else if (ua.includes('mac os x')) {
    os = 'macOS';
    const match = ua.match(/mac os x (\d+[._]\d+)/);
    osVersion = match ? match[1].replace('_', '.') : '';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('android')) {
    os = 'Android';
    const match = ua.match(/android (\d+\.\d+)/);
    osVersion = match ? match[1] : '';
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS';
    const match = ua.match(/os (\d+)_(\d+)/);
    if (match) {
      osVersion = `${match[1]}.${match[2]}`;
    }
  }

  return {
    deviceType,
    browser,
    browserVersion,
    os,
    osVersion
  };
};

export const extractScreenResolution = (userAgent) => {
  // Screen resolution can't be reliably detected server-side from user agent
  // In a real app, this should be sent from the frontend
  // For now, return a common default resolution
  return '1920x1080';
};

export const extractLanguage = (acceptLanguage) => {
  if (!acceptLanguage) return null;

  const languages = acceptLanguage.split(',');
  return languages[0]?.split(';')[0]?.trim() || null;
};

export const extractTimezone = (userAgent) => {
  // Timezone detection from user agent is not reliable
  // In a real app, you might get this from frontend or use IP geolocation
  // For now, return UTC as default
  return 'UTC';
};

// Function to get location data from IP (placeholder - would need external service)
export const getLocationFromIP = async (ip) => {
  // This is a placeholder function
  // In a real implementation, you would use a service like:
  // - MaxMind GeoIP
  // - IP-API
  // - IPInfo
  // - etc.

  // For development purposes, return basic location data based on IP patterns
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
    return {
      country: 'Local',
      city: 'Localhost',
      region: 'Local'
    };
  }

  // For other IPs, you could implement a simple lookup or use a free service
  // For now, return unknown values
  return {
    country: 'Unknown',
    city: 'Unknown',
    region: 'Unknown'
  };
};
