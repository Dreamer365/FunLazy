/*!
 * FunLazy v1.0.0
 * Copyright (C) 2020, ZG
 * Released under the MIT license.
 */
!(function ( global, factory ) {

    if ( typeof define === "function" && define.amd ) { 
        define([ "jquery" ], function ( jQuery ) {
            return factory( global, jQuery );
        });
    } else if ( typeof module !== "undefined" && typeof exports === "object" ) {
        factory( global, require( "jquery" ) );
    } else {
        factory( global, global.jQuery );
    }

})( typeof window !== "undefined" ? window : this, function ( window, $ ) {

    "use strict";

    // 检测 jquery
    !(function checkjQuery () {
        if ( typeof jQuery === "undefined" ) {
            throw new Error( "FunLazy 依赖 jQuery" );
        }
        var version = $.fn.jquery.split( "." );
        if ( ~~version[ 0 ] === 1 && ~~version[ 1 ] < 9 ) {
            throw new Error( "Funlazy 要求 jQuery 1.9.0+" );
        }
    })();

    var $window = $( window );
    var $document = $( document );

    // 检测浏览器对 "IntersectionObserver" 接口的支持情况
    var supportIntersectionObserver = typeof IntersectionObserver === "function";

    // 默认配置
    var defaultOptions = {
        container: null,
        effect: "show",
        placeholder: "data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEXd3d3u346CAAAADUlEQVR42gECAP3/AAAAAgABUyucMAAAAABJRU5ErkJggg==",
        errorPlaceholder: "",
        threshold: 0,
        width: null,
        height: null,
        axis: "y",
        eventType: "",
        onSuccess: $.noop,
        onError: $.noop
    };

    // 设置图片
    function setImage ( $el, src, isImg ) {
    	isImg ? 
    	$el.attr( "src", src ) : 
    	$el.css( "backgroundImage", "url(" + src + ")" );
    }

    // 扩展
    $.FunLazy = function ( options ) {
        var opt = $.extend( {}, defaultOptions, options );

        // 检测回调事件的合法性
        var successIsFunc = $.isFunction( opt.onSuccess ),
            errorIsFunc = $.isFunction( opt.onError );

        // 若未指定容器则以 <body> 为准
        // 需要执行懒加载操作的元素必须设置了 data-funlazy 属性
        var $container = $( opt.container || "body" );
        $container.find( "[data-funlazy]" ).each(function () {
            var $this = $( this );
            var _this = this;

            // 图片真实地址
            var lazy = $.trim( $this.attr( "data-funlazy" ) ); 

            // 含有以下任一条件的元素不进行懒加载操作:
            // + 没有设置有效的 data-funlazy 属性
            // + 此元素本身处于隐藏状态
            // + 此元素含有处于隐藏状态的祖先元素
            // + 此元素本身的 opacity: 0
            if ( 
            	!lazy || 
            	$this.is( ":hidden" ) || 
            	$this.parents().filter( ":hidden" ).length ||
            	$this.css( "opacity" ) === "0" 
            ) {
                $this.data( "funlazyOff", true );
            	return;
            }

            // 元素是否为 <img> 标签
            var isImg = $this.is( "img" );   

            // 添加占位图片
            if ( typeof opt.placeholder === "string" ) {
                setImage( $this, opt.placeholder, isImg );
            }

            // 通过脚本设置宽高
            // 也可以通过 css 或内联属性设置
            if ( opt.width ) {
                $this.css( "width", typeof opt.width === "string" ? opt.width : opt.width + "px" );
            }
            if ( opt.height ) {
                $this.css( "height", typeof opt.height === "string" ? opt.height : opt.height + "px" );
            }

            // 加载图片
            function load ( $target ) {
                var target = $target.get( 0 );

                // 设置一个异步系统
                var dfd = $.Deferred();

                // 如果此元素已经完成了懒加载操作
                // 则直接完成异步操作
                if ( $target.data( "funlazyLoaded" ) ) {
                    dfd.resolve();
                    return dfd;
                }

                // 创建一个 <img>
                // 执行加载操作
                $( "<img>" ).on({
                    load: function () {

                    	// 将真实图片地址赋给元素
                    	setImage( $target, lazy, isImg );

                        // fadeIn 淡入效果
                        if ( opt.effect.substring( 0, 6 ) === "fadeIn" ) {

                            // 是否指定了过渡时间
                            var duration = opt.effect.match( /\((.*)\)/ );

                            $target.css( "visibility", "hidden" ).hide().fadeIn( duration ? parseInt( duration[ 1 ] ) : 400 );
                            try {
                                target.style.removeProperty( "visibility" );
                            } catch ( e ) {
                                $target.css( "visibility", "visible" );
                            }
                        }

                        // 执行 success 回调
                        if ( !$target.data( "funlazyLoaded" ) && successIsFunc ) {
                            opt.onSuccess( target, lazy );
                        }

                        // 添加完成懒加载操作的标识
                        $target.data( "funlazyLoaded", true );

                        dfd.resolve();
                    },
                    error: function () {

                    	// 图片加载失败时添加特定的展位图片
                    	if ( typeof opt.errorPlaceholder === "string" ) {
                    		setImage( $target, opt.errorPlaceholder, isImg );
                    	}
                    	
                    	// 执行 error 回调
                        if ( !$target.data( "funlazyFailed" ) && errorIsFunc ) {
                            opt.onError( target, lazy );
                        }

                        // 添加失败标识
                        $target.data( "funlazyFailed", true );

                        dfd.reject();
                    }
                }).attr( "src", lazy );
                return dfd;
            }

            // 监听
            function listener () {
                if ( !$this.data( "funlazyLoaded" ) ) {

                    // 优先使用 IntersectionObserver 方法
                    if ( supportIntersectionObserver ) { 
                        var threshold = $.isNumeric( opt.threshold ) && opt.threshold > 0 ? opt.threshold : 0;
                        var io = new IntersectionObserver(function ( entries ) {
                            $.each(entries, function ( i, obj ) {
                                var $el = $( obj.target );
                                if ( obj.isIntersecting ) {
                                    load( $el ).done(function () {
                                        io.unobserve( obj.target );
                                    });
                                }
                            })
                        }, {
                            root: !opt.container ? null : $container.get( 0 ),
                            threshold: [ 0 ],
                            rootMargin: "0px " + ( opt.axis === "x" ? threshold : 0 ) + "px " + ( opt.axis === "y" ? threshold : 0 ) + "px 0px"
                        });
                        io.observe( _this );
                    } else {

                        // 相对于窗口
                        if ( !opt.container ) {
                            var offset = $this.offset();
                            if ( opt.axis === "x" ) {
                                var winLeft = $window.scrollLeft();
                                if ( winLeft < offset.left + opt.threshold + $this.width() ) {
                                    if ( $window.width() + winLeft > offset.left - opt.threshold ) {
                                        load( $this );
                                    }
                                }
                            }
                            if ( opt.axis === "y" ) {
                                var winTop = $window.scrollTop();
                                if ( winTop < offset.top + opt.threshold + $this.height() ) {
                                    if ( $window.height() + winTop > offset.top - opt.threshold ) {
                                        load( $this );
                                    }
                                }
                            }
                        } else {

                            // 相对于指定元素
                            if ( $container.length ) {
                                var pos = $this.position();
                                if ( opt.axis === "x" ) {
                                    var containerLeft = $container.scrollLeft();
                                    if ( containerLeft < pos.left + opt.threshold + $this.width() ) {
                                        if ( $container.width() + containerLeft > pos.left - opt.threshold ) {
                                            load( $this );
                                        }
                                    }
                                }
                                if ( opt.axis === "y" ) {
                                    var containerTop = $container.scrollTop();
                                    if ( containerTop < pos.top + opt.threshold + $this.height() ) {
                                        if ( $container.height() + containerTop > pos.top - opt.threshold ) {
                                            load( $this );
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 指定了鼠标事件类型
            if ( opt.eventType.match( /(click|dblclick|mouseover)/ ) ) {
                $document.on(opt.eventType + ".funlazy", function ( event ) {
                    if ( $( event.target ).is( $this ) ) {
                        load( $this );
                    }
                })
            } else {
                listener();
            }

            // 对于不支持 IntersectionObserver 方法的浏览器
            // 需要实时监听目标区域的 scroll 和 resize 事件
            if ( !supportIntersectionObserver && !opt.eventType ) {
                ( !opt.container ? $window : $( opt.container ) ).on({
                    "scroll.funlazy": listener,
                    "resize.funlazy": listener
                });
            }
        })
    }

});