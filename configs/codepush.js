const deploymentKeys = {
  android: {
    mb2: {
      dcs: 'DXY96dOYw0E8Za6nLR-mGKtuRdNzLCOtkYuM0',
      pre: '4E0y9YzDeQKg2qhcESfsrMGhOfuKrXO_zHG9X',
      mb2: 'wbibT5XFDf7BJ5Jo82e7-OPbM_RkoUCzPIRNJ',
    },
    bog2: {
      dcs: 'DXY96dOYw0E8Za6nLR-mGKtuRdNzLCOtkYuM0',
      pre: '4E0y9YzDeQKg2qhcESfsrMGhOfuKrXO_zHG9X',
      bog: 'wbibT5XFDf7BJ5Jo82e7-OPbM_RkoUCzPIRNJ',
      bog2: 'wbibT5XFDf7BJ5Jo82e7-OPbM_RkoUCzPIRNJ',
    },
  },
  ios: {
    mb2: {
      dcs: '6jNtJ9xqVZ4frETIp9vboFXQaTJ8ehaLNvG5E',
      pre: '_kAkUA45O4Kq6Ir0jCYZJUF28-5N-aXFZqc7p',
      mb2: 'N79Ip1-jxlf3u5BJ55hs8UU9bBoeddYJTMNp0',
    },
    bog2: {
      dcs: '6jNtJ9xqVZ4frETIp9vboFXQaTJ8ehaLNvG5E',
      pre: '_kAkUA45O4Kq6Ir0jCYZJUF28-5N-aXFZqc7p',
      bog: 'N79Ip1-jxlf3u5BJ55hs8UU9bBoeddYJTMNp0',
      bog2: 'N79Ip1-jxlf3u5BJ55hs8UU9bBoeddYJTMNp0',
    },
  },
}

module.exports.getDeploymentKey = ({ site, platform, template }) => {
  console.log(site, platform, template)
  deploymentKeys[platform][template][site]
}
