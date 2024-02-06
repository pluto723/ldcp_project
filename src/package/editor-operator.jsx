import {defineComponent, inject} from 'vue'
import {ElButton, ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect} from "element-plus";

export default defineComponent({
    props:{
        //最后选中的组件
        block:{type:Object},
        data:{type:Object}
    },
    setup(props,ctx){
        const config = inject('config')
        return ()=>{
            let content = []
            //默认显示画布的配置
            if(!props.block){
                content.push(<>
                    <ElFormItem label="容器宽度">
                        <ElInputNumber></ElInputNumber>
                    </ElFormItem>
                    <ElFormItem label="容器高度">
                        <ElInputNumber></ElInputNumber>
                    </ElFormItem>
                </>)
            }else {
                let component = config.componentMap[props.block.key]
                if (component && component.props){
                    content.push(Object.entries(component.props).map(([propName,propConfig])=>{
                        return <ElFormItem label={propConfig.label}>
                            {{
                                input:()=><ElInput></ElInput>,
                                color:()=><ElColorPicker></ElColorPicker>,
                                select:()=><ElSelect>
                                    {propConfig.options.map(opt=>{
                                        return <ElOption label={opt.label} value={opt.value}></ElOption>
                                    })}
                                </ElSelect>
                            }[propConfig.type]()}
                        </ElFormItem>
                    }))
                }
            }
            return <ElForm labelPosition="top" style="padding:30px">
                {content}
                <ElFormItem>
                    <ElButton type="primary">应用</ElButton>
                    <ElButton>重置</ElButton>
                </ElFormItem>
            </ElForm>
        }
    }
})