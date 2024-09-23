export const base64ToBlob = (base64, mime) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
};

export const base64ToFile = (base64, filename, mimeType) => {
  const blob = base64ToBlob(base64, mimeType);
  return new File([blob], filename, { type: mimeType });
};
