import {computed, defineComponent, inject, ref} from "vue";
import './editor.scss'
import EditorBlock from './editor-block'
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
                        key:currentComponent.key
                    }
                ]

            }
            currentComponent = null
        }
        const dragstart = (e,component)=>{
            //监听事件
            containerRef.value.addEventListener('dragenter',dragenter)
            containerRef.value.addEventListener('dragover',dragover)
            containerRef.value.addEventListener('dragleave',dragleave)
            containerRef.value.addEventListener('drop',drop)
            //获取对应的组件
            currentComponent = component
        }
        return ()=> <div class="editor">
            <div class="editor-left">
                {/*将componentList中的组件渲染至左侧物料区*/}
                {config.componentList.map(component=>(
                    <div
                        class="editor-left-item"
                        draggable
                        onDragstart={e => dragstart(e,component)}
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
                    <div class="editor-container-canvas-content" style={containerStyle.value} ref={containerRef}>
                        {/*将组件渲染至画布上*/}
                        {
                            (data.value.blocks.map(block=>(
                                <EditorBlock block={block}></EditorBlock>
                                )))
                        }
                    </div>
                </div>
            </div>
        </div>
    }
})