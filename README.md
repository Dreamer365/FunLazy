<br>
<h1 align="center">FunLazy</h1>

<h4 align="center">一个高性能的轻量级图片懒加载组件</h4>

<blockquote align="center">
  <em>FunLazy</em> 是一个无任何依赖的图片懒加载组件，可以完美兼容桌面端和移动端的主流浏览器<br>
组件在不同的浏览器中会自动选择最佳的懒加载方式，以此提高懒加载的性能
</blockquote>

<h4 align="center"><a href="http://dreamer365.gitee.io/funlazy/" target="_blank">查看在线示例</a></h4>

<h5 align="center">从 v2.0 版本开始，FunLazy 将不再依赖 jQuery，完全使用原生 JS 开发，同时不再兼容 IE8-<br>如果还有兼容 IE8- 的需求，可继续使用 v1.0 版本</h5>

## 安装
##### 本地引入

```html
<script src="funlazy.min.js"></script>
```

##### cdn 引入

```html
<script src="https://unpkg.com/funlazy@latest"></script>
```

##### npm 安装

```html
npm i funlazy -S
```
```html
const FunLazy = require( "funlazy" );
```

## 用法
##### 相对于窗口 - 纵向
```html
<body>
    <img data-funlazy="01.jpg" width="500" height="500">
    <img data-funlazy="02.jpg" width="500" height="500">
    <img data-funlazy="03.jpg" width="500" height="500">
    <img data-funlazy="04.jpg" width="500" height="500">
    <img data-funlazy="05.jpg" width="500" height="500">
    <img data-funlazy="06.jpg" width="500" height="500">
    <img data-funlazy="07.jpg" width="500" height="500">
    <img data-funlazy="08.jpg" width="500" height="500">
    <img data-funlazy="09.jpg" width="500" height="500">
    <img data-funlazy="10.jpg" width="500" height="500">
</body>

<script>
    FunLazy({});
</script>
````

##### 相对于窗口 - 横向
```html
<body>
    <img data-funlazy="01.jpg" width="500" height="500">
    <img data-funlazy="02.jpg" width="500" height="500">
    <img data-funlazy="03.jpg" width="500" height="500">
    <img data-funlazy="04.jpg" width="500" height="500">
    <img data-funlazy="05.jpg" width="500" height="500">
    <img data-funlazy="06.jpg" width="500" height="500">
    <img data-funlazy="07.jpg" width="500" height="500">
    <img data-funlazy="08.jpg" width="500" height="500">
    <img data-funlazy="09.jpg" width="500" height="500">
    <img data-funlazy="10.jpg" width="500" height="500">
</body>

<script>
    FunLazy({
        axis: "x"
    });
</script>
````

##### 相对于指定容器 - 纵向
```html
<div id="box" style="width:520px;height:500px;overflow-y:auto;">
    <img data-funlazy="01.jpg" width="500" height="500">
    <img data-funlazy="02.jpg" width="500" height="500">
    <img data-funlazy="03.jpg" width="500" height="500">
    <img data-funlazy="04.jpg" width="500" height="500">
    <img data-funlazy="05.jpg" width="500" height="500">
    <img data-funlazy="06.jpg" width="500" height="500">
    <img data-funlazy="07.jpg" width="500" height="500">
    <img data-funlazy="08.jpg" width="500" height="500">
    <img data-funlazy="09.jpg" width="500" height="500">
    <img data-funlazy="10.jpg" width="500" height="500">
</body>

<script>
    FunLazy({
        container: "#box"
    });
</script>
````

##### 相对于指定容器 - 横向
```html
<style>
    img { float:left; }
</style>
<div id="box" style="width:520px;height:500px;overflow-x:auto;">
    <div style="width:5000px;height:500px;">
        <img data-funlazy="01.jpg" width="500" height="500">
        <img data-funlazy="02.jpg" width="500" height="500">
        <img data-funlazy="03.jpg" width="500" height="500">
        <img data-funlazy="04.jpg" width="500" height="500">
        <img data-funlazy="05.jpg" width="500" height="500">
        <img data-funlazy="06.jpg" width="500" height="500">
        <img data-funlazy="07.jpg" width="500" height="500">
        <img data-funlazy="08.jpg" width="500" height="500">
        <img data-funlazy="09.jpg" width="500" height="500">
        <img data-funlazy="10.jpg" width="500" height="500">
    </div>
</body>

<script>
    FunLazy({
        container: "#box",
        axis: "x"
    });
</script>
````

<hr/>

<h2>API 参数</h2>
<table>
    <tr>
        <td>参数</td>
        <td>说明</td>
        <td>类型</td>
        <td>默认值</td>
    </tr>
    <tr>
        <td>container</td>
        <td>目标容器的选择器，默认基于 body</td>
        <td>String</td>
        <td>body</td>
    </tr>
    <tr>
        <td>effect</td>
        <td>图片显示效果，可选值：show, fadeIn（ fadeIn 不支持 IE9 ）</td>
        <td>String</td>
        <td>show</td>
    </tr>
    <tr>
        <td>placeholder</td>
        <td>占位图片</td>
        <td>String</td>
        <td>base64 编码的灰图</td>
    </tr>
    <tr>
        <td>errorPlaceholder</td>
        <td>图片加载失败时的占位图片</td>
        <td>String</td>
        <td>""</td>
    </tr>
    <tr>
        <td>threshold</td>
        <td>边界值，单位：px</td>
        <td>Number</td>
        <td>0</td>
    </tr>
    <tr>
        <td>width</td>
        <td>图片宽度，数字值时单位是 px，也可以是百分比形式，<br>可通过 css 或行内属性设置</td>
        <td>Number / String</td>
        <td>""</td>
    </tr>
    <tr>
        <td>height</td>
        <td>图片高度，数字值时单位是 px，也可以是百分比形式，<br>可通过 css 或行内属性设置</td>
        <td>Number / String</td>
        <td>""</td>
    </tr>
    <tr>
        <td>axis</td>
        <td>容器滚动方向，可选值：x, y</td>
        <td>String</td>
        <td>y</td>
    </tr>
    <tr>
        <td>eventType</td>
        <td>指定加载图片的鼠标事件，可选值：click, dblclick, mouseover</td>
        <td>String</td>
        <td>""</td>
    </tr>
    <tr>
        <td>onSuccess</td>
        <td>图片加载成功时执行的回调函数，回调参数有两个：<br>
1. 图片加载成功的元素<br>
2. 加载成功的图片地址</td>
        <td>Function</td>
        <td>空函数</td>
    </tr>
    <tr>
        <td>onError</td>
        <td>图片加载失败时执行的回调函数，回调参数有两个：<br>
1. 图片加载失败的元素<br>
2. 加载失败的图片地址</td>
        <td>Function</td>
        <td>空函数</td>
    </tr>
</table>


<hr/>

<h2>开源协议</h2>
<p><a href="https://gitee.com/dreamer365/FunLazy/blob/master/LICENSE">MIT License</a></p>

<hr/>

<h2>浏览器支持</h2>

| Chrome       | Firefox      | Opera        | Edge         | Safari       | IE9+         |
| ---          | ---          | ---          | ---          | ---          | ---          |
|  支持  |  支持  |  支持  |  支持  |  支持  |  支持  |

