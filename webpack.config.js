const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
let mode = 'development'; // По умолчанию режим development
let target = 'web'; // в режиме разработки browserslist не используется

const flagIndex = process.argv.indexOf('--env');
if (flagIndex !== -1) {
  // решение для windows где нет process.env.NODE_ENV
  // Режим production, если
  // при запуске вебпака было указано
  mode = 'production';
  target = 'browserslist'; // в продакшен режиме используем browserslist
}


const esLintPlugin = (isDev) =>
  isDev === 'development'
    ? [new ESLintPlugin({ extensions: ['ts', 'js'] })]
    : [];
//Используем еслинт плагин при запуске в девелопмент моде
const plugins = [
  ...esLintPlugin(mode),
  new HtmlWebpackPlugin({
    template: './src/index.html', // Данный html будет использован как шаблон
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css', // Формат имени файла
  }),
]; // Создаем массив плагинов
console.log('Current mode: ', mode);
module.exports = {
  mode,
  plugins,
  target,
  entry: './src/index.ts', // Указываем точку входа - главный модуль приложения,
  // в который импортируются все остальные. Файл формата typescript

  output: {
    filename: 'bundle.[contenthash].js', // название файла бандла
    path: path.resolve(__dirname, 'dist'), // Директория, в которой будет
    // размещаться итоговый бандл, папка dist в корне приложения
    clean: true, // Очищает директорию dist перед обновлением бандла
    // Свойство стало доступно с версии 5.20.0, до этого использовался
    // CleanWebpackPlugin
    assetModuleFilename: 'assets/[hash][ext][query]', // Все ассеты будут
    // складываться в dist/assets
  },
  devtool: mode === 'development' ? 'source-map' : false, // в дев моде создаются соурс мапы, а в продакшен нет
  devServer: {
    hot: true, // Включает автоматическую перезагрузку страницы при изменениях
    open: true, // Открывает в браузере при запуске.
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }, // Лоадер тайпскрипта используютеся на файлах с разрешениями ts и js
      { test: /\.(html)$/, use: ['html-loader'] }, // Добавляем загрузчик для html
      {
        test: /\.(s[ac]|c)ss$/i, // /\.(le|c)ss$/i если вы используете less
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: mode === 'production' ? 'asset' : 'asset/resource', // В продакшен режиме
        // изображения размером до 8кб будут инлайнится в код
        // В режиме разработки все изображения будут помещаться в dist/assets
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
