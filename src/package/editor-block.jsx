import {computed, defineComponent, inject} from "vue";
// 组件用于解析json文件
export default defineComponent({
    props:{
        block:{type:Object}
    },
    setup(props){
        //计算属性解构props
        const blockStyle = computed(()=>({
            top:`${props.block.top}px`,
            left:`${props.block.left}px`,
            zIndex:`${props.block.zIndex}`,
        }))
        //用于获取被依赖注入的变量
        const config = inject('config')
        //哈希表通过key找到对应的组件
        const component = config.componentMap[props.block.key]
        //通过render()函数渲染真实组件
        const RenderComponent = component.render()
        return()=>{
            return <div class="editor-block" style={blockStyle.value}>
                {RenderComponent}
            </div>
        }
    }
})