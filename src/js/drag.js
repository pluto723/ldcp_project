import {events} from './mitt'
//封装拖拽事件
export function drag(containerRef,data){
    let currentComponent = null
    //设置拖拽事件
    const dragenter = (e)=>{
        e.dataTransfer.dropEffect = 'move'
    }
    const dragover = (e)=>{
        e.preventDefault()
    }
    const dragleave = (e)=>{
        e.dataTransfer.dropEffect = 'none'
    }
    const drop = (e)=>{
        let blocks = data.value.blocks
        //记录拖拽后的坐标
        data.value = {...data.value,blocks:[
                ...blocks,
                {
                    top:e.offsetY,
                    left:e.offsetX,
                    zIndex:1,
                    key:currentComponent.key,
                    alignCenter:true, //居中标识
                    props:{},
                    model:{}
                }
            ]

        }
        currentComponent = null
    }
    const dragstart = (e,component)=>{
        //绑定事件
        containerRef.value.addEventListener('dragenter',dragenter)
        containerRef.value.addEventListener('dragover',dragover)
        containerRef.value.addEventListener('dragleave',dragleave)
        containerRef.value.addEventListener('drop',drop)
        //获取对应的组件
        currentComponent = component
        //发布start事件
        events.emit('start')
    }
    const dragend = (e,component)=>{
        //解绑事件
        containerRef.value.removeEventListener('dragenter',dragenter)
        containerRef.value.removeEventListener('dragover',dragover)
        containerRef.value.removeEventListener('dragleave',dragleave)
        containerRef.value.removeEventListener('drop',drop)
        //发布end事件
        events.emit('end')
    }
    return{
        dragstart,
        dragend
    }
}