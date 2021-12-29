<script setup lang='ts'>
import trendVue from '../components/trend.vue';
import sellerVue from '../components/seller.vue';
import mapVue from '../components/map.vue';
import hotVue from '../components/hot.vue';
import rankVue from '../components/rank.vue';
import stockVue from '../components/stock.vue';

</script>

<template>
  <div class="com-container">
    <div class="header">
      <img src="~@/assets/images/header_border_dark.png" alt="" />
      <p class="left">along</p>
      <p class="middle">电商平台实时监控系统</p>
      <p class="right">time</p>
    </div>
    <div class="body-box">
      <div class="left-box fl">
        <div class="trend-box">
          <trendVue/>
        </div>
        <div class="seller-box">
          <sellerVue />
        </div>
      </div>
      <div class="middle-box fl">
        <div class="map-box">
          <mapVue/>
        </div>
        <div class="rank-box">
          <rankVue/>
        </div>
      </div>
      <div class="right-box fl">
        <div class="hot-box">
          <hotVue/>
        </div>
        <div class="stock-box">
          <stockVue/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.com-container{
  background-color: #161522;
}
.header{
  width: 100%;
  height: 60px;
  font-size: 20px;
  position: relative;
  color: wheat;
  img{
    width: 100%
  };
  p{
    position: absolute;
    top: 10px;
  };
  .left{left: 2%;}
  .left{left: 2%;};
  .middle{ left: 43%; top: 30%;};
  .right{ right: 2%;}
};
.body-box{
  width: 100%;
  position: relative;
  padding: 0 15px;
};
.left-box{
  width: 28%;
  .trend-box{
    height: 350px;
    margin-bottom: 10px;
  };
  .seller-box{
    height: 220px;
  }
}
.middle-box{
  margin: 0 10px;
  width: 40%;
  .map-box{
    height: 400px;
    margin-bottom: 10px;
  };
  .rank-box{
    height: 170px;
  }
}
.right-box{
  width: 28%;
  .hot-box{
    height: 300px;
    margin-bottom: 10px;
    position: relative;
  };
  .stock-box{
    height: 270px;
    margin-top: 5px;
  }
}
</style>