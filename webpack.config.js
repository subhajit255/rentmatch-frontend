// webpack.config.js
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env once (frontend-safe vars only)
dotenv.config({ quiet: true });

const PUBLIC_ENV = {
  REACT_APP_PUBLIC_API_URL: process.env.REACT_APP_PUBLIC_API_URL,
  REACT_APP_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY
};

// 🔐 Safety check
Object.entries(PUBLIC_ENV).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
});

export default {
  entry: "./src/index.tsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    assetModuleFilename: "assets/[hash][ext][query]",
    clean: true,
    publicPath: "/",
  },

  module: {
    rules: [
      // TS / JS
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },

      // Images
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },

      // CSS
      {
        test: /\.css$/i,
        oneOf: [
          {
            exclude: /node_modules/,
            use: [
              "style-loader",
              "css-loader",
              "postcss-loader",
            ],
          },
          {
            include: /node_modules/,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      process: "process/browser",
      buffer: "buffer",
      util: "util",
      crypto: false,
      stream: false,
      fs: false,
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),

    // ✅ Expose ONLY safe public env vars
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(PUBLIC_ENV),
    }),

    // Webpack 5 polyfills
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 4007,
    open: true,
    historyApiFallback: true,
  },

  mode: "development",
};
