<template>
  <div>
    <div class="loan-contentbox clearfix">
       <transition name="fade">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>  
      </transition>
    </div>    
  </div>
</template>

<script>
export default {
  created(){
  },
  components:{
  },
  data(){
    return {
      msg:'hellow'
    }
  },
  mounted(){
  },
  watch: {
  },
  methods:{
  }
}
</script>

<style lang="scss">
</style>
