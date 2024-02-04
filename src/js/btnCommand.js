import {events} from './mitt'
import {onUnmounted} from "vue";
export function btnCommand(data){
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
            console.log(queue)
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
                        console.log('重做')
                        console.log(data.value.blocks)
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
                        console.log('撤销')
                        console.log(data.value.blocks)
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
                this.before = data.value.blocks
            }
            const end = ()=>{
                state.commands.drag()
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
                    //撤销
                    data.value = {...data.value,blocks:after}
                },
                undo(){
                    //重做
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