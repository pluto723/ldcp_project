<template>
  <div class="app">
<!--    传入虚拟dom-->
    <Editor v-model="state" :formData="formData"></Editor>
  </div>
</template>

<script>
import data from './data.json'
import {provide, ref, watch} from "vue";
//引入虚拟dom json文件
import Editor from './package/editor'
import {registerConfig as config} from './utils/editor-config'
import Range from "./package/range";
export default {
  components:{
    Editor
  },
  setup(){
    const formData = ref({
      username:"root",
      password:123456,
      start:1,
      end:100
    })
    //provide依赖注入，该变量可以被所有子组件所共用
    provide('config',config)
    const state = ref(data)
    // watch(state,(value, oldValue, onCleanup)=>{
    //   console.log(value)
    // })
    return {
      state,
      formData
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
