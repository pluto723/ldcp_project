import {computed, defineComponent, inject, ref} from "vue";
import './editor.scss'
import EditorBlock from './editor-block'
//物料区拖拽功能的实现
import {drag} from "@/js/drag";
//多选功能的实现
import {focus} from "@/js/focus";
//画布上的组件拖拽功能的实现
import {canvasDrag} from "@/js/canvasDrag";
import {ElButton} from "element-plus";
//引入撤销、重做功能
import {btnCommand} from "@/js/btnCommand";
//导入导出弹出框
import {$dialog} from "@/package/dialog";
//组件导入导出弹出框
import {$dropdown} from "@/package/dropdown";
//右侧编辑栏菜单
import EditorOperator from "@/package/editor-operator";
export default defineComponent({
    props:{
        modelValue:{type:Object}
    },
    emits:['update:modelValue'],
    setup(props,ctx){
        //预览模式标识
        const preview = ref(false)
        //computed解构props
        const data = computed({
            get(){
                return props.modelValue
            },
            //将更新后的数据传给父组件
            set(newValue){
              ctx.emit('update:modelValue',newValue)
            }
        })
        //解构json文件中的样式
        const containerStyle = computed(()=>({
          width:data.value.container.width+'px',
            height:data.value.container.height+'px',
        }))
        //接收依赖注入的变量
        const config = inject("config")
        const containerRef = ref(null)
        //物料区拖拽功能函数
        const {dragstart,dragend} = drag(containerRef,data)
        //画布多选功能函数
        const {blockMouseDown, containerMouseDown,focusData,selectLastBlock,clearBlockFocus} = focus(data,preview,(e)=>{
            mousedown(e)
        })
        //画布组件多选拖拽功能
        const {mousedown,markLine} = canvasDrag(focusData,selectLastBlock,data)
        //按钮撤销、重做功能
        const {state} = btnCommand(data,focusData)
        //按钮组件
        const buttons = [
            {label:'撤销',handler:()=>state.commands.undo()},
            {label:'重做',handler:()=>state.commands.redo()},
            {label:'导出',handler:()=>{
                $dialog({
                    title:'导出Json使用',
                    content:JSON.stringify(data.value),
                })
                }},
            {label:'导入',handler:()=>{
                    $dialog({
                        title:'导入Json使用',
                        content:'',
                        //footer控制是否显示确认、取消按钮
                        footer:true,
                        onConfirm(text){
                            data.value = JSON.parse(text)
                        }
                    })
                }},
            {label:'置顶',handler:()=>state.commands.placeTop()},
            {label:'置底',handler:()=>state.commands.placeBottom()},
            {label:'删除',handler:()=>state.commands.delete()},
            {label:'预览',handler:()=>{
                preview.value = !preview.value
                    //阻止默认右键菜单生成
                    clearBlockFocus()
            }},
        ]
        //组件右键菜单
        const onContextMenuBlock = (e,block)=>{
            //关闭默认菜单
            e.preventDefault()
            $dropdown({
                el:e.target,
                content:()=>{
                    return <>
                        <ElButton onClick={state.commands.delete}>删除</ElButton>
                        <ElButton onClick={state.commands.placeTop} style="margin-left:0px;">置顶</ElButton>
                        <ElButton onClick={state.commands.placeBottom} style="margin-left:0px;">置底</ElButton>
                        <ElButton onClick={()=>{{$dialog(
                            {title:'导出组件json',
                                content:JSON.stringify(block),}
                        )}}} style="margin-left:0px;">导出</ElButton>
                        <ElButton onClick={()=>{{$dialog(
                            {title:'导入组件json',
                                content:'',
                                //footer控制是否显示确认、取消按钮
                                footer:true,
                                onConfirm(text){
                                    text = JSON.parse(text)
                                    let blocks = [...data.value.blocks]
                                    const index = data.value.blocks.indexOf(block)
                                    if(index > -1){
                                        blocks.splice(index,1,text)
                                    }
                                    data.value = {...data.value,blocks:blocks}
                                }}
                        )}}} style="margin-left:0px;">导入</ElButton>
                    </>
                }
            })
        }
        return ()=> <div class="editor">
            <div class="editor-left">
                {/*将componentList中的组件渲染至左侧物料区*/}
                {config.componentList.map(component=>(
                    <div
                        class="editor-left-item"
                        draggable
                        onDragstart={e => dragstart(e,component)}
                        onDragend={dragend}
                    >
                        <span>{component.label}</span>
                        <div>{component.preview()}</div>
                    </div>
                ))}
            </div>
            <div class="editor-top">
                {buttons.map((btn)=>{
                    return <ElButton class="editor-top-button" onClick={btn.handler}>{btn.label}</ElButton>
                })}
            </div>
            <div class="editor-right">
                <EditorOperator
                    block={selectLastBlock.value}
                    data={data.value}
                    updateContainer={state.commands.updateContainer}
                ></EditorOperator>
            </div>
            <div class="editor-container">
                {/*滚动条*/}
                <div class="editor-container-canvas">
                    <div class="editor-container-canvas-content"
                         style={containerStyle.value}
                         ref={containerRef}
                         onMousedown={(e)=>containerMouseDown()}
                    >
                        {/*将组件渲染至画布上*/}
                        {
                            (data.value.blocks.map((block,index)=>(
                                <EditorBlock
                                    class={block.focus ? 'editor-block-focus':''}
                                    block={block}
                                    onMousedown={(e)=>{
                                        blockMouseDown(e,block,index)
                                    }}
                                    onContextmenu={(e)=>{onContextMenuBlock(e,block)}}
                                ></EditorBlock>
                                )))
                        }
                        {markLine.x !==null && <div class="line-x" style={{left:markLine.x + 'px'}}></div>}
                        {markLine.y !==null && <div class="line-y" style={{top:markLine.y + 'px'}}></div>}
                    </div>
                </div>
            </div>
        </div>
    }
})