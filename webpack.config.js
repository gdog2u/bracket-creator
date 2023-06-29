const path = require('path');

/** @type {import("webpack").Configuration} */
module.exports = {
    mode: "development",
    // mode: "production",
    devtool: "inline-source-map",
    entry: {
        Bracket: {import: "./src/ts/bracket.ts", filename: "bracket.bundle.js"},
        Main: {import: "./src/ts/main.ts", filename: "main.bundle.js"},
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, 'static/js'),
        library: {
            name: "[name]",
            type: "var"
        }
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"],
        // Add support for TypeScripts fully qualified ESM imports.
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        }
    },
    module: {
        rules: [
            // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }
        ]
    }
};