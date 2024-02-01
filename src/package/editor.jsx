import {computed, defineComponent, inject} from "vue";
import './editor.scss'
import EditorBlock from './editor-block'
export default defineComponent({
    props:{
        modelValue:{type:Object}
    },
    setup(props){
        //computed解构props
        const data = computed(()=>{
                return props.modelValue
            })
        //解构json文件中的样式
        const containerStyle = computed(()=>({
          width:data.value.container.width,
            height:data.value.container.height,
        }))
        //接收依赖注入的变量
        const config = inject("config")
        return ()=> <div class="editor">
            <div class="editor-left">
                {/*将componentList中的组件渲染至左侧物料区*/}
                {config.componentList.map(component=>(
                    <div class="editor-left-item">
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
                    <div class="editor-container-canvas-content" style={containerStyle.value}>
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