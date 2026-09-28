"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUserAgentString = parseUserAgentString;
const ua_parser_js_1 = require("ua-parser-js");
function parseUserAgentString(uaString, isBot = false) {
    if (!uaString) {
        return {
            deviceType: isBot ? 'Bot' : 'Unknown',
            browser: 'Unknown',
            browserVersion: '',
            os: 'Unknown',
            osVersion: '',
        };
    }
    const parser = new ua_parser_js_1.UAParser(uaString);
    const result = parser.getResult();
    // Determine device type
    let deviceType = 'Desktop';
    if (isBot) {
        deviceType = 'Bot';
    }
    else if (result.device.type === 'mobile') {
        deviceType = 'Mobile';
    }
    else if (result.device.type === 'tablet') {
        deviceType = 'Tablet';
    }
    else if (!result.device.type) {
        // If no device type is flagged, check OS
        const osName = result.os.name?.toLowerCase() || '';
        if (osName.includes('android') || osName.includes('ios')) {
            deviceType = 'Mobile';
        }
        else {
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
