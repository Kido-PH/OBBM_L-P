module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules\/(?!html2pdf.js)/, // Loại trừ html2pdf.js
      },
    ],
  },
  stats: {
    warningsFilter: [/Failed to parse source map/], // Loại bỏ tất cả cảnh báo liên quan đến source map
  },
};
