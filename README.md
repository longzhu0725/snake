# 贪吃蛇游戏

## 项目简介
经典贪吃蛇游戏的现代实现，使用原生JavaScript开发。支持高分排行榜、游戏暂停/继续、重新开始等功能。

## 功能特性
- 🕹️ 键盘方向键控制蛇移动
- 🏆 本地存储高分排行榜
- ⏯️ 暂停/继续游戏功能
- 🎨 响应式布局与平滑动画
- 📊 实时得分显示

## 技术实现
- **游戏引擎**: HTML5 Canvas
- **数据存储**: localStorage
- **动画系统**: requestAnimationFrame
- **UI框架**: CSS Flex布局

## 运行方法
```bash
# 在项目目录下运行
python -m http.server 8000
# 访问 http://localhost:8000/index.html
```

## 项目结构
```
贪吃蛇/
├── index.html    # 游戏入口文件
├── script.js     # 游戏逻辑与控制
├── style.css     # 界面样式表
└── README.md     # 项目文档
```

## 游戏截图
![游戏界面](./screenshot.png)

## 注意事项
1. 首次运行需要允许浏览器使用localStorage
2. 推荐使用Chrome最新版浏览器
3. 8000端口被占用时可改用其他端口
