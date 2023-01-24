const path = require('path');
const Dotenv = require('dotenv-webpack');
module.exports = [
    {
        mode: 'development',
        entry: './src/client/main.ts',
        module: {
            rules: [
                {
                    test: /\.ts$/, // File must end with .ts
                    use: 'ts-loader',
                    include: [path.resolve(__dirname, 'src/client/')]
                }
            ]
        },
        plugins: [
            new Dotenv()
        ],
        resolve: {
            extensions: ['.ts', '.js']
        },
        output: {
            publicPath: 'public/assets/scripts',
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'public/assets/scripts')
        },
        optimization: {
            mergeDuplicateChunks: true, // Tells webpack to merge chunks which contain the same modules.
            providedExports: true, // Tells webpack to figure out which exports are provided by modules to generate more efficient code for export * from ...
            removeAvailableModules: true, // Tells webpack to detect and remove modules from chunks when these modules are already included in all parents.
            usedExports: true, // <- remove unused function
        },
        watch: true,
        watchOptions: {
            aggregateTimeout: 200,
            poll: 1000, // Check for changes every second
            ignored: ['/node_modules', '/public', '/Server', '/vendor'],
        }
    }
];