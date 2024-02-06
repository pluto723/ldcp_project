<template>
  <div class="app">
<!--    传入虚拟dom-->
    <Editor v-model="state"></Editor>
  </div>
</template>

<script>
import data from './data.json'
import {provide, ref, watch} from "vue";
//引入虚拟dom json文件
import Editor from './package/editor'
import {registerConfig as config} from './utils/editor-config'
export default {
  components:{
    Editor
  },
  setup(){
    //provide依赖注入，该变量可以被所有子组件所共用
    provide('config',config)
    const state = ref(data)
    // watch(state,(value, oldValue, onCleanup)=>{
    //   console.log(value)
    // })
    return {
      state
    }
  }
}
</script>

<style lang="scss">
.app{
  position: fixed;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 20px;
}
</style>
