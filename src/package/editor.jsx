import {computed, defineComponent, inject, ref} from "vue";
import './editor.scss'
import EditorBlock from './editor-block'
//物料区拖拽功能的实现
import {drag} from "@/js/drag";
//多选功能的实现
import {focus} from "@/js/focus";
//画布上的组件拖拽功能的实现
import {canvasDrag} from "@/js/canvasDrag";

export default defineComponent({
    props:{
        modelValue:{type:Object}
    },
    emits:['update:modelValue'],
    setup(props,ctx){
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
          width:data.value.container.width,
            height:data.value.container.height,
        }))
        //接收依赖注入的变量
        const config = inject("config")
        const containerRef = ref(null)
        //物料区拖拽功能函数
        const {dragstart,dragend} = drag(containerRef,data)
        //画布多选功能函数
        const {blockMouseDown, containerMouseDown,focusData} = focus(data,(e)=>{
            mousedown(e)
        })
        //画布组件多选拖拽功能
        const {mousedown} = canvasDrag(focusData)
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
            <div class="editor-top">菜单栏</div>
            <div class="editor-right">属性控制栏目</div>
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
                            (data.value.blocks.map(block=>(
                                <EditorBlock
                                    class={block.focus ? 'editor-block-focus':''}
                                    block={block}
                                    onMousedown={(e)=>blockMouseDown(e,block)}
                                ></EditorBlock>
                                )))
                        }
                    </div>
                </div>
            </div>
        </div>
    }
})