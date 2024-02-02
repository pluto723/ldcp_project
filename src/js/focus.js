import {computed} from "vue";

export function focus(data,callback){
    //画布上组件选中功能
    const clearBlockFocus = ()=>{//选中某一组件时，将其他组件的选中框取消掉
        data.value.blocks.forEach(block=>{
            block.focus = false
        })
    }
    const blockMouseDown = (e,block)=>{
        e.preventDefault()
        e.stopPropagation()
        //当按下shift时实现多选
        if (e.shiftKey){
            block.focus = !block.focus
        }else {
            if (!block.focus){
                clearBlockFocus()
                block.focus = true
            }else {
                block.focus = false
            }
        }
        callback(e)
    }
    //计算所有的焦点
    const focusData = computed(()=>{
        let focus = []
        let unfocused = []
        data.value.blocks.forEach(block=>{
            if(block.focus){
                focus.push(block)
            }else {
                unfocused.push(block)
            }
        })
        return {focus,unfocused}
    })
    //点击容器时清空所有的焦点
    const containerMouseDown = ()=>{
        clearBlockFocus()
    }
    return{
        blockMouseDown,
        focusData,
        containerMouseDown,
    }
}