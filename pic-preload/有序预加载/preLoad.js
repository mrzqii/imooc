
// 这个是封装的一个预加载的插件
;(function ($) {
    function preLoad(imgs, options) {
        this.imgs = (typeof imgs === 'string')? [imgs]:imgs;
        this.opts = $.extend({},preLoad.DEFAULT,options) //对传入的参数进行扩展

        
        if (this.opts.order){
            console.log(1)
            this._orderPreload()//执行有序加载
        }else{
            this._preload() //执行无序加载
        }
    }
    preLoad.DEFAULT = {//设置默认的配置参数
        order: null, //如果配置了第一个参数，那么就执行有序加载
        each: null, //每一张图片加载完了执行什么函数
        all : null //全部图片加载完了执行什么函数
    }
    // 有序加载图片
    preLoad.prototype._orderPreload = function(){
        console.log('进入有序')
        
        var imgs = this.imgs,
            opts = this.opts,
            count = 0,
            len = imgs.length;
        load()
        function load() {
             
            var imgObj = new Image() 
               
            $(imgObj).on('load error', function () {

                opts.each && opts.each(count);

                if (count > len - 1) {
                    //当图片加载完了该做什么
                    opts.all && opts.all();
                } else {
                    load()
                }
                count++
            })

            imgObj.src = imgs[count]
        }
    },
     // 无序加载图片
    preLoad.prototype._preload = function () {
        console.log('进入无序')
        var imgs = this.imgs,
            opts = this.opts,
            count = 0,
            len = imgs.length;

        $.each(imgs, function(i,src){
            if(typeof src !== 'string') return;//判断下src，保证它是字符串
            var imgObj = new Image();
            imgObj.src = src;
            $(imgObj).on('load', function () { //每张图片加载完成后都会触发这个事件
               opts.each && opts.each(count, len);//保证传入了参数,避免发生错误
               count++;
               if (count > len - 1) {
                   opts.all && opts.all();
                }
            })
            
            
        })
    }

    // 在jquery中两种导出构造函数的方法：
    // $.fn.extend 这样子做到时候是这样使用： $('#img').preLoad()
    // $.extend 这样子做到时候是这样使用： $.preLoad()



    // 我们使用这种方法，把preload对象作为jquery的一个方法
    // $.extend({
    //     preload: function (imgs, opts) {
    //         new preLoad(imgs, opts)
    //     }
    // })

    // 我们还可以这样，把preload作为window的一个对象
    window.preload = preLoad;


})(jQuery)