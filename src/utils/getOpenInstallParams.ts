export const getOpenInstallParams = () => {
  return new Promise((resolve) => {
    window.operainstall.getInstall(
      ({ data }) => {
        if (data) {
          resolve(JSON.parse(data).mainDomain);
        } else {
          resolve(null);
        }
      },
      () => resolve(null)
    );
  });
};
