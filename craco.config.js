const path = require("path");

/**
 * CRACO Configuration for Dynamics 365 React Boilerplate
 *
 * This configuration optimizes the build for D365 Web Resources deployment:
 * - Creates single bundle files (no code splitting)
 * - Uses relative paths for D365 compatibility
 * - Removes unnecessary files and optimizes output
 */

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },

    configure: (webpackConfig, { env }) => {
      if (env === "production") {
        // Disable sourcemap generation
        webpackConfig.devtool = false;

        // Configure output for D365 Web Resources compatibility
        webpackConfig.output = {
          ...webpackConfig.output,
          publicPath: "./", // Relative paths for D365 embedding
          filename: "static/js/bundle.js", // Single JS file without hash
          chunkFilename: "static/js/[name].chunk.js", // Consistent chunk naming
          assetModuleFilename: "static/media/[name][ext]", // Clean asset naming
        };

        // Force single bundle creation (required for D365 Web Resources)
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: { cacheGroups: { default: false } }, // Disable code splitting
          runtimeChunk: false, // Inline runtime in main bundle
        };

        // Configure plugins for D365 compatibility
        configurePluginsForD365(webpackConfig);

        // Optimize Terser for smaller bundles
        optimizeTerserPlugin(webpackConfig);
      }

      // Suppress sourcemap warnings from node_modules
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        /Failed to parse source map/,
      ];

      return webpackConfig;
    },
  },
};

function configurePluginsForD365(webpackConfig) {
  webpackConfig.plugins.forEach((plugin) => {
    const pluginName = plugin.constructor.name;

    // Configure CSS extraction for single file output
    if (pluginName === "MiniCssExtractPlugin") {
      plugin.options.filename = "static/css/bundle.css";
      plugin.options.chunkFilename = "static/css/[name].chunk.css";
    }

    // Ensure HTML plugin uses relative paths
    if (pluginName === "HtmlWebpackPlugin") {
      plugin.userOptions.publicPath = "./";
    }
  });

  // Remove manifest plugin (not needed for D365)
  webpackConfig.plugins = webpackConfig.plugins.filter(
    (plugin) => plugin.constructor.name !== "WebpackManifestPlugin"
  );
}

function optimizeTerserPlugin(webpackConfig) {
  const terserPlugin = webpackConfig.optimization.minimizer?.find(
    (plugin) => plugin.constructor.name === "TerserPlugin"
  );

  if (terserPlugin) {
    terserPlugin.options.extractComments = false; // Don't create separate license files
  }
}
