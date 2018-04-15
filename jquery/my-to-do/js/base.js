(function ($) {

    var $addTask = $('.add-task'),

        taskListArr =  store.get('taskList') || [],

        $taskDetail = $('.task-detail'),
        
        $del,
        msgAudio = document.getElementById('msgAudio'),

        $checkBox;

        Sortable.create(document.getElementById('taskList'), {
            animation: 150, //动画参数
       
            onEnd: function(evt){ //拖拽完毕之后发生该事件
                var id_arr=[]
                // 获取排序后的索引数组
                for(var i=0, len=evt.from.children.length; i<len; i++){
                    var itemTem = evt.from.children[i].getAttribute('data-index')
                    itemTem = parseInt(itemTem)
                    id_arr.push(itemTem);
                }
            

                var len = id_arr.length;
                var newArr = []
                
                for(var i=len-1;i>=0;i--){
                  
                    taskListArr[i].index = i
                   
                }
            
                // 重新对任务的数组进行排序，按照拖拽之后重新设置index，以便刷新可以按照当前的顺序显示
                for(var z=0,j=len-1;z<len,j>=0;z++,j--){
                    taskListArr[id_arr[z]].index = j
                    newArr.unshift(taskListArr[id_arr[z]])
                }
            

                // 重新写入localstorage
                store.set('taskList', newArr)
                taskListArr = store.get('taskList')
                refreshStore(taskListArr)
             }
        });
    
    refreshStore(taskListArr);
    remindTask()
    completTask()
    bindDel()
    bindDetail()
    

    /* 添加新任务 */ 
    $addTask.on('submit', function(e){
        var newTask = {},
            $input = $(this).find('input[name=content]'),
            content = $input.val();
        e.preventDefault()
        // 每次点击提交以后输入框置为空
        $input.val(null)
        newTask.content = content
        
        if(!content) {
            return
        }else{
            taskListArr.push(newTask)
            refreshStore(taskListArr)
        }
    })

    /* 删除按钮的事件绑定 获取当前这个item的索引，然后把对应索引的数组元素删除*/
    function bindDel(){
        $(document).on('click','.del',function(){
            $del = $('.btn .del');
            var delIndex = $(this).parent().parent().data('index')
        
            var cfm = confirm("确定要删除这个任务吗？");
            if(cfm){
                taskListArr.splice(delIndex,1)
            }else{
                return;
            }
            refreshStore(taskListArr)
        })
        // $del.on('click', delItem)
    }
    /**
     * 删除按钮的函数，
     * 
     * @returns 
     */
    // function delItem(){
    //     var delIndex = $(this).parent().parent().data('index')
        
    //     var cfm = confirm("确定要删除这个任务吗？");
    //     if(cfm){
    //         taskListArr.splice(delIndex,1)
    //     }else{
    //         return;
    //     }
 
    //     refreshStore(taskListArr)
    // }
    /**
     * 通过传入的索引和数据对数据列表进行更新
     * 
     * @param {any} index 
     * @param {any} data 
     * @returns 
     */
    function updateTask(index, data){
        
        if(!taskListArr[index]) return;
        taskListArr[index] = $.extend({},taskListArr[index],data)
        refreshStore(taskListArr)
    }

    /* 更新loacalStorege 并刷新任务栏 */
    function refreshStore(taskListArr){
       
        store.set('taskList', taskListArr)
        taskListArr = store.get('taskList');
        rederTskList(taskListArr);
        // bindDel()
        // bindDetail()
       
    }
    /**
     * 包装每个item模板,通过传入每一组数据和这组数据的索引
     * 
     * @param {any} data 
     * @param {any} index 
     * @returns 字符串
     */
    function taskListTmp(data, index){
        var taskItem = 
        `<div class="task-item${(data.complete)? ' completed': ''}" data-index=${index}>
                <span class="task-check"><input type="checkbox" ${(data.complete)? 'checked': ''} name="" class="check-box" id="check${index}"><label for="check${index}"></label></span>
                <span class="task-content">${data.content}</span>
                <span class="btn">
                    <span class='del'>删除</span>
                    <span class='detail'>详情</span>
                </span>
            </div>`;
        return taskItem
    }
    /**
     * 把每个item渲染进任务栏
     * 
     * @param {any} data  参数为任务列表数组
     */
    function rederTskList(data){
        var $taskList = $('.task-list')
        $taskList.html('');
        for(var i=0;i<data.length;i++){
            // 通过判断complete字段来区别任务是否完成
            // var tmp = data[i].complete
            // if(!tmp){
                $taskList.prepend(taskListTmp(data[i], i))
            // }else{
                // taskList.append(taskListTmp(data[i], i))
            // }
            
        }
    }

     /**
      * 对每个任务的勾选绑定事件，通过勾选状态设置一个新的属性到任务列表的每个对象里面
      * 
      */
     function completTask(){
        // $checkBox = $('.check-box')
        $(document).on('click','.check-box',function(e){
       
         
            var isCompelet = $(this).is(':checked')
            // console.log('$(this):',$(this).parent().parent().find('span').data('index'));
            // console.log('$(this):',$(this).parent().parent().data('index'));
            
            var thisIndex = $(this).parent().parent().data('index')
            // console.log('thisIndex:',thisIndex);
            
            // 通过判断选择框是否选中，然后给数据列表添加属性
            if(isCompelet){
                updateTask(thisIndex, {complete:true})

            }else{
                updateTask(thisIndex, {complete:false})
            }
            return false
             
        })
    }

    /* ==================任务详情区域=================== */

/**
 * 点击详情按钮，获取索引，弹出页面，填充html，启动datetime
 * 
 */
function bindDetail(){
    $(document).on('click','.detail',function(){

     
        // $('.btn .detail').on('click', function(){
            
            var detailIndex = $(this).parent().parent().data('index');
             
            
            $('.task-detail-mask').fadeIn(300,function(){
                $taskDetail.fadeIn(300)
            })
    
            $taskDetail.html('')
            $taskDetail.html(rederDetail(detailIndex))
            bindFresh(detailIndex)

            $('#datePicker').datetimepicker()
    
            
    
        })
    }
    
    $('.task-detail-mask').on('click', function(){
        detailNone()
    })

    $('.task-detail').on('dblclick','.content', function(e){
        $(this).hide()
        $('.contentB').show()

        
    })
    /**
     * 隐藏任务详情弹出
     * 
     */
    function detailNone(){
        $taskDetail.fadeOut(300, function(){
            $('.task-detail-mask').fadeOut(300)
        })
    }
    /**
     * 任务详情修改后的提交
     * 
     * @param {any} index 
     */
    function bindFresh(index){
        $('.form-detail').on('submit', function(e){
            e.preventDefault()
            taskListArr[index].content = $('.form-detail #newContent').val();
            taskListArr[index].desc = $('.form-detail [name=desc]').val();
            taskListArr[index].date = $('.form-detail [name=date]').val();
           
            store.set('taskList', taskListArr)
            updateTask(index, {completeRemind:false})
            // console.log($('.form-detail #newContent').val());
            
            detailNone()
            refreshStore(taskListArr)
            
            
        })
    }
/**
 * 渲染出任务详情的模板
 * 
 * @param {any} index 
 * @returns 
 */
function rederDetail(index){
    taskListArr = store.get('taskList');
       
        var detailData =  taskListArr[index];
       
        var tmp = 
        `<form  class="form-detail">
        <div class="content">${detailData.content}</div>
        <div class="contentB"><input type="text" id="newContent" value="${detailData.content}"></div>
        <div>
            <div class="desc">
                <textarea name="desc">${detailData.desc || ''}</textarea>
            </div>
        </div>
        <div class="remind">
        <p class="remind-title">设置提醒时间</p>
            <input type="text" placeholder="2012-12-12 10:00" name="date" id="datePicker" value="${detailData.date||''}">
        </div>
        <button type="submit">更新</button>
    </form>`

    

    return tmp
    }

    function remindTask(){
        var currentTime,
            remindTime;
            // item

        var time = setInterval(function(){
            for(var i=0;i<taskListArr.length;i++){
              
                console.log('taskListArr:',taskListArr);
                
                
                // item = get(i)
                if(!taskListArr[i].date || taskListArr[i].completeRemind ||taskListArr[i].complete){
                    continue
                }
                currentTime = (new Date()).getTime()
                remindTime = (new Date(taskListArr[i].date)).getTime();

                
                
                if(currentTime-remindTime>=1){
                    popRemind(taskListArr[i].content);
                    updateTask(i, {completeRemind:true})
                    msgAudio.play()
                    // $('.msg-audio').play()
    
                }
    
            }

        },1000)
        
    }

   function popRemind(content){
       console.log(content);
       $('.msg').fadeIn(300,function(){
           $('.msg-content').html(content)
       })
       $('.msg .msg-btn').on('click',function(){
        $('.msg').fadeOut(300)
       })
       
   }

})(jQuery);