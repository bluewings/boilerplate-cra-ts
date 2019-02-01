/* eslint-disable import/no-extraneous-dependencies, global-require */
const { getIn, setIn } = require('immutable');
const tailwindcss = require('tailwindcss');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const postcssPresetEnv = require('postcss-preset-env');

const babelLoader = {
  loader: require.resolve('babel-loader'),
  options: {
    presets: ['react-app'],
    compact: true,
  },
};

const pugAsJsxLoader = {
  loader: require.resolve('pug-as-jsx-loader'),
  options: {
    resolve: {
      classnames: 'cx',
    },
    // transpiledFile: true,
    autoUpdateJsFile: true,
  },
};

const styleLoader = require.resolve('style-loader');

const cssLoader = {
  loader: require.resolve('css-loader'),
  options: {
    importLoaders: 1,
    sourceMap: false,
    modules: true,
    localIdentName: '[hash:base64:5]',
  },
};

const postcssLoader = {
  loader: require.resolve('postcss-loader'),
  options: {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss',
    plugins: () => [
      tailwindcss(),
      postcssFlexbugsFixes,
      postcssPresetEnv({
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      }),
    ],
  },
};

const sassLoader = require.resolve('sass-loader');

module.exports = paths => ({
  // Customize webpack.config.js
  'resolve.modules': {
    $push: ['shared'],
  },

  // path in webpack.config
  'module.rules...oneOf': {
    // Apply transform-commonjs-es2015-modules to js files.
    // https://www.npmjs.com/package/babel-plugin-transform-commonjs-es2015-modules
    $aggregate: [{
      $match(rule) {
        const { include, test = {} } = rule;
        return include && typeof test.test === 'function' && test.test('app.js');
      },
      $update(rule) {
        return setIn(rule, ['options', 'plugins'], [
          ...(getIn(rule, ['options', 'plugins']) || []),
          require.resolve('babel-plugin-transform-commonjs-es2015-modules'),
        ]);
      },
    }],

    $unshift: [
      // Process pug as jsx.
      {
        test: /\.pug$/,
        include: paths.appSrc,
        use: [
          babelLoader,
          pugAsJsxLoader,
        ],
      },

      // Process application css|scss.
      {
        test: /\.module\.(css|scss)$/,
        include: /(\/src\/|\/documentation\/)/,
        use: [
          styleLoader,
          cssLoader,
          postcssLoader,
          sassLoader,
        ],
      },

      // Process any css|scss outside of the app.
      {
        test: filename => filename.match(/\.(css|scss)$/) && !filename.match(/\.module\.(css|scss)$/),
        include: /(\/src\/|\/documentation\/|\/node_modules\/)/,
        use: [
          styleLoader,
          setIn(cssLoader, ['options', 'localIdentName'], '[local]'),
          postcssLoader,
          sassLoader,
        ],
      },

      // Process yaml files.
      {
        test: /\.(yml|yaml)$/,
        exclude: /node_modules/,
        use: [
          require.resolve('json-loader'),
          require.resolve('yaml-loader'),
        ],
      },
    ],
  },
});
