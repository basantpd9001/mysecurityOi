module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@/components': './components',
            '@/services': './services',
            '@/store': './store',
            '@/utils': './utils',
            '@/hooks': './hooks',
            '@/config': './config',
            '@/data': './data',
            '@/assets': './assets',
            '@/types': './types/index',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
