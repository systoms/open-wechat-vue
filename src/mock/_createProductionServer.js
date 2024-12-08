import { createProdMockServer } from 'vite-plugin-mock/client'
import systemMock from './system.js';

export function setupProdMockServer() {
    createProdMockServer([...systemMock]);
}