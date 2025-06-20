export function validateVideoId(videoId: string): boolean {
  const videoIdRegex = /^[\w-]{11}$/;
  return videoIdRegex.test(videoId);
}

export function validateLanguageCode(language: string): boolean {
  // Basic language code validation (ISO 639-1)
  const languageRegex = /^[a-z]{2}(?:-[A-Z]{2})?$/;
  return languageRegex.test(language);
}

export function validateTimeFormat(time: string): boolean {
  // Validates both seconds and HH:MM:SS format
  const timeRegex = /^(?:\d+(?:\.\d+)?|(?:\d{1,2}:)?\d{1,2}:\d{1,2}(?:\.\d+)?)$/;
  return timeRegex.test(time);
}
