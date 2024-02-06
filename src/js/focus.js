import {computed, ref} from "vue";

export function focus(data,preview,callback){
    //画布上组件选中功能
    //表示最后一个被选中的元素
    const selectIndex = ref(-1)
    const clearBlockFocus = ()=>{//选中某一组件时，将其他组件的选中框取消掉
        data.value.blocks.forEach(block=>{
            block.focus = false
        })
    }
    const blockMouseDown = (e,block,index)=>{
        if(preview.value) return
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
        selectIndex.value = index
        callback(e)
    }
    //用于找到最后点击的组件
    const selectLastBlock = computed(()=>
        data.value.blocks[selectIndex.value]
    )
    //计算所有的焦点
    const focusData = computed(()=>{
        let focus = []
        let unfocused = []
        data.value.blocks.forEach(block=>{
            if(block.focus){
                focus.push(block)
            }
            if(!block.focus){
                unfocused.push(block)
            }
        })
        return {focus,unfocused}
    })
    //点击容器时清空所有的焦点
    const containerMouseDown = ()=>{
        if(preview.value) return
        clearBlockFocus()
        selectIndex.value = -1
    }
    return{
        blockMouseDown,
        focusData,
        containerMouseDown,
        selectLastBlock,
        clearBlockFocus
    }
}