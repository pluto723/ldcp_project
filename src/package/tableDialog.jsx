import {createVNode, defineComponent, reactive, render} from "vue";
import {ElButton, ElDialog, ElTable, ElTableColumn,ElInput} from "element-plus";

const TableComponent = defineComponent({
    props:{
        option:{type:Object}
    },
    setup(props,ctx){
        const state = reactive({
            option:props.option,
            isShow:false,
            editData:[]
        })
        const add = ()=>{
            state.editData.push({})
        }
        const reset = () =>{
            state.editData = []
        }
        const onCancel = ()=>{
            state.isShow = false
        }
        //更新props中的数据
        const onConfirm = ()=>{
            state.option.onConfirm(state.editData)
            state.isShow = false
        }
        let methods = {
            show(option){
                state.option = option
                state.isShow = true
                state.editData = JSON.parse(JSON.stringify(option.data))
            }
        }
        ctx.expose(methods)
        return ()=>{
            return <ElDialog v-model={state.isShow} title={state.option.config.label}>
                {{
                    default:()=>(
                        <div>
                            <div><ElButton onClick={add}>添加</ElButton><ElButton onClick={reset}>重置</ElButton></div>
                            <ElTable data={state.editData}>
                                <ElTableColumn type="index"></ElTableColumn>
                                {state.option.config.table.options.map((item,index)=>{
                                    return <ElTableColumn label={item.label}>
                                        {{
                                            default:({row})=><ElInput v-model={row[item.filed]}></ElInput>
                                        }}
                                    </ElTableColumn>
                                })}
                            </ElTable>
                        </div>
                    ),
                    footer:()=><>
                        <ElButton onClick={onCancel}>取消</ElButton>
                        <ElButton onClick={onConfirm}>确认</ElButton>
                    </>
                }}
            </ElDialog>
        }
    }
})
let vm
export const $tableDialog = (option)=>{
    if(!vm){
        const el = document.createElement('div')
        vm = createVNode(TableComponent,{option})
        let r = render(vm,el)
        document.body.appendChild(el)
    }
    let {show} = vm.component.exposed
    show(option)
}