import { getOpenInstallParams } from './getOpenInstallParams';
import { useEnvStore } from 'src/stores/env';

const getDomain = async () => {
  const envStore = useEnvStore();
  let domain;
  const defaultDomain =
    envStore.appEnv === 'prod'
      ? envStore.envDefaultDomain
      : (window.localStorage.getItem('selectApi') || '').replace(
          /^https?:\/\//,
          ''
        );
  switch (process.env.MODE) {
    case 'cordova':
      domain = (await getOpenInstallParams()) || defaultDomain;
      break;
    case 'spa':
      return (domain = process.env.DEV
        ? defaultDomain
        : window.location.hostname);
  }
  return domain;
};

export { getDomain };
