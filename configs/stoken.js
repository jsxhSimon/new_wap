const stoken = {
  dcs: 'c43387c1b0ec6aeffb1a29c9a8f07637922beac405d16d6e',
  pre: '2d5e2ceaf09472f91f7e8de25f315ea4842942f31331e875',
  mb2: 'd5ce2d0d4809de8bdbaee47099f6be014a301fc0290fa2a7',
}

module.exports.getDefaultSToken = ({ site }) => stoken[site]