<br>
<h1 align="center">FunLazy</h1>

<h4 align="center">无任何依赖的轻量级图片懒加载组件</h4>

<blockquote align="center">
  这是一个完全使用原生 JavaScript 开发的图片懒加载组件，可完美支持主流的现代高级浏览器<br>
组件会优先使用 Intersection Observer API，以此提高懒加载的性能
</blockquote>

<h4 align="center"><a href="http://dreamer365.gitee.io/funlazy/" target="_blank">查看在线示例</a></h4>



## 安装组件
#### 本地引入

```html
<script src="funlazy.min.js"></script>
```

#### cdn 引入

```html
<script src="https://unpkg.com/funlazy@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/funlazy@latest"></script>
```

#### npm 安装

```javascript
npm i funlazy -S
const FunLazy = require( "funlazy" );
```
<hr/>

## 使用方法
#### 最简单的用法是直接调用 `FunLazy` 函数：

```html
<img data-funlazy="1.jpg" width="500" height="309">
<img data-funlazy="2.jpg" width="500" height="309">
<img data-funlazy="3.jpg" width="500" height="309">

<script>
    FunLazy();
</script>
```

#### 在 vue 单文件中使用（vue2.x 写法）：

```html
<template>
    <div>
        <img v-for="img of images" :key="img" :data-funlazy="img" width="500" height="309">
    </div>
</template>

<script>
    const FunLazy = require( "funlazy" );
    export default {
        data () {
            return {
                images: [
                    require( "./assets/img/1.jpg" ),
                    require( "./assets/img/2.jpg" ),
                    require( "./assets/img/3.jpg" )
                ]
            }
        },
        mounted () {
            FunLazy();
        }
    }
</script>
```

#### 在 vue 单文件中使用（vue3.x 写法）：

```html
<template>
    <div>
        <img v-for="img of imageData.images" :key="img" :data-funlazy="img" width="500" height="309">
    </div>
</template>

<script>
    import { reactive, onMounted } from "vue";
    const FunLazy = require( "funlazy" );
    export default {
        setup () {
            const imageData = reactive({
                images: [
                    require( "./assets/img/10.jpg" ),
                    require( "./assets/img/11.jpg" ),
                    require( "./assets/img/12.jpg" ),
                    require( "./assets/img/13.jpg" )
                ]
            });

            onMounted(() => {
                FunLazy();
            })

            return {
                imageData
            }
        }
    }
</script>
```

#### 可自定义配置项：

```javascript
FunLazy({
    placeholder: "thumb.jpg",
    effect: "fadeIn"
});
```

#### 返回配置结果（v2.1.0 新增）：

```javascript
var opt = FunLazy({
    placeholder: "thumb.jpg",
    effect: "fadeIn"
});

// 根据传入的自定义配置项
// 与默认的配置项进行合并
// 返回合并之后的配置结果
console.log( opt );
```

#### 自动侦测懒加载元素的变化（v2.1.0 新增）：

```html
<button>添加图片</button>
<div>
    <img data-funlazy="1.jpg" width="500" height="309">
    <img data-funlazy="2.jpg" width="500" height="309">
    <img data-funlazy="3.jpg" width="500" height="309">
</div>

<script>
    var opt = FunLazy({
        autoCheckChange: true
    });

    // 设置 autoCheckChange: true
    // 新增加的图片会自动进行懒加载的解析
    // -------------------------------
    // -------------------------------
    // 不过此属性不支持 IE9 - 10
    // 在 IE9 - 10 中需要再次手动调用 FunLazy 函数来实现此功能，例如：
    var target = document.querySelector( "div" );
    document.querySelector( "button" ).addEventListener("click", function () {
        target.insertAdjacentHTML( "beforeend", '<img data-funlazy="new.jpg" width="500" height="309">' );

        // 支持 IE9 - 10
        if ( navigator.userAgent.toLowerCase().match( /msie (9|10)\.0/ ) ) {
            FunLazy( opt );
        }
    })
</script>
```

#### 加载图片前对图片地址进行处理（v2.1.0 新增）：

```html
<img data-funlazy="1.jpg" width="500" height="309">
<img data-funlazy="2.jpg" width="500" height="309">
<img data-funlazy="3.jpg" width="500" height="309">

<script>

    // beforeLazy 属性可用于在图片进行懒加载操作之前
    // 对图片地址进行最后的处理，相当于架设了一层拦截
    // 可以很简单的在加载前对图片地址进行一次批量处理
    FunLazy({
        beforeLazy: function ( src ) {
            return src + "?id=" + Math.random().toString( 36 ).substr( 2, 10 );
        }
    });
</script>
```

#### 当图片加载失败时使用指定的图片占位（v2.1.1 新增）：

```html
<img data-funlazy="1.jpg" width="500" height="309">
<img data-funlazy="2.jpg" width="500" height="309">
<img data-funlazy="3.jpg" width="500" height="309">

<script>

    // useErrorImagePlaceholder 属性可用于在图片加载失败时
    // 用一张默认的图片进行占位显示
    // - 设置为 true 则使用内置的灰色图进行占位
    // - 传入图片地址则可以自定义占位图
    FunLazy({
        useErrorImagePlaceholder: true
        
        // 或者：
        // useErrorImagePlaceholder: "img/error.jpg"
    });
</script>
```

<hr/>


## 配置参数
<table>
    <tr>
        <td>参数</td>
        <td>说明</td>
        <td>类型</td>
        <td>默认值</td>
    </tr>
    <tr>
        <td>container</td>
        <td>目标容器的选择器，默认基于 body，若传入 window, document, "html" 则统一转换为 "body"</td>
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
    <tr>
        <td>strictLazyMode<br>（v2.1.4 新增）</td>
        <td>严格懒加载模式，当此属性值为 true 时，懒加载元素如果满足以下任一条件，将不进行懒加载操作：<br>
            1. 此元素本身处于隐藏状态<br>2. 此元素本身 opacity: 0<br>3. 此元素含有处于隐藏状态的祖先元素</td>
        <td>Boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>beforeLazy<br>（v2.1.0 新增）</td>
        <td>在进行懒加载操作前执行的函数，函数参数是图片地址（可用于在<br>开始加载图片之前对图片地址做最后的处理，并返回处理后的图片地址）</td>
        <td>Function</td>
        <td>空函数</td>
    </tr>
    <tr>
        <td>autoCheckChange<br>（v2.1.0 新增）</td>
        <td>自动检测目标元素内需要进行懒加载操作的元素的变化<br>（例如：动态添加新元素）并自动解析（不支持 IE 9 - 10）</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>useErrorImagePlaceholder<br>（v2.1.1 新增）</td>
        <td>当图片加载失败时，使用指定的图片进行占位显示<br>（可使用内置灰色图或自定义图片）</td>
        <td>Boolean / String</td>
        <td>false</td>
    </tr>
</table>


<hr/>

## 开源协议
<p><a href="https://gitee.com/dreamer365/FunLazy/blob/master/LICENSE">MIT License</a></p>

<hr/>

## 浏览器支持

| Chrome | Safari | Edge | Firefox | Opera | IE |
| --- | --- | --- | --- | --- | --- |
| 支持 | 支持 | 支持 | 支持 | 支持 | 9+ |

