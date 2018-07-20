<template>
  <div>
    <mt-swipe :auto="5000" :speed="500">
      <mt-swipe-item v-for="(index,item) in carouselData" :key="item">
        <router-link :to="{name:'detail', query: { id: index.id }}">
            <img :src="index.adUrl">
        </router-link> 
      </mt-swipe-item>
    </mt-swipe>
    <div class="page-title">
      <div class="slider-box">
       <slider :pages="pagesSlider" :sliderinit="sliderinit" @slide='slide' @tap='onTap' @init='onInit'>
          <!-- 设置loading,可自定义
          <div slot="loading">loading...</div> -->
       </slider>
       <div class="tody-num">今日已有<s>{{hotApplyNo}}</s>人申请</div>\
      </div> 
    </div>
     <div class="list-content">
         <ul>
             <li v-for="(index,item) in writeData">
              <router-link :to="{name:'detail', query: { id: index.id }}">
                  <div class="img-box">
                      <img :src="index.url" />
                  </div>
                  <div class="content-box">
                       <div class="h2">{{index.name}}</div>
                       <div class="tips-txt">{{index.feature}}</div>
                       <div class="application-num">申请人数<s>{{index.applyNo}}</s>人</div>
                       <div class="label-box">
                           <s v-for="(index,item) in index.featureLabel.split('，')">{{index}}</s>
                       </div>
                  </div>
                  <div class="right-icon">
                     <i class="iconfont icon-remen4" v-if="index.label.indexOf('最热') > -1"></i><i class="iconfont icon-new" v-if="index.label.indexOf('最新') > -1"></i><i class="iconfont icon-tesefuwu" v-if="index.label.indexOf('特色') > -1"></i>
                  </div>
               </router-link>   
             </li>
         </ul>
     </div>
    <div class="bottom-fixed">
        <mu-container>
          <mu-bottom-nav>
            <mu-bottom-nav-item class="iconfont icon-remen" v-bind:class="{activeTag: taglist==0 }" title="热门推荐" to="/list/hot" color="#ff0000"></mu-bottom-nav-item>
            <mu-bottom-nav-item class="iconfont icon-koubei1" v-bind:class="{activeTag: taglist==1 }" title="口子大全" to="/list/mouth" color="#ff0000"></mu-bottom-nav-item>
          </mu-bottom-nav>
        </mu-container>
    </div> 
  </div>
</template>

<script>
import slider from 'vue-concise-slider'// import slider components
export default {
  name: 'App',
  props:[
     'listData'
  ],
  components:{
    slider
  },
  beforeRouteLeave (to, from, next) {//导航守卫
    clearInterval(this.setHotInter);
    clearInterval(this.setHotInfoInter);
    next();
  },
  data(){
    return {
      msg:'hellow',
      listName:'hot',
      carouselData:[],
      writeData:[],
      hotlistData:[],
      hotlistDataPage:0,
      mouthData:[],
      mouthDataPage:0,
      taglist:0,
      pagesSlider:[],
      sliderinit: {
        currentPage: 0,
        thresholdDistance: 500,
        thresholdTime: 500,
        autoplay:2500,
        loop:true,
        direction:'vertical',
        infinite:1,
        effect:'slide',
        slidesToScroll:1,
        timingFunction: 'ease',
        duration: 1500
      },
      setHotInter:null,
      setHotInfoInter:null,
      ajaxLoding:false,
      hotApplyNo:''
    }
  },
  created(){
  },
  computed:{
  },
  mounted(){
    this.changeTag();
    this.getHotPicture();
    this.getHotInfo();
    window.onscroll = () => {
      this.menu();
    }
    this.setHotInter = setInterval(()=>{
        this.getHotPicture();
    },60000);
    this.setHotInfoInter = setInterval(()=>{
        this.getHotInfo();
    },25000);
  },
  watch: {
    '$route' (to, from) {
        this.changeTag();
    }
  },
  methods:{
     changeTag(){//切换标签
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.listName = this.$route.params.listName;
        if(this.listName == 'hot'){
           this.hotlistData = [];
           this.hotlistDataPage = 0;
           this.getHotListJson();
           this.taglist = 0;
        }
        if(this.listName == 'mouth'){
           this.mouthlistData = [];
           this.mouthDataPage = 0;
           this.getMouthListJson();
           this.taglist = 1;
        }
     },
     menu(){//判断滚动
       this.scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
       this.clientHeight = document.body.scrollTop || document.documentElement.scrollTop;
        if (this.clientHeight + document.documentElement.clientHeight >= this.scrollHeight) {
            if(this.listName == 'hot'){
               this.getHotListJson();
            }
            if(this.listName == 'mouth'){
               this.getMouthListJson();
            }
        }
     },
     getHotPicture(){
        let that = this;
        this.$ajax({
            method: 'post',
            url:this.$httpPort+'/hotPicture.do',
            data: {}
         }).then(function(res){
             if(res.data.errorCode*1 == 200){
                that.carouselData = res.data.data;
             }
         }).catch(function(err){
              console.log(err)
         });
     },
     getHotInfo(){
        let that = this;
        this.$ajax({
            method: 'post',
            url:this.$httpPort+'/hotInfo.do',
            data: {}
         }).then(function(res){
             if(res.data.errorCode*1 == 200){
                let str = [];
                res.data.data.events.forEach((item,index)=>{
                    str.push({
                      html: '<div class="slider1 clearfix">\
                                  <div class="slider-img">\
                                          <div class="img"></div>\
                                  </div>\
                                  <div class="slider-text">'+item.productName+'<p>'+item.event+'</p></div>\
                              </div>'
                    });
                });
                that.pagesSlider = str;
                that.hotApplyNo = res.data.data.applyNo;
             }
         }).catch(function(err){
              console.log(err)
         });
     },
     getHotListJson(){//获取热门列表数据  
        let that = this;
        if(this.ajaxLoding){
          return false;
        }
        this.ajaxLoding = true;
        this.$ajax({
            method: 'post',
            url:this.$httpPort+'/productList.do',
            data: {
              pageNum:this.hotlistDataPage
            }
         }).then(function(res){
             if(res.data.errorCode*1 == 200){
                that.hotlistData = that.hotlistData.concat(res.data.data.ProductPoJo);
                that.writeData = that.hotlistData;
                that.hotlistDataPage++;
             }
             that.ajaxLoding = false;
         }).catch(function(err){
              console.log(err);
              that.ajaxLoding = false;
         });
     },
     getMouthListJson(){//获取口子列表数据
        let that = this;
        if(this.ajaxLoding){
          return false;
        }
        this.ajaxLoding = true;
        this.$ajax({
            method: 'post',
            url:this.$httpPort+'/productMouthList.do',
            data: {
              pageNum:this.mouthDataPage
            }
         }).then(function(res){
             if(res.data.errorCode*1 == 200){
                that.mouthlistData = that.mouthlistData.concat(res.data.data.ProductPoJo);
                that.writeData = that.mouthlistData;
                that.mouthDataPage++
             }
             that.ajaxLoding = false;
         }).catch(function(err){
              console.log(err);
              that.ajaxLoding = false;
         });
     },
     slide (data) {
        //console.log(data)
      },
      onTap (data) {
        //console.log(data)
      },
      onInit (data) {
       // console.log(data)
      }
  }
}
</script>

<style lang="scss">
.mint-swipe-item{
  text-align: center;
  img{
    max-width: 100%;
  }
}
.mint-swipe{
  height: 180px;
}
.mint-swipe-indicators{
  bottom:5px;
  left:auto;
  right:0px;
  opacity: 1;
}
.mint-swipe-indicator{
  opacity: 1;
  background-color: #ccc;
}
.border-tag{
  height: px2em(10);
  background-color: #f7f7f7;
}
.loan-contentbox{
  .slider-box{
    width: 100%;
    height: px2em(45);
    position: relative;
    .slider-item{
      justify-content:flex-start;
      position: relative;
      color:#444
    }
    .swiper-container-vertical .slider-pagination-bullets{
      display: none;
    }
    .slider1{
      height: px2em(40);
      font-size: 16px;
      line-height: 24px;
      margin-top: px2em(5);
    }
    .slider-img{
      float: left;
      width: px2em(40);
      height: px2em(40);
      margin-left: px2em(10);
      padding-top:px2em(2);
      overflow: hidden;
      .img{
        background:url('../../images/icon.png');
        width: px2em(30);
        height: px2em(30);
        background-size: 100% 100%;
      }
    }
    .slider-text{
       margin-left: px2em(47);
       text-align: left;
       font-weight: normal;
       p{
        font-size: 14px;
       }
    }
    
    }
    .tody-num{
      position: absolute;
      right: px2em(5);
      top: px2em(0);
      padding-top:px2em(2);
      font-size: 14px;
      font-weight: normal;
      background-color: #f5f5f5;
      z-index:950;
      s{
        color:#dd1712;
      }
  }
  .page-title{
    overflow: hidden;
    background-color: #f5f5f5;
    font-size: 15px;
    font-weight: bold;
  }
}
.bottom-fixed{
  background-color: #fff;
  position: fixed;
  left:0px;
  bottom:0px;
  width: 100%;
  box-shadow: 0 0 12px 1px #e6e6e6;
  .icon-remen{
    font-size: 20px;
  }
  .container{
    padding:0;
  }
  .mu-bottom-nav{
    height: px2em(40);
  }
  .mu-bottom-item{
    max-width: none;
    line-height: px2em(17);
    .mu-bottom-item-text{
      font-size: 14px;
    }
    &.mu-bottom-item-active{
         color:#333;
    }
    &:first-of-type{
      .mu-ripple-wrapper{
        border-right:1px solid #e6e6e6;
      }
   }
  }
  .activeTag{
    color:#f83d37 !important;
  }
}
.list-content{
  padding-bottom: px2em(40);
  ul{
    border-top: 1px solid #e6e6e6;
  }
  li{
    overflow: hidden;
    border-bottom: 1px solid #e6e6e6;
    margin:0 px2em(10);
    padding:px2em(10) 0;
    position: relative;
    .img-box{
     width: px2em(85);
     height: px2em(85);
     text-align: center;
     overflow: hidden;
     background-color: #e6e6e6;
     float: left;
     img{
       max-width: px2em(85);
     }
    }
    .content-box{
      margin-left: px2em(95);
      .h2{
        font-size: 16px;
        font-weight: bold;
      }
      .tips-txt{
        font-size: 14px;
        margin-top: px2em(2); 
        color:#797979;
        s{ 
          font-weight: bold;
        }
      }
      .application-num{
        margin-top: px2em(4);
        s{
          color:#dd1712;
          font-weight: bold;
          font-size: 14px;
          vertical-align: middle;
        }
      }
      .label-box{
        margin-top: px2em(10);
        s{
              display: inline-block;
              border:1px #e06c45 solid;
              margin-right: px2em(5);
              color: #e06c45;
              background-color: #f5f5f5;
              border-radius: 2px;
              font-size: 12px;
              text-align: center;
              padding:0 px2em(5);
        }
      }
    }
    .right-icon{
      position: absolute;
      right: 0px;
      top: 0px;
      i{
        font-size: 24px;
        color:#ff7e00;
        margin-left:px2em(2);
        &.icon-new{
          color:#ff5d26;
          font-size: 25px;
        }
        &.icon-remen4{
          font-size: 26px;
          color:#f02d63;
        }
      }
    }
  }
}
</style>
