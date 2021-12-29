<script setup lang='ts'>
  import { log } from 'console';
import { init } from 'echarts';
import { computed, getCurrentInstance, onDeactivated, onMounted, ref } from 'vue';
  const instance = getCurrentInstance()
  const axios = instance?.appContext.config.globalProperties.$axios
  const echarts = instance?.appContext.config.globalProperties.$echarts


  const chart = ref(null)
  const goodsName = ref('')
  let chartInstance: any
  let allData:object[]
  let baseIndex = 1

  onMounted(async ()=> {
    initChart()
    await getData()
    updateChart()
    window.addEventListener('resize', screenAdapter)
  })

  onDeactivated(()=> {
    window.removeEventListener('resize', screenAdapter)
  })
  // 初始化图表
  const initChart = ()=>{
    chartInstance = echarts.init(chart.value, 'chalk')
    const initOption = {
      title: {
        text: "︱热销占比",
        left: 20,
        top: 20,
        textStyle: {
          fontWeight: 'normal'
        }
      },
      tooltip: {
        show: true,
        formatter: (args) => {
          const baseData = args.data.children
          let total = 0
          let childrenInfo:string = ''
          baseData.map((item) => {
            total += item.value
          })
          baseData.map((item) => {
            childrenInfo += `<br>&nbsp;${item.name}: ${(item.value / total * 100).toFixed(2)} %`
          })
          return `<b>${args.name}: ${args.percent}%</b>  ${childrenInfo}`
        }
      },
      legend:{
        top:"15%",
        icon: 'circle'
      },
      series: {
        type: 'pie',
        label: {
          show: false
        },
        center: ["50%", "60%"],
        emphasis: {
          label: {
            show: true
          },
          labelLine: {
            show: false
          }
        }
      }
    }
    chartInstance.setOption(initOption)
    screenAdapter()
  }

  // 获取数据
  const getData = async () => {
    const {data: res} = await axios.get('/data/hot.json')  // 解构取值 从返回值获取data 并赋值给res
    allData = res
  }

  // 更新图表
  const updateChart = () => {
    goodsName.value = allData[baseIndex].name
    const updateOption = {
      series: {
        data: allData[baseIndex].data
      }
    }
    chartInstance.setOption(updateOption)
  }

  // 屏幕适配
  const screenAdapter = () => {
    const baseSize = chart.value.offsetWidth / 100
    const adapterOption = {
      title: {
        textStyle: {
          fontSize: baseSize * 3.8
        }
      }
    }
    chartInstance.setOption(adapterOption)
    chartInstance.resize()
  }

  // 左按钮事件
  const leftEnv = ()=>{
    baseIndex--
    if(baseIndex < 0) {
      baseIndex = allData.length - 1
    }
    updateChart()
  }
  // 右按钮事件
  const rightEnv = () => {
    baseIndex++
    if(baseIndex == allData.length) {
      baseIndex = 0
    }
    updateChart()
  }
</script>

<template>
  <div class="com-container">
    <div class="chart-container" ref="chart"></div>
    <div class="left" @click="leftEnv">&lsaquo;</div>
    <div class="right" @click="rightEnv">&rsaquo;</div>
    <div class="goods-name">{{goodsName}}</div>
  </div>
</template>

<style scoped>
.left, .right{
  position: absolute;
  top: 50%;
  color: wheat;
  cursor: pointer;
}
.left{
  left: 5%;
}
.right{
  right: 5%;
}
.goods-name{
  position: absolute;
  bottom: 5%;
  right: 5%;
  color: wheat;
}
</style>