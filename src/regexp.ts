/**
 * Checks whether the given regular expression will be accepted by the declarativeNetRequest API.
 *
 * @async
 * @param {string} regexp
 * @returns {Promise<boolean>}
 */
export async function isRegexpValid(regexp: string): Promise<boolean> {
  try {
    new RegExp(regexp);
  } catch (e) {
    return false;
  }
  const result = await chrome.declarativeNetRequest.isRegexSupported({
    regex: regexp,
  });
  return result.isSupported;
}
