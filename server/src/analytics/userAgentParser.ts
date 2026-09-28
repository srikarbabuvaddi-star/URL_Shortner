import { UAParser } from 'ua-parser-js';

export interface ParsedUserAgent {
  deviceType: 'Mobile' | 'Tablet' | 'Desktop' | 'Bot' | 'Unknown';
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
}

export function parseUserAgentString(uaString: string | undefined | null, isBot = false): ParsedUserAgent {
  if (!uaString) {
    return {
      deviceType: isBot ? 'Bot' : 'Unknown',
      browser: 'Unknown',
      browserVersion: '',
      os: 'Unknown',
      osVersion: '',
    };
  }

  const parser = new UAParser(uaString);
  const result = parser.getResult();

  // Determine device type
  let deviceType: 'Mobile' | 'Tablet' | 'Desktop' | 'Bot' | 'Unknown' = 'Desktop';
  if (isBot) {
    deviceType = 'Bot';
  } else if (result.device.type === 'mobile') {
    deviceType = 'Mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'Tablet';
  } else if (!result.device.type) {
    // If no device type is flagged, check OS
    const osName = result.os.name?.toLowerCase() || '';
    if (osName.includes('android') || osName.includes('ios')) {
      deviceType = 'Mobile';
    } else {
      deviceType = 'Desktop';
    }
  }

  return {
    deviceType,
    browser: result.browser.name || 'Unknown',
    browserVersion: result.browser.major || result.browser.version || '',
    os: result.os.name || 'Unknown',
    osVersion: result.os.version || '',
  };
}
