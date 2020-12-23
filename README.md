# runapi-me
基于 www.showdoc.com.cn 的第三方api客户端. 交互方式改成自己方便的交互, 不一定适用于所有人.
主要自己开发自用, 使用前请把project.vue页面中的"飞书机器人消息"相关代码注释掉或改成自己的接口.

> 本地浏览器调试跨域问题请修改main.js 中的 Axios.defaults.baseURL属性

```
// 本地浏览器调试时启用这行配置, 否则跨域
Axios.defaults.baseURL = "/server/index.php?s=/"
// APP打包时使用这行配置, 否则404, 不会跨域
Axios.defaults.baseURL = "https://www.showdoc.com.cn/server/index.php?s=/"
```

本项目只适用于API编辑(即使用runapi创建的接口文档), 未过滤md文档, 所以编辑md文档会报错, 目前也用不到, 所以懒得处理了.
代码很傻比, 作者后端, 前端大牛别喷.


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### 桌面应用调试
```
npm run electron:serve
```

### 打包为桌面应用
```
npm run electron:build
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
