/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const CracoLessPlugin = require('craco-less');
const { getThemeVariables } = require('antd/dist/theme');
const WebpackBar = require('webpackbar');
const { ESLINT_MODES } = require('@craco/craco');
const CracoAlias = require('craco-alias');

// Don't open the browser during development
process.env.BROWSER = 'none';

module.exports = {
    eslint: {
        mode: ESLINT_MODES.file,
    },
    webpack: {
        plugins: [
            // Adds a progress bar to the webpack builds
            new WebpackBar({ profile: true, fancy: true }),
        ],
    },
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: 'tsconfig',
                // baseURL SHOULD be specified
                // plugin does not take it from tsconfig
                baseURL: './',
                tsConfigPath: './tsconfig.paths.json',
            }
        },
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            ...getThemeVariables({
                                dark: true,
                                compact: false,
                            }),
                            // '@primary-color': '#34e5eb',
                            // '@warning-color': '#bd6f04',
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};