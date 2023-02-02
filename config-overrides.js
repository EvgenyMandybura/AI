const webpack = require("webpack");

module.exports = function override(config, env) {
    config.resolve.fallback = {
        fs: false,
        url: false,
        path: false,
        http: false,
        https: false,
        zlib: false,
        util: false,
        net: false,
        buffer: false,
        stream: false,
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
        new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
            const mod = resource.request.replace(/^node:/, "");
            switch (mod) {
                case "buffer":
                    resource.request = "buffer";
                    break;
                case "fs":
                    resource.request = "fs";
                    break;
                case "url":
                    resource.request = "url";
                    break;
                case "path":
                    resource.request = "path";
                    break;
                case "http":
                    resource.request = "http";
                    break;
                case "https":
                    resource.request = "https";
                    break;
                case "zlib":
                    resource.request = "zlib";
                    break;
                case "net":
                    resource.request = "net";
                    break;
                case "util":
                    resource.request = "util";
                    break;
                case "stream":
                    resource.request = "readable-stream";
                    break;
                case "zlib_bindings":
                    resource.request = "zlib_bindings";
                    break;

                default:
                    throw new Error(`Not found ${mod}`);
            }
        }),
    );
    config.ignoreWarnings = [/Failed to parse source map/];

    return config;
};