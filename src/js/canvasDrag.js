//封装画布上的组件拖拽功能
export function canvasDrag(focusData){
    //对画布上选中的元素进行拖动
    let dragState = {
        startX:0,
        StartY:0
    }
    //修改被选中组件的位置
    const mousemove = (e) => {
        let {clientX:moveX,clientY:moveY} = e
        let durX = moveX - dragState.startX
        let durY = moveY - dragState.startY
        focusData.value.focus.forEach((block,idx)=>{
            block.top = dragState.startPos[idx].top + durY
            block.left = dragState.startPos[idx].left + durX
        })
    }
    const mouseup = (e) => {
        //解绑事件
        document.removeEventListener('mousemove',mousemove)
        document.removeEventListener('mouseup',mouseup)
    }
    const mousedown = (e)=>{
        dragState = {
            startX:e.clientX,
            startY:e.clientY,
            //记录每个被选中的组件的位置
            startPos:focusData.value.focus.map(({top,left})=>({top,left}))
        }
        //绑定事件
        document.addEventListener('mousemove',mousemove)
        document.addEventListener('mouseup',mouseup)
    }

    return{
        mousedown
    }
}