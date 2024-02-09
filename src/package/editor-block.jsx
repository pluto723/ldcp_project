import {computed, defineComponent, inject, onMounted, ref, watch} from "vue";
import BlockResize from "@/package/block-resize";
// 组件用于解析json文件
export default defineComponent({
    props:{
        block:{type:Object},
        formData:{type:Object}
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
        //组件渲染完成后实现居中
        const blockRef = ref(null)
        onMounted(()=>{
            let {offsetWidth,offsetHeight} = blockRef.value
            //当拖拽松手时
            if(props.block.alignCenter){
                props.block.left = props.block.left - offsetWidth/2
                props.block.top = props.block.top - offsetHeight/2
                props.block.alignCenter = false
            }
            props.block.height = offsetHeight
            props.block.width = offsetWidth
        })
        return()=>{
            //哈希表通过key找到对应的组件
            const component = config.componentMap[props.block.key]
            //通过render()函数渲染真实组件
            const RenderComponent = component.render({
                //通过hasResize属性判断组件是否被更改了宽高
                size:props.block.hasResize ? {width:props.block.width,height:props.block.height,}:{},
                props:props.block.props,
                model:Object.keys(component.model || {}).reduce((prev,modelName)=>{
                    prev[modelName] = {
                        //找到键名对应的值
                        modelValue:props.formData[props.block.model[modelName]],
                        "onUpdate:modelValue":v=> props.formData[props.block.model[modelName]] = v
                    }
                    return prev
                },{})
            })
            const {width,height} = component.resize || {}
            return <div class="editor-block" style={blockStyle.value} ref={blockRef}>
                {RenderComponent}
                {/*当选中的组件存在height,width标识符时，生成BlockResize组件*/}
                {props.block.focus && (width || height) && <BlockResize
                    block={props.block}
                    component={component}
                ></BlockResize>}
            </div>
        }
    }
})