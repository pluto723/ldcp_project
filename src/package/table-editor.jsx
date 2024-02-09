import {computed, defineComponent} from "vue";
import {ElButton,ElTag} from "element-plus";
import {$tableDialog} from "@/package/tableDialog";
export default defineComponent({
    props:{
        //组件配置信息
        propsConfig:{type:Object},
        //组件上绑定的数据
        modelValue:{type:Array}
    },
    emits:["update:modelValue"],
    setup(props,ctx){
        const data = computed({
            get(){
                return props.modelValue || []
            },
            set(newValue){
                ctx.emit("update:modelValue",JSON.parse(JSON.stringify(newValue)))
            }
        })
        const add = ()=>{
            $tableDialog({
                config:props.propsConfig,
                data:data.value,
                onConfirm(value){
                    //当点击确认时，将数据更新
                    data.value = value
                }
            })
        }
        return ()=>{
            return <div>
                {/*如果没有数据就显示一个按钮*/}
                {(!data.value || data.value.length === 0) &&<ElButton onClick={add}>添加</ElButton>}
                {/*有数据就渲染数据*/}
                {(data.value || []).map(item=><ElTag onClick={add}>{item[props.propsConfig.table.key]}</ElTag>)}
            </div>
        }
    }
})