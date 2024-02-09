import {defineComponent, inject, reactive, watch} from 'vue'
import {ElButton, ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect} from "element-plus";
import TableEditor from "@/package/table-editor";
export default defineComponent({
    props:{
        //最后选中的组件
        block:{type:Object},
        data:{type:Object},
        updateContainer:{type:Function}
    },
    emits:['update:data'],
    setup(props,ctx){
        const config = inject('config')
        const state = reactive({
            editData:{}
        })
        const reset = ()=>{
            //默认显示画布的预设宽高
            if(!props.block){
                state.editData = JSON.parse(JSON.stringify(props.data.container))
            }else {
                state.editData = JSON.parse(JSON.stringify(props.block))
            }
        }
        //编辑区域应用功能
        const apply = ()=>{
            //更改容器的大小
            if(!props.block){
                props.data.container = state.editData
            }else {
                //更改选中容器的大小
                const index = props.data.blocks.indexOf(props.block)
                if(index > -1){
                    props.data.blocks.splice(index,1,state.editData)
                }
            }
        }
        watch(()=>props.block,reset,{immediate:true})
        return ()=>{
            let content = []
            //默认显示画布的配置
            if(!props.block){
                content.push(<>
                    <ElFormItem label="容器宽度">
                        <ElInputNumber v-model={state.editData.width}></ElInputNumber>
                    </ElFormItem>
                    <ElFormItem label="容器高度">
                        <ElInputNumber v-model={state.editData.height}></ElInputNumber>
                    </ElFormItem>
                </>)
            }else {
                let component = config.componentMap[props.block.key]
                if (component && component.props){
                    content.push(Object.entries(component.props).map(([propName,propConfig])=>{
                        return <ElFormItem label={propConfig.label}>
                            {{
                                input:()=><ElInput v-model={state.editData.props[propName]}></ElInput>,
                                color:()=><ElColorPicker v-model={state.editData.props[propName]}></ElColorPicker>,
                                select:()=><ElSelect v-model={state.editData.props[propName]}>
                                    {propConfig.options.map(opt=>{
                                        return <ElOption label={opt.label} value={opt.value}></ElOption>
                                    })}
                                </ElSelect>,
                                table:()=><TableEditor propsConfig={propConfig} v-model={state.editData.props[propName]}></TableEditor>
                            }[propConfig.type]()}
                        </ElFormItem>
                    }))
                }
                if(component && component.model){
                    content.push(Object.entries(component.model).map(([modelName,label])=>{
                        return <ElFormItem label={label}>
                            <ElInput v-model={state.editData.model[modelName]}></ElInput>
                        </ElFormItem>
                    }))
                }
            }
            return <ElForm labelPosition="top" style="padding:30px">
                {content}
                <ElFormItem>
                    <ElButton type="primary" onClick={()=>apply()}>应用</ElButton>
                    <ElButton onClick={reset}>重置</ElButton>
                </ElFormItem>
            </ElForm>
        }
    }
})