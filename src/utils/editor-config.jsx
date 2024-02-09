//在列表区显示所有的组件
//虚拟dom的key对应生成相应的组件
import {ElButton, ElInput, ElText, ElSelect, ElOption} from 'element-plus'
import Range from "@/package/range";
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
//用于生成编辑区的组件
const createInputProp = (label)=>({type:"input",label})
const createColorProp = (label)=>({type:"color",label})
const createSelectProp = (label,options)=>({type:"select",label,options})
const createTableProp = (label,table)=>({type:"table",label,table})
registerConfig.register({
    label:'文本',
    preview:()=><ElText>预览文字</ElText>,
    render:({props})=><ElText style={{color: props.color,fontSize:props.size,}}>{props.text || "默认文本"}</ElText>,
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
    resize:{
        width:true,//表示可以更改输入框的横向大小
        height:true
    },
    preview:()=><ElButton disabled>预览按钮</ElButton>,
    render:({props,size})=><ElButton type={props.type} size={props.size} style={{height:size.height+'px',width:size.width+'px'}}>{props.text || "默认按钮"}</ElButton>,
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
    resize:{
        width:true//表示可以更改输入框的横向大小
    },
    preview:()=><ElInput disabled>预览输入框</ElInput>,
    render:({model,size})=><ElInput {...model.default} style={{width:size.width+'px'}}>渲染输入框</ElInput>,
    key:'input',
    model:{
        default:"绑定字段"
    }
})
registerConfig.register({
    label:'范围选择器',
    preview:()=><Range disable="disable"></Range>,
    render:({model})=>{
        return <Range {...{
            start: model.start.modelValue,
            'onUpdate:start':model.start['onUpdate:modelValue'],
            end: model.end.modelValue,
            'onUpdate:end':model.start['onUpdate:modelValue']
        }}></Range>
    },
    key:'range',
    model:{
        start:"开始值",
        end:"结束值"
    }
})
registerConfig.register({
    label:'下拉框',
    preview:()=><ElSelect disabled modelValue=""></ElSelect>,
    render:({props,model})=>{
        return <ElSelect {...model.default}>
            {(props.options || []).map((opt,index)=>{
                console.log(opt)
                return <ElOption label={opt.label} value={opt.value} key={index}></ElOption>
            })}
        </ElSelect>
    },
    key:'select',
    props:{
        options:createTableProp('下拉选项',{
            options:[
                {label:'显示值',filed:'label'},
                {label:'绑定值',filed:'value'}
            ],
            key:'label',//显示给用户的值
        })
    },
    model:{
        default:"绑定字段"
    }
})