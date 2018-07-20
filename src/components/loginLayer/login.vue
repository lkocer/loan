<template>
  <div>
     <mu-container>
        <mu-dialog width="360" transition="slide-bottom" dialog-class="zIndex" fullscreen :open.sync="show">
          <mu-appbar color="primary" title="请先登录">
            <mu-button slot="right" flat  @click="closeFullscreenDialog">
               <i class="iconfont icon-guanbi"></i>
            </mu-button>
          </mu-appbar>
          <div class="login-area">
             <div class="list">
                <i class="iconfont icon-shouji"></i><input type="tel" placeholder="请输入电话号码" v-model="phone" />
             </div>
             <div class="list">
                <i class="iconfont icon-yuechi"></i><input type="text" placeholder="请输入您收到的验证码" v-model="vCode" />
                <div class="post-code" :class="{false:codeTime>0}" @click="postCode">{{codeTxt}}</div>
             </div>
             <mu-button color="error" class="login-btn" @click="loginFun">登录</mu-button>
          </div>
        </mu-dialog>
      </mu-container>
  </div>
</template>

<script>
import {Toast,Indicator} from 'mint-ui';
export default {
  name: 'App',
  props:[
    'isShow'
  ],
  components:{
  },
  data(){
    return {
      msg:'hellow',
      phone:'',
      vCode:'',
      codeTxt:'发送验证码',
      codeTime:0,
      show:this.isShow
    }
  },
  watch:{
     isShow(){
        this.show = this.isShow;
     },
     codeTime(){
         setTimeout(()=>{
          if(this.codeTime > 0){
            this.codeTime--;
            this.codeTxt = '剩余'+this.codeTime+'秒';
            if(this.codeTime == 0){
              this.codeTxt = '重新发送验证码';
            }
          }
        },1000);
     }
  },
  computed:{
    totalPrice(){
      //console.log(this)
    }
  },
  mounted(){
       //console.log(this)
  },
  methods:{
    isPoneAvailable(tel) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(tel)) {
        return false;
      } else {
        return true;
      }
    },
    isTelAvailable(tel) {
        var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        if (!myreg.test(tel)) {
          return false;
        } else {
          return true;
        }
    },
    postCode(){
        let that = this;
        if(this.codeTime > 0){
           return false;
        }
        if(this.isPoneAvailable(this.phone)){///user/login
            Indicator.open();
            this.$ajax({
                method: 'post',
                url:this.$httpPort+'/verificationCode.do',
                data: {
                  phoneNo:this.phone
                }
             }).then(function(res){
                 if(res.data.errorCode*1 == 200){
                    Toast({
                      message: '短信已发送，请留意签名为小时代的短信验证码',
                      iconClass: 'iconfont icon-chenggong',
                      duration: 5000
                    });
                    that.codeTime = 60;
                    that.codeTxt = '剩余'+that.codeTime+'秒';
                    Indicator.close();
                 }else{
                    Toast({
                      message: res.data.errorMsg,
                      iconClass: 'iconfont icon-iconfontcuowu',
                      duration: 3000
                    });
                    Indicator.close();
                 }
             }).catch(function(err){
                  console.log(err);
                  Indicator.close();
             })
        }else{
           Toast({
              message: '请输入正确的手机号码',
              iconClass: 'iconfont icon-iconfontcuowu',
              duration: 3000
            });
        }
    },
    loginFun(){
        let that = this;
        if(this.isPoneAvailable(this.phone) && this.vCode != ''){
           this.$ajax({
              method: 'post',
              url:this.$httpPort+'/login.do',
              data: {
                phoneNo:this.phone,
                vCode:this.vCode
              }
           }).then(function(res){
               if(res.data.errorCode*1 == 200){
                 that.$cookies.set("myLaonToken",res.data.data.token,"1d",'/');
                 that.$emit('myLoginHide',1);
                 Toast({
                    message: '登录成功',
                    iconClass: 'iconfont icon-chenggong',
                    duration: 3000
                  });
               }else{
                 Toast({
                    message: res.data.errorMsg,
                    iconClass: 'iconfont icon-iconfontcuowu',
                    duration: 3000
                  });
               }
           }).catch(function(err){
                console.log(err)
           });
        }else{
          if(!this.isPoneAvailable(this.phone)){
             Toast({
                message: '请输入正确的手机号码',
                iconClass: 'iconfont icon-iconfontcuowu',
                duration: 3000
              });
          }else{
             Toast({
                message: '请输入验证码',
                iconClass: 'iconfont icon-iconfontcuowu',
                duration: 3000
              });
          }  
        }
    },
    closeFullscreenDialog(){
        this.$emit('myLoginHide');
    }
  }
}
</script>

<style lang="scss">
.login-area{
  padding:px2em(12);
  .list{
   border-bottom: 1px #dadada solid;
   margin-bottom: px2em(10);
   position: relative;
   .iconfont{
     width:px2em(20);
      height: px2em(30);
      display: inline-block;
   }
    .icon-shouji{
      font-size: 25px;
      vertical-align: middle;
      display: inline-block;
      
    }
    .icon-yuechi{
      font-size: 18px;
      vertical-align: middle;
      &:before{
        margin:px2em(5);
        position: relative;
        top:5px;
      }
    }
    input{
      border:0;
      font-size: 15px;
      vertical-align: middle;
      margin-left:px2em(5);
    }
    .post-code{
      position: absolute;
      right:0px;
      top: px2em(5);
      font-size: 14px;
      color:#1c73c4;
      &.false{
        color:#b9b9b9;
      }
    }

  }
  
  .login-btn{
      width:100%;
      height: px2em(35);
      text-align: center;
      color: #fff;
      font-size: 16px;
      background-color: #de1828;
      border-radius: 3px;
  }
}
.icon-iconfontcuowu,.icon-chenggong{
    font-size: 20px;
  }
</style>
