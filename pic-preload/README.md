### 预加载插件  
#### 整体结构  
```
;(function ($) {
    function preLoad(imgs, options) {
        this.imgs = (typeof imgs === 'string')? [imgs]:imgs;
        this.opts = $.extend({},preLoad.DEFAULT,options) //对传入的参数进行扩展

        
        if (this.opts.order){
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
         
    },
     // 无序加载图片
    preLoad.prototype._preload = function () {
       
    }
 
    window.preload = preLoad;

})(jQuery)

```
### 思路：
首先会有一个图片地址组成的数组  

然后会循环这个数组，每次循环的时候会new Image()对象  

然后设置这个新建的图片对象的src=imgs[i]  

最后就是监听图片加载成功的load事件，这里面可以写加载一张图片的回调函数each和加载全部图片的回调函数all  
### 使用：

```
new preload(imgs,{  

    order:  XX,  根据需要，可以不写

    each:function(){根据需要，可以不写},  

    all:function(){根据需要，可以不写}
        
})
```
### 有序加载和无序加载
有序加载就是第一张加载完了然后加载第二张  

无序加载就是一起加载  

当配置参数order的值不为null的时候，就会执行有序加载  