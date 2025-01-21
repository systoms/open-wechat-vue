import {createProdMockServer} from 'vite-plugin-mock/client';
import systemMock from './system'; // 确保路径正确
import permissionUserMock from './company/permission/user';
import pageMock from './company/page';

// 生产环境下启动 Mock 服务
export function setupProdMockServer() {
    createProdMockServer([
        ...systemMock,
        ...permissionUserMock,
        ...pageMock,
    ]);
}
