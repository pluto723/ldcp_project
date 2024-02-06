import {events} from './mitt'
import {onUnmounted} from "vue";
export function btnCommand(data,focusData){
    //前进、后退的状态
    const state = {
        //索引
        current:-1,
        //存放一段时间内的所有操作函数
        queue:[],
        commands:{},
        commandArray:[],
        destroyArray:[]
    }
    //用于注册函数（将函数挂载到state上）
    const registry = (command)=>{
        state.commandArray.push(command)
        state.commands[command.name] = ()=>{
            const {redo,undo} = command.execute()
            //执行命令
            redo()
            if (!command.pushQueue){
                return
            }
            let {queue,current} = state
            //在放置组件过程中可能有撤销操作
            if (queue.length > 0){
                queue = queue.slice(0,current + 1)
                state.queue = queue
            }
            //将执行过的命令放入队列中
            queue.push({redo,undo})
            state.current = current + 1
        }
    }
    //重做函数
    registry({
        name:'redo',
        execute(){
            //闭包
            return {redo(){
                //找到下一步操作
                    let item = state.queue[state.current+1]
                    if (item){
                        item.redo && item.redo()
                        state.current++
                    }
            }}
        }
    })
    //撤销函数
    registry({
        name:'undo',
        execute(){
            //闭包
            return {redo(){
                    //当队列中无命令时，无法撤销
                    if (state.current === -1){
                        return
                    }
                    //找到上一步操作
                    let item = state.queue[state.current]
                    if (item){
                        item.undo && item.undo()
                        state.current--
                    }
                }}
        }
    })
    registry({
        name:'drag',
        pushQueue:true,
        init(){
            this.before = null
            //监测鼠标拖拽开始前的事件，将dom保存在before中
            const start = ()=>{
                this.before = JSON.parse(JSON.stringify(data.value.blocks)) // 深拷贝以确保不会影响原始数据
            }
            const end = ()=>{
                state.commands.drag && state.commands.drag();
            }
            events.on('start',start)
            events.on('end',end)
            return ()=>{
                events.off('start',start)
                events.off('end',end)
            }
        },
        execute(){
            let before = this.before
            let after = data.value.blocks
            //闭包
            return {
                redo(){
                    //重做
                    data.value = {...data.value,blocks:after}
                },
                undo(){
                    //撤销
                    data.value = {...data.value,blocks:before}
                }
            }
        }
    });
    //置顶函数
    registry({
        name:'placeTop',
        pushQueue:true,
        execute(){
            let before = JSON.parse(JSON.stringify(data.value.blocks))
            let after = (()=>{
                let {focus,unfocused} = focusData.value
                //遍历找出未选中的组件中最大的zIndex
                let maxZIndex = unfocused.reduce((prev,block)=>{
                    return Math.max(prev,block.zIndex)
                },-Infinity)
                //使选中的组件的zIndex在最大值的基础上再加一
                focus.forEach(block=>{
                    block.zIndex = maxZIndex + 1
                })
                return data.value.blocks
            })()
            return{
                redo(){
                    //重做
                    data.value = {...data.value,blocks:after}
                },
                undo(){
                    //撤销
                    data.value = {...data.value,blocks:before}
                }
            }
        }
    });
    //置底函数
    registry({
        name:'placeBottom',
        pushQueue:true,
        execute(){
            let before = JSON.parse(JSON.stringify(data.value.blocks))
            let after = (()=>{
                let {focus,unfocused} = focusData.value
                //遍历找出未选中的组件中最小的zIndex
                let minZIndex = unfocused.reduce((prev,block)=>{
                    return Math.min(prev,block.zIndex)
                },Infinity)
                //使选中的组件的zIndex在最小值的基础上再减一
                if(minZIndex < 0){
                    const dur = Math.abs(minZIndex)
                    minZIndex = 0
                    unfocused.forEach(block => block.zIndex += dur)
                }
                focus.forEach(block=>{
                    block.zIndex = minZIndex
                })
                return data.value.blocks
            })()
            return{
                redo(){
                    //重做
                    data.value = {...data.value,blocks:after}
                },
                undo(){
                    //撤销
                    data.value = {...data.value,blocks:before}
                }
            }
        }
    });
    //删除函数
    registry({
        name:'delete',
        pushQueue:true,
        execute(){
            let before = JSON.parse(JSON.stringify(data.value.blocks))
            let after = focusData.value.unfocused.filter(val => val.key)
            return{
                redo(){
                    //重做
                    data.value ={...data.value,blocks:after}
                },
                undo(){
                    //撤销
                    data.value = {...data.value,blocks:before}
                }
            }
        }
    });
    //立即执行函数
    (()=>{
        state.commandArray.forEach(command =>{
            command.init && state.destroyArray.push(command.init())
        })
    })()
    //情况绑定的事件
    onUnmounted(()=>{
        state.destroyArray.forEach(fn=>{
            fn && fn()
        })
    })
    return {
        state
    }
}