// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: [
    // to edit target browsers: use "browserslist" field in package.json
    require('autoprefixer'),
    require('postcss-px-to-viewport')({
      viewportWidth: 375,
      minPixelValue: 1
    }),
  ]
}
