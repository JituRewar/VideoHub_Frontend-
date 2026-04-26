/**
 * Converts HTTP URLs to HTTPS.
 * Safely handles null, undefined, or empty strings.
 * 
 * @param {string} url - The URL to convert
 * @returns {string} - The secure HTTPS URL or a fallback if needed
 */
export const secureUrl = (url) => {
  if (!url) return '';
  
  if (typeof url !== 'string') return url;

  // Replace 'http://' with 'https://'
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  return url;
};
