//虚拟节点
import {computed, createVNode, defineComponent, onBeforeUnmount, onMounted, reactive, ref, render} from "vue";
const DialogComponent = defineComponent({
    props:{
        option:{type:Object},
    },
    setup(props,ctx){
        const state = reactive({
            option:props.option,
            isShow:false,
            top:0,
            left:0
        })
        ctx.expose({
            showDropDown(option){
                state.option = option
                state.isShow = true
                //获取鼠标指针指向的组建的位置
                let {top,left,height} = option.el.getBoundingClientRect()
                state.top = top + height
                state.left = left
            }
        })
        const classes = computed(()=>[
            "dropdown",{
                'dropdown-isShow':state.isShow
            }
        ])
        const el = ref(null)
        //通过计算属性得出组件右键菜单应该出现的位置
        const styles = computed(()=>({
            top:state.top + 'px',
            left:state.left + 'px'
        }))
        //当不点击下拉菜单中的内容时，下拉菜单消失
        const onMouseDownDocument = (e)=>{
            if(!el.value.contains(e.target)){
                state.isShow = false
            }
        }
        onMounted(()=>{
            document.body.addEventListener('mousedown',onMouseDownDocument,true)
        })
        onBeforeUnmount(()=>{
            document.body.removeEventListener('mousedown',onMouseDownDocument,true)
        })
        return ()=>{
            return <div class={classes.value} style={styles.value} ref={el}>
                {state.option.content()}
            </div>
        }
    }
})
let vm
export function $dropdown(option){
    //防止多次生成弹窗
    if(!vm){
        let el = document.createElement('div')
        vm = createVNode(DialogComponent,{option})
        //将el渲染至页面上
        document.body.appendChild((render(vm,el),el))
    }
    let {showDropDown} = vm.component.exposed
    showDropDown(option)
}