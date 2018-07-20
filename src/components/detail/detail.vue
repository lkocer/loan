<template>
  <div class="detail-loan">
     <div class="top-bar clearfix">
         <div class="img">
             <img :src="detailData.url" />
         </div>
         <div class="loan-introduction">
            <p class="h2">{{detailData.name}}</p>
            {{detailData.feature}}<br/>
            成功申请<s>{{detailData.applyNo}}</s>人
         </div>
     </div>
     <div class="border-area"></div>
     <div class="table-tips">
        <ul>
            <li>
                <div class="tag">可贷金额</div>
                <div class="tag">期限范围</div>
                <div class="tag">最快放款</div>
            </li>
            <li>
                <div class="tag">{{detailData.loanAmount}}元</div>
                <div class="tag">{{detailData.termRange}}天</div>
                <div class="tag">{{detailData.fastestLoan}}分钟</div>
            </li>
        </ul>
     </div>
     <div class="page-title">详细说明</div>
     <div class="loan-description-box">
           <div class="loan-description-area">
               <div class="h2"><i class="iconfont icon-tiaojianshaixuan"></i>申请条件</div>
               <div class="list">
                   <p v-for="(index,item) in detailData.applyCondition">{{item+1}}、{{index.condition}}</p>
               </div>
           </div>
           <div class="loan-description-area">
               <div class="h2"><i class="iconfont icon-ziliao"></i>所需资料</div>
               <div class="list">
                   <p v-for="(index,item) in detailData.document">{{item+1}}、{{index.document}}</p>
               </div>
           </div>
           <div class="loan-description-area">
               <div class="h2"><i class="iconfont icon-jieshao"></i>产品介绍</div>
               <div class="list">
                   {{detailData.details}}
               </div>
           </div>
     </div>      
     <mu-button color="error" class="fixed-btn" @click="myLoginShow">立即申请</mu-button>
     <my-login :is-show="openFullscreen" @myLoginHide="myLoginHide"></my-login>
  </div>
</template>

<script>
import {Toast,Indicator} from 'mint-ui';
import myLogin from '@/components/loginLayer/login';
export default {
  created(){
      
  },
  components:{
    'my-login':resolve => require(['@/components/loginLayer/login'],resolve)
  },
  data(){
    return {
      msg:'hellow',
      detailData:[],
      openFullscreen: false,
      myLaonToken:null
    }
  },
  mounted(){
      this.myLaonToken = this.$cookies.get('myLaonToken');
      this.getJsonData(this.$route);
  },
  watch: {
    '$route' (to, from) {
        this.getJsonData(to);
    }
  },
  methods:{
    myLoginShow(){
      if(this.myLaonToken == null){
        this.openFullscreen = true;
      }else{
        this.getApplyProduc(this.$route);
      }
    },
    myLoginHide(...type){
      this.openFullscreen = false;
      if(type[0] == 1){
        this.myLaonToken = this.$cookies.get('myLaonToken');
      }
    },
    getJsonData(params){
       let that = this;
        this.$ajax({
            method: 'post',
            url:this.$httpPort+'/productInfo.do',
            data: {
              id:params.query.id
            }
         }).then(function(res){
             if(res.data.errorCode*1 == 200){
                that.detailData = res.data.data
             }
         }).catch(function(err){
              console.log(err)
         });
    },
    getApplyProduc(params){
       let that = this;
        this.$ajax({
            method: 'post',
            url:this.$httpPort+'/applyProduct.do',
            headers:{
               "token":this.myLaonToken
            },
            data: {
              id:params.query.id
            }
         }).then(function(res){
             if(res.data.errorCode*1 == 200){
                window.location.href = res.data.data;
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
    }
  }
}
</script>

<style lang="scss">
.detail-loan{
  .top-bar{
    padding:px2em(15);
    .img{
      width: px2em(65);
      height: px2em(65);
      overflow: hidden;
      float: left;
      img{
        max-width: px2em(65);
      }
    }
    .loan-introduction{
      margin-left: px2em(75);
      color:#797979;
      font-size: 14px;
      line-height: px2em(22);
      .h2{
        color:#444;
        font-size: 16px;
        font-weight: bold;
      }
      s{
        color:#dd1712;
          font-weight: bold;
          font-size: 14px;
          vertical-align: middle;
      }
    }
  }
  .border-area{
    height: px2em(2);
    background-color: #f1f1f1;
  }
  .table-tips{
    ul{
      overflow: hidden;
      padding: px2em(10) 0;
      li{
          overflow: hidden;
          font-size: 14px;
          line-height: px2em(20);
          .tag{
            float: left;
            width: 33.33%;
            text-align: center;
          }
      }
    }
  }
  .page-title{
    padding:px2em(6) px2em(10);
    background-color: #f5f5f5;
    font-size: 15px;
    font-weight: bold;
    border-bottom: 1px #efeeee solid;
    border-top: 1px #efeeee solid;
  }
  .loan-description-box{
    padding-bottom:px2em(45);
  }
  .loan-description-area{
     .h2{
        margin: px2em(10);
        padding-bottom:px2em(5);
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px #efeeee solid;
        i{
          display: inline-block;
          margin-right:px2em(4);
          font-size: 16px;
          width: px2em(13);
        }
     }
     .list{
        margin-left: px2em(10);
        line-height: px2em(22);
        font-size: 14px;
     }
  }
  .fixed-btn{
    position: fixed;
    left:0px;
    bottom:0px;
    width: 100%;
    height: px2em(40);
    background-color: #da1d26;
    color:#fff;
    text-align: center;
    font-size: 18px;
    line-height: px2em(40);
    box-shadow: 0 0 12px 1px #e6e6e6;
  }

}
.mu-appbar{
    height: 45px;
    .mu-appbar-title{
      font-size: 16px;
    }
}
.mu-primary-color{
  background-color: #de1828;
}
.mu-overlay{
  z-index:990 !important;
}
.mu-dialog-wrapper{
  z-index:991 !important;
}
.mint-indicator{
  z-index: 995;
  position: relative;
}

</style>
