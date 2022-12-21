import { useEnvStore } from '../stores/env';

const {
  envTheme,
} = useEnvStore();

export const useImgPath = (path: string) => {
  return new URL(`../assets/images/template1/${envTheme}/${path}`, import.meta.url).href;
}