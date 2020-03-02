/*!
 * FunLazy v2.1.0
 * Copyright (C) 2020, ZG
 * Released under the MIT license.
 */
!(function ( global, factory ) {

    if ( typeof define === "function" && define.cmd ) {
        define( factory );
    } else if ( typeof module !== "undefined" && typeof exports === "object" ) {
        module.exports = factory( global );
    } else {
        global.FunLazy = factory( global );
    }

})( typeof window !== "undefined" ? window : this, function ( global ) {

    "use strict";

    var document = window.document;
    var docElem = document.documentElement;
    var $head = document.head;

    // 检测浏览器对 "IntersectionObserver" 和 "MutationObserver" 方法的支持情况
    var supportIntersectionObserver = typeof IntersectionObserver === "function";
    var supportMutationObserver = typeof MutationObserver === "function";

    // 默认配置
    var defaults = {
        container: "body",
        effect: "show",
        placeholder: "data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEXd3d3u346CAAAADUlEQVR42gECAP3/AAAAAgABUyucMAAAAABJRU5ErkJggg==",
        errorPlaceholder: "",
        threshold: 0,
        width: null,
        height: null,
        axis: "y",
        eventType: "",
        autoCheckChange: false,
        beforeLazy: function () {},
        onSuccess: function () {},
        onError: function () {}
    };

    // 淡入效果的样式 [ 不支持 IE 9 ]
    var duration = 400;
    var fadeInCSS = "\
        .funlazy-fadeIn {\
            -webkit-animation: funlazy-fadeIn " + duration + "ms ease 0s 1 normal forwards running;\
            -moz-animation: funlazy-fadeIn " + duration + "ms ease 0s 1 normal forwards running;\
            animation: funlazy-fadeIn " + duration + "ms ease 0s 1 normal forwards running;\
        }\
        @-webkit-keyframes funlazy-fadeIn {\
            from { opacity: 0; }\
            to   { opacity: 1; }\
        }\
        @-moz-keyframes funlazy-fadeIn {\
            from { opacity: 0; }\
            to   { opacity: 1; }\
        }\
        @keyframes funlazy-fadeIn {\
            from { opacity: 0; }\
            to   { opacity: 1; }\
        }\
    ";

    // 动态添加 style
    var $style = document.getElementById( "funlazy-fadeIn-style" );
    if ( $style ) {
        $head.removeChild( $style );
    }
    $head.insertAdjacentHTML( "afterbegin", '<style id="funlazy-fadeIn-style">' + fadeInCSS + '</style>' );

    // 获取样式
    function getCSS ( elem, name ) {
        return document.defaultView.getComputedStyle( elem, null ).getPropertyValue( name );
    }

    // 设置图片
    function setImage ( el, src, isImg ) {
        if ( isImg ) {
            el.src = src;
        } else {
            el.style.backgroundImage = "url(" + src + ")";
        }
    }

    // 判断目标元素的祖先元素中是否有隐藏的元素
    var hasHidden = false;
    var parent = null;
    function parentsHasHidden ( elem ) {
        if ( document.body.contains( elem ) ) {
            if ( elem.parentNode.nodeName.toLowerCase() !== "body" ) {
                parent = elem.parentNode;
                if ( getCSS( parent, "display" ) === "none" || getCSS( parent, "visibility" ) === "hidden" ) {
                    hasHidden = true;
                } else {
                    parentsHasHidden( parent );
                }
            }
        }
        return hasHidden;
    }

    // FunLazy 函数
    var FunLazy = function ( options ) {

        // 合并参数
        var opt = (function ( options, defaults ) {
            var obj = {};
            for ( var key in defaults ) {
                obj[ key ] = options[ key ] || defaults[ key ];
            }
            return obj;
        })( options || {}, defaults );

        // 检测事件是否为函数形式
        var beforeLazyIsFunc = typeof opt.beforeLazy === "function",
            successIsFunc = typeof opt.onSuccess === "function",
            errorIsFunc = typeof opt.onError === "function";

        // 目标元素
        var $container = document.querySelector( opt.container );
        if ( !$container ) {
            return;
        }

        // 需要执行懒加载操作的元素必须设置了 data-funlazy 属性
        var $funlazy = $container.querySelectorAll( "[data-funlazy]" );
        if ( !$funlazy.length ) {
            return;
        }

        [].slice.call( $funlazy ).forEach(function ( $this ) {

            // 图片真实地址
            var lazy = $this.getAttribute( "data-funlazy" ).trim(); 

            // 含有以下任一条件的元素不进行懒加载操作:
            // - 没有设置有效的 data-funlazy 属性
            // - 此元素本身处于隐藏状态
            // - 此元素含有处于隐藏状态的祖先元素
            // - 此元素本身 opacity: 0
            // - 已经成功进行过懒加载操作的元素
            if ( 
                !lazy || 
                getCSS( $this, "display" ) === "none" || 
                getCSS( $this, "visibility" ) === "hidden" || 
                parentsHasHidden( $this ) ||
                getCSS( $this, "opacity" ) === 0 ||
                $this.funlazyLoaded
            ) {
                return;
            }

            // 是否为 <img> 元素
            var isImg = $this.nodeName.toLowerCase() === "img";

            // 添加占位图片
            if ( typeof opt.placeholder === "string" ) {
                setImage( $this, opt.placeholder, isImg );
            }

            // 通过脚本设置宽高
            // 也可以通过 css 或属性设置
            if ( opt.width ) {
                $this.style.width = typeof opt.width === "string" ? opt.width : opt.width + "px";
            }
            if ( opt.height ) {
                $this.style.height = typeof opt.height === "string" ? opt.height : opt.height + "px";
            }

            // 加载图片
            function load ( $target, callback ) {

                // 如果此元素已经完成了懒加载操作
                // 则直接执行回调
                if ( $target.funlazyLoaded ) {
                    callback && callback( true );
                    return;
                }

                // 创建一个 <img> 执行加载操作
                var image = new Image();
                image.onload = function () {

                    // 将真实图片地址赋给元素
                    setImage( $target, lazy, isImg );

                    // fadeIn 淡入效果
                    if ( opt.effect === "fadeIn" && "classList" in docElem ) {
                        $target.classList.add( "funlazy-fadeIn" );
                        var timer = window.setTimeout(function () {
                            window.clearTimeout( timer );
                            $target.classList.remove( "funlazy-fadeIn" );
                        }, duration);
                    }

                    // 执行 success 回调
                    if ( !$target.funlazyLoaded && successIsFunc ) {
                        opt.onSuccess( $target, lazy );
                    }

                    // 添加成功标识
                    $target.funlazyLoaded = true;

                    callback && callback( true );
                }
                image.onerror = function () {

                    // 图片加载失败时添加特定的展位图片
                    if ( typeof opt.errorPlaceholder === "string" ) {
                        setImage( $target, opt.errorPlaceholder, isImg );
                    }
                        
                    // 执行 error 回调
                    if ( !$target.funlazyFailed && errorIsFunc ) {
                        opt.onError( $target, lazy );
                    }

                    // 添加失败标识
                    $target.funlazyFailed = true;

                    callback && callback( false );
                }

                // 加载图片之前执行的事件
                if ( beforeLazyIsFunc ) {
                    var newSrc = opt.beforeLazy( lazy );
                    lazy = newSrc || lazy;
                }

                image.src = lazy;
            }

            // 获取目标元素宽高
            var thisWidth = parseInt( getCSS( $this, "width" ) ),
                thisHeight = parseInt( getCSS( $this, "height" ) );

            // 监听
            function listener () {
                if ( !$this.funlazyLoaded ) {

                    // 优先使用 IntersectionObserver 方法
                    if ( supportIntersectionObserver ) { 
                        var threshold = typeof opt.threshold === "number" && opt.threshold > 0 ? opt.threshold : 0;
                        var io = new IntersectionObserver(function ( entries ) {
                            entries.forEach(function ( item ) {
                                if ( item.target && item.isIntersecting ) {
                                    load(item.target, function ( bool ) {
                                        if ( bool === true ) {
                                            io.unobserve( item.target );
                                        }
                                    });
                                }
                            })
                        }, {
                            root: opt.container === "body" ? null : $container,
                            threshold: [ 0 ],
                            rootMargin: "0px " + ( opt.axis === "x" ? threshold : 0 ) + "px " + ( opt.axis === "y" ? threshold : 0 ) + "px 0px"
                        });
                        io.observe( $this );
                    } else {

                        // 相对于窗口
                        var client = function () {
                            try {
                                var rect = $this.getBoundingClientRect();
                                if ( opt.axis === "x" ) {
                                    var winLeft = window.pageXOffset;
                                    if ( winLeft < rect.left + winLeft + opt.threshold + thisWidth ) {
                                        if ( docElem.clientWidth + winLeft > rect.left + winLeft - opt.threshold ) {
                                            load( $this );
                                        }
                                    }
                                }
                                if ( opt.axis === "y" ) {
                                    var winTop = window.pageYOffset;      
                                    if ( winTop < rect.top + winTop + opt.threshold + thisHeight ) {
                                        if ( docElem.clientHeight + winTop > rect.top + winTop - opt.threshold ) {
                                            load( $this );
                                        }
                                    }
                                }
                            } catch( e ) {}
                        }

                        if ( opt.container === "body" ) {
                            client();
                        } else {

                            // 相对于指定元素
                            if ( $container ) {
                                if ( getCSS( $container, "position" ) === "fixed" ) {
                                    client();
                                } else {
                                    try {
                                        if ( opt.axis === "x" ) {
                                            var containerLeft = $container.scrollLeft;
                                            if ( containerLeft < $this.offsetLeft + opt.threshold + thisWidth ) {
                                                if ( parseInt( getCSS( $container, "width" ) ) + containerLeft > $this.offsetLeft - opt.threshold ) {
                                                    load( $this );
                                                }
                                            }
                                        }
                                        if ( opt.axis === "y" ) {
                                            var containerTop = $container.scrollTop; 
                                            if ( containerTop < $this.offsetTop + opt.threshold + thisHeight ) {
                                                if ( parseInt( getCSS( $container, "height" ) ) + containerTop > $this.offsetTop - opt.threshold ) {
                                                    load( $this );
                                                }
                                            }
                                        }
                                    } catch( e ) {}
                                }
                            }
                        }
                    }
                }
            }
            
            // 指定了鼠标事件类型
            if ( opt.eventType.match( /(click|dblclick|mouseover)/ ) ) {
                document.addEventListener(opt.eventType, function ( event ) {
                    if ( event.target === $this && !$this.funlazyLoaded && !$this.funlazyFailed ) {
                        load( $this );
                    }
                });
            } else {
                listener();
            }

            // 对于不支持 IntersectionObserver 方法的浏览器
            // 需要实时监听目标区域的 scroll 和 resize 事件
            if ( !supportIntersectionObserver && !opt.eventType ) {  
                var $elem = opt.container === "body" ? window : $container;
                var timer = null,
                    trigger = false;
                var control = function () {
                    if ( trigger ) {
                        return;
                    }
                    trigger = true;
                    listener();
                    timer = window.setTimeout(function () {
                        window.clearTimeout( timer );
                        trigger = false;
                        listener();
                    }, 200);
                }
                $elem.addEventListener( "scroll", control );
                $elem.addEventListener( "resize", control );
            }
        })

        // 实时检测目标元素内含有 data-funlazy 属性的元素的变化情况
        // 可以对新增的懒加载元素进行自动解析
        // 此功能暂不支持 IE 9 - 10
        if ( opt.autoCheckChange ) {
            if ( supportMutationObserver ) {
                new MutationObserver(function () {
                    FunLazy( opt );
                }).observe($container, {
                    childList: true,
                    subtree: true
                });
            }
        }

        return opt;     
    }

    return FunLazy;

});