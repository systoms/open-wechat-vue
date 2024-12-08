import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'node:path'
import {fileURLToPath} from 'url';
import path from 'path';
import {viteMockServe} from 'vite-plugin-mock';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// https://vite.dev/config/

export default defineConfig(({command}) => {
    const isDev = command === 'serve'; // 判断是否为开发环境
    return {
        plugins: [
            vue(),

            viteMockServe({
                mockPath: 'src/mock', // 指定存放 Mock 数据的文件夹
                localEnabled: isDev,  // 仅在开发环境启用 Mock
                prodEnabled: false,   // 默认生产环境禁用
                injectCode: `
          import { setupProdMockServer } from './mock/_createProductionServer';
          setupProdMockServer();
        `, // 用于生产环境的 Mock 配置（可选）
            }),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
            },
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true
                }
            }
        }
    };
});
