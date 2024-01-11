/* eslint-disable no-undef */
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslint from 'vite-plugin-eslint';
import postcssPresetEnv from 'postcss-preset-env';
// import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import DefineOptions from 'unplugin-vue-define-options/vite';
// import svgLoader from 'vite-svg-loader';
// import commonjs from 'vite-plugin-commonjs';
import { visualizer } from 'rollup-plugin-visualizer';
import dts from 'vite-plugin-dts';
import { resolve, relative, extname } from 'node:path';
// 引入theme
// import theme from './src/style/theme';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';

// chunks相关
const { pathname = '' } = new URL('./node_modules', import.meta.url);
const chunkIncludes = function (includes: string[], path: string) {
  let flag = false;
  includes.forEach((item) => {
    const pathPrefix = `${pathname}/${item}/`.replace(/^[/]?/, '');
    // console.log(path, pathPrefix)
    if (path.includes(pathPrefix)) {
      flag = true;
      return false;
    }
  });
  return flag;
};

// 获取打包命令符
const lifecycle = process.env.npm_lifecycle_event;
// 获取脚本参数
const envTheme = process.env.npm_config_theme || '';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // console.log(command, mode);
  return {
    base: './',
    define: {
      __THEME__: JSON.stringify(envTheme)
    },
    plugins: [
      vue(),
      dts({
        entryRoot: './packages',
        outDir: ['./es', './lib']
      }),
      vueJsx(),
      eslint({
        cache: false
      }),
      // svgLoader(),
      // AutoImport({
      //   imports: ['vue', 'vue-router']
      // }),
      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
        resolvers: [
          AntDesignVueResolver({
            // 局部引入且不换肤时赋值less
            importStyle: 'less',
            resolveIcons: true
          })
        ]
      }),
      DefineOptions(),
      // commonjs(),
      // 打包分析
      lifecycle === 'report'
        ? visualizer({ open: true, gzipSize: true, filename: 'report.html' })
        : null
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url))
      }
    },
    css: {
      postcss: {
        plugins: [postcssPresetEnv]
      },
      preprocessorOptions: {
        less: {
          // 本地换肤时使用
          // modifyVars: theme['compact'],
          javascriptEnabled: true,
          charset: false
          // additionalData: '@import "./src/style/var.less";'
        }
      }
    },
    server: {
      port: 8000
    },
    build: {
      copyPublicDir: false,
      lib: {
        entry: resolve(__dirname, './index.ts'),
        name: 'npm-lib-tt'
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue', 'ant-design-vue', 'lodash'],
        input: Object.fromEntries(
          globSync('packages/**/*.*').map((file: string) => [
            // 这里将删除 `src/` 以及每个文件的扩展名。
            // 因此，例如 src/nested/foo.js 会变成 nested/foo
            relative('packages', file.slice(0, file.length - extname(file).length)),
            // 这里可以将相对路径扩展为绝对路径，例如
            // src/nested/foo 会变成 /project/src/nested/foo.js
            fileURLToPath(new URL(file, import.meta.url))
          ])
        ),
        output: [
          {
            // 打包格式
            format: 'es',
            // 打包文件名称
            entryFileNames: '[name].mjs',
            // 打包目录对应
            // preserveModules: true,
            exports: 'named',
            // 打包根目录
            dir: './es'
          },
          {
            // 打包格式
            format: 'cjs',
            // 打包文件名称
            entryFileNames: '[name].js',
            // 打包目录对应
            // preserveModules: true,
            exports: 'named',
            // 打包根目录
            dir: './lib'
          }
        ]
      }
    }
  };
});
