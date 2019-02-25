/* eslint-disable import/no-extraneous-dependencies, global-require */
const { setIn } = require('immutable');
const tailwindcss = require('tailwindcss');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const postcssPresetEnv = require('postcss-preset-env');
const parse = require('url-parse');

const pkg = require('./package.json');

const babelLoader = {
  loader: require.resolve('babel-loader'),
  options: {
    presets: ['@babel/preset-env', '@babel/preset-react'],
  },
};

const pugAsJsxLoader = {
  loader: require.resolve('pug-as-jsx-loader'),
  options: {
    resolve: {
      classnames: 'cx',
    },
    transpiledFile: true,
    autoUpdateJsFile: true,
  },
};

const styleLoader = require.resolve('style-loader');

const cssLoader = {
  loader: require.resolve('css-loader'),
  options: {
    importLoaders: 1,
    sourceMap: true,
    modules: true,
    localIdentName: '[name]-[local]-[hash:base64:5]',
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

const modifyBundlerConfig = (config) => {
  config.resolve.extensions.push('.pug');
  config.module.rules = [
    ...config.module.rules,

    // Process pug as jsx.
    {
      test: /\.pug$/,
      exclude: /node_modules/,
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
  ];
  return config;
};

const fontFamily = 'Roboto,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,sans-serif';

const themeConfig = {
  showPlaygroundEditor: true,
  colors: {
    primary: '#1e88e5',
    link: '#1e88e5',
  },
  styles: {
    h1: {
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: 0,
      '&:before': {
        height: '3px !important',
      },
    },
    h2: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: 0,
    },
    h3: {
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: 0,
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 1.5,
      // background: 'yellow',
    },
    table: {
      fontSize: 16,
      borderRadius: 0,
      'thead th, tbody td': {
        padding: '0.5rem 0.75rem',
        lineHeight: 1.5,
      },
    },
    body: {
      fontFamily,
      '*': {
        fontFamily,
        'pre, code, .CodeMirror *, .PropsTable *': {
          fontFamily: '"Source Code Pro", monospace',
          fontSize: 14,
        },
      },
      'h1, h2, h3, h4, h5, h6': {
        fontFamily: `${fontFamily} !important`,
      },
      '#root > div > div > nav': {
        div: {
          marginTop: '0 !important',
        },
        a: {
          boxSizing: 'border-box',
          fontSize: 16,
          fontWeight: 400,
          lineHeight: '34px',
          height: 36,
          paddingTop: 0,
          paddingBottom: 0,
          '&.active': {
            fontWeight: 800,
            '&:before': {
              top: 6,
              width: 3,
              height: 24,
            },
          },
        },
      },
    },
  },
};

const htmlContext = {
  head: {
    links: [{
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:400,500,700',
    }],
  },
};

const pkgConfig = ((pkg) => {
  let config = { title: pkg.name.split('/').pop() };
  if (pkg.repository) {
    let repository;
    if (typeof pkg.repository.url === 'string') {
      repository = pkg.repository.url;
    } else if (typeof pkg.repository.url === 'string') {
      repository = pkg.repository;
    }
    config = {
      ...config,
      repository,
      base: parse(repository).pathname.replace(/[/]{0,1}$/, '/'),
    };
  }
  return config;
})(pkg);

export default {
  ...pkgConfig, // title, repository, base
  wrapper: 'documentation/resources/Wrapper',
  themeConfig,
  modifyBundlerConfig,
  htmlContext,
  typescript: true,
  dest: 'docs',
  hashRouter: true,
};