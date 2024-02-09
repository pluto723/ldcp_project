import {computed, defineComponent} from "vue";
export default defineComponent({
    props:{
        start:{type:Number},
        end:{type:Number},
        //用于使范围选择器禁止输入
        disable:{type:String}
    },
    emits:[
        "update:start",
        "update:end"
    ],
    setup(props,ctx){
        const start = computed({
            get(){
                return props.start
            },
            set(){
                ctx.emit("update:start",newValue)
            }
        })
        const end = computed({
            get(){
                return props.end
            },
            set(){
                ctx.emit("update:start",newValue)
            }
        })
        return()=>{
            return <div>
                <input type="text" v-model={start.value} disabled={props.disable}/>
                <span>~</span>
                <input type="text" v-model={end.value} disabled={props.disable}/>
            </div>
        }
    }
})