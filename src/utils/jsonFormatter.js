/**
 * Prettify JSON string with consistent formatting
 * @param {string} jsonString - The JSON string to format
 * @returns {{ success: boolean, result: string }} - Formatted JSON or original if invalid
 */
export function prettifyJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    const formatted = JSON.stringify(parsed, null, 2);
    return { success: true, result: formatted };
  } catch {
    return { success: false, result: jsonString };
  }
}
