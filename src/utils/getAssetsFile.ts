export const getAssetsFile = (url: string) =>
  new URL(url, import.meta.url).href;
