//在列表区显示所有的组件
//虚拟dom的key对应生成相应的组件
import {ElButton,ElInput} from 'element-plus'
function createEditorConfig(){
    //list用于渲染左边物料区的组件
    const componentList = []
    //map用于渲染真实组件
    const componentMap = {}
    return{
        componentMap,
        componentList,
        //register函数用于注册组件
        register:(component)=>{
            componentList.push(component)
            componentMap[component.key] = component
        }
    }
}
export let registerConfig = createEditorConfig()
registerConfig.register({
    label:'文本',
    preview:()=>'预览文本',
    render:()=>'渲染文本',
    key:'text'
})
registerConfig.register({
    label:'按钮',
    preview:()=><ElButton>预览按钮</ElButton>,
    render:()=><ElButton>渲染按钮</ElButton>,
    key:'button'
})
registerConfig.register({
    label:'输入框',
    preview:()=><ElInput>预览输入框</ElInput>,
    render:()=><ElInput>渲染输入框</ElInput>,
    key:'input'
})