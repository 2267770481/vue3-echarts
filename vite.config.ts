import { build, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import {loadEnv} from 'vite'
import {resolve} from 'path';

// https://vitejs.dev/config/
export default ({command, mode}) => {
  return defineConfig({
    plugins: [vue()],
    // 服务器配置
    server: {
      host: '127.0.0.1',
      // port: 8089,
      port: Number(loadEnv(mode, process.cwd()).VITE_APP_PORT),  // 从配置文件中读取
      strictPort: true, // 检查端口是否被占用，占用直接退出
      https: false, // 是否使用https
      open: true, // 在浏览器中自动打开
      proxy: {  // 代理 (有很多种方式定义，具体看官网)
        // 选项写法
        '/api': {
          // target: 'http://jsonplaceholder.typicode.com',
          target: loadEnv(mode, process.cwd()).VITE_APP_BASE_URL,  // 从配置文件中读取
          ws: true, 
          changeOrigin: true, // 跨域配置
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // 正则表达式写法
        // '^/fallback/.*': {
        //   target: 'http://jsonplaceholder.typicode.com',
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/fallback/, '')
        // },
      },
      hmr: {
        overlay: false,  // 是否频闭服务器报错
      }
    },

    // 设置项目文件导入路径
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },

    // css 预处理器设置
    css: {
      preprocessorOptions: {
        // 导入global.scss, 这样就可以在vue全局中使用global.scss中定义的变量了
        scss: {
          additionalData: `@import "@/assets/css/global.scss";`
        }
      }
    },

    // 分块打包配置
    build: {
      chunkSizeWarningLimit: 1500, // 分块打包，将大包分解成更小的块
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_moudles')) {
              return id.toString().split('node_moudles/')[1].split('/')[0].toString();
            }
          }
        }
      }
    }

  })
}
