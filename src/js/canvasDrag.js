//封装画布上的组件拖拽功能
import {reactive} from "vue";
import {events} from "./mitt";
export function canvasDrag(focusData, selectLastBlock,data){
    //对画布上选中的元素进行拖动
    let dragState = {
        startX:0,
        StartY:0,
        //拖拽标识
        dragging:false
    }
    let markLine = reactive({
        x:null,
        y:null
    })
    const mousedown = (e)=>{
        const {height:Bheight,width:Bwidth} = selectLastBlock.value
        dragState = {
            startX:e.clientX,
            startY:e.clientY,
            //拖拽前的位置
            startLeft:selectLastBlock.value.left,
            startTop:selectLastBlock.value.top,
            dragging: false,
            //记录每个被选中的组件的位置
            startPos:focusData.value.focus.map(({top,left})=>({top,left})),
            //辅助线
            line:(()=>{
                const {unfocused} = focusData.value
                //保存辅助线的坐标
                let lines = {x:[],y:[]}
                //将画布的属性加入，使组件能相对画布居中对齐
                unfocused.push(
                    {
                        top:0,
                        left:0,
                        height:data.value.container.height,
                        width:data.value.container.width,
                    }
                )
                unfocused.forEach((block)=>{
                    const {top:Atop,left:Aleft,height:Aheight,width:Awidth} = block
                    //顶对顶
                    lines.y.push({showTop:Atop,top:Atop})
                    //顶对底
                    lines.y.push({showTop:Atop,top:Atop-Bheight})
                    //中对中
                    lines.y.push({showTop:Atop+Aheight/2,top:Atop+Aheight/2-Bheight/2})
                    //底对顶
                    lines.y.push({showTop:Atop+Aheight,top:Atop+Aheight})
                    //底对底
                    lines.y.push({showTop:Atop+Aheight,top:Atop+Aheight-Bheight})
                    //左对左
                    lines.x.push({showLeft:Aleft,left:Aleft})
                    //右对左
                    lines.x.push({showLeft:Aleft+Awidth,left:Aleft+Awidth})
                    lines.x.push({showLeft:Aleft+Awidth/2,left:Aleft+Awidth/2-Bwidth/2})
                    lines.x.push({showLeft:Aleft+Awidth,left:Aleft+Awidth-Bwidth})
                    //左对右
                    lines.x.push({showLeft:Aleft,left:Aleft-Bwidth})
                })
                return lines
            })()
        }
        //绑定事件
        document.addEventListener('mousemove',mousemove)
        document.addEventListener('mouseup',mouseup)
    }
    //修改被选中组件的位置
    const mousemove = (e) => {
        let {clientX:moveX,clientY:moveY} = e
        //组件移动时实时更新辅助线的位置
        let top = moveY - dragState.startY + dragState.startTop
        let left = moveX - dragState.startX + dragState.startLeft
        let y = null
        let x = null
        for(let i= 0;i < dragState.line.y.length;i++){
            const {top:t,showTop:s} = dragState.line.y[i]
            //当距离小于5时触发组件对齐
            if(Math.abs(t - top) < 5){
                //辅助线显示的位置
                y = s
                //实现组件之间的快速对齐
                moveY = dragState.startY - dragState.startTop + t
                //只需找到一根辅助线就跳出循环
                break
            }
        }
        for(let i= 0;i < dragState.line.x.length;i++){
            const {left:l,showLeft:s} = dragState.line.x[i]
            //当距离小于5时触发组件对齐
            if(Math.abs(l - left) < 5){
                //辅助线显示的位置
                x = s
                //实现组件之间的快速对齐
                moveX = dragState.startX - dragState.startLeft + l
                //只需找到一根辅助线就跳出循环
                break
            }
        }
        //重新渲染视图
        markLine.x = x
        markLine.y = y
        let durX = moveX - dragState.startX
        let durY = moveY - dragState.startY
        focusData.value.focus.forEach((block,idx)=>{
            block.top = dragState.startPos[idx].top + durY
            block.left = dragState.startPos[idx].left + durX
        })
        if (!dragState.dragging){
            dragState.dragging = true
            //触发拖拽开始事件
            events.emit('start')
        }
    }
    const mouseup = (e) => {
        //解绑事件
        document.removeEventListener('mousemove',mousemove)
        document.removeEventListener('mouseup',mouseup)
        markLine.x = null
        markLine.y = null
        if(dragState.dragging){
            events.emit('end')
        }
    }
    return{
        mousedown,
        markLine
    }
}