import {createVNode, defineComponent, reactive, render} from "vue";
import {ElButton, ElDialog, ElInput} from "element-plus";

const DialogComponent = defineComponent({
    props:{
        option:{type:Object}
    },
    setup(props,ctx){
        const state = reactive({
            option:props.option,
            //控制弹出框是否显示
            isShow:false
        })
        //将函数暴露出去
        ctx.expose({
            showDialog(option){
                state.option = option
                state.isShow = true
            }
        })
        const cancel = ()=>{
            state.isShow = false
        }
        const confirm = ()=>{
            state.isShow = false
            state.option.onConfirm && state.option.onConfirm(state.option.content)
        }
        return ()=>{
            //插槽
            return <ElDialog v-model={state.isShow}>
                {{
                    default:()=><ElInput type="textarea" v-model={state.option.content} rows={10} title={state.option.title}></ElInput>,
                    footer:()=>state.option.footer && <div>
                        <ElButton onclick={cancel}>取消</ElButton>
                        <ElButton onclick={()=>{}} type="primary" onClick={confirm}>确定</ElButton>
                    </div>
                }}
            </ElDialog>
        }
    }
})
//虚拟节点
let vm
export function $dialog(option){
    //防止多次生成弹窗
    if(!vm){
        let el = document.createElement('div')
        vm = createVNode(DialogComponent,{option})
        //将el渲染至页面上
        document.body.appendChild((render(vm,el),el))
    }
    let {showDialog} = vm.component.exposed
    showDialog(option)
}