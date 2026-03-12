import Mock from 'mockjs';

// 导入各个模块的mock数据
import './modules/activity';

// 设置响应延迟，模拟真实网络请求
Mock.setup({
  timeout: '200-600', // 随机延迟200-600ms
});

export default Mock;
