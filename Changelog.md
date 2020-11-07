### v2.1.4
###### 2020-11-07
- 新增 strictLazyMode 属性，用来设置是否使用严格模式进行懒加载操作；
- 修复内部程序中判断 opacity 样式值错误的问题。 

### v2.1.3
###### 2020-08-06
- 修复在 chrome 51 - 57 浏览器中无法正常使用懒加载功能的 bug。

### v2.1.2
###### 2020-06-23
- 移除了原来的 errorPlaceholder 属性，现统一使用 useErrorImagePlaceholder 代替。

### v2.1.1
###### 2020-06-22
- container 属性可传入 window, document, "html"，这三个值将会统一转换为 "body"；
- 新增 useErrorImagePlaceholder 属性，用来设置当图片加载失败时的占位图片。

### v2.1.0
###### 2020-03-02
- 使用默认配置时无需传入空对象；
- 新增 beforeLazy 属性；
- 新增 autoCheckChange 属性；
- 修复在 IE 浏览器中某些情况下会出现控制台报错的问题；
- 程序结构和性能优化。

### v2.0.0
###### 2020-02-27
- 对程序进行重写，不再依赖 jQuery，完全基于原生 JavaScript 开发；
- 不再兼容 IE8- 的浏览器。

### v1.0.0
###### 2020-01-26
- 发布 FunLazy。
