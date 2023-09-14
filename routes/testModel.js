/**
 * 测试演示模型
 * 路由控制
 */

const TestController = require('../controller/test')

module.exports = [
    {
        method: 'GET',
        path: '/test/list',
        handler: TestController.slectTest,
    },
]
