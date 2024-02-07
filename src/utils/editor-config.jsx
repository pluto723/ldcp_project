//在列表区显示所有的组件
//虚拟dom的key对应生成相应的组件
import {ElButton,ElInput,ElText} from 'element-plus'
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
const createInputProp = (label)=>({type:"input",label})
const createColorProp = (label)=>({type:"color",label})
const createSelectProp = (label,options)=>({type:"select",label,options})
registerConfig.register({
    label:'文本',
    preview:()=><ElText>预览文字</ElText>,
    render:({props})=><ElText style={{color: props.color,fontSize:props.size}}>{props.text || "默认文本"}</ElText>,
    key:'text',
    props:{
        text:createInputProp('字体内容'),
        color:createColorProp('字体颜色'),
        size:createSelectProp('字体大小',[
            {label:'14px',value:'14px'},
            {label:'20px',value:'20px'},
            {label:'24px',value:'24px'},
        ])
    }
})
registerConfig.register({
    label:'按钮',
    preview:()=><ElButton disabled>预览按钮</ElButton>,
    render:({props})=><ElButton type={props.type} size={props.size}>{props.text || "默认按钮"}</ElButton>,
    key:'button',
    props:{
        text:createInputProp('按钮内容'),
        type:createSelectProp('按钮类型',[
            {label:'基础',value:'primary'},
            {label:'成功',value:'success'},
            {label:'警告',value:'warning'},
        ]),
        size: createSelectProp('按钮大小',[
            {label:'默认',value:'default'},
            {label:'大',value:'large'},
            {label:'小',value:'small'},
        ])
    }
})
registerConfig.register({
    label:'输入框',
    preview:()=><ElInput disabled>预览输入框</ElInput>,
    render:()=><ElInput>渲染输入框</ElInput>,
    key:'input'
})