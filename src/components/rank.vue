<script setup lang='ts'>
import { log } from 'console';
import { getCurrentInstance, onDeactivated, onMounted, ref } from 'vue';

const instance = getCurrentInstance()
const axios = instance?.appContext.config.globalProperties.$axios
const echarts = instance?.appContext.config.globalProperties.$echarts

const chart = ref(null)
let chartInstance: any
let allData: object[]
let startValue = 0
let endValue = 9
let timers: any

onMounted(async () => {
  initChart()
  await getData()
  console.log(allData)
  updataChart()
  startTimer()
  window.addEventListener('resize', screenAdapter)
})

// 破坏的时候清除事件
onDeactivated(()=>{
  clearInterval(timers)
  window.removeEventListener('resize', screenAdapter)
})

const startTimer = () => {
  if (timers){
    clearInterval(timers)
  }
  timers =  setInterval(() => {
    startValue++
    endValue++
    if (endValue >= allData.length) {
      startValue = 0
      endValue = 9
    }
    const timerOption = {
      dataZoom: {
        startValue: startValue,
        endValue: endValue
      }
    }
    chartInstance.setOption(timerOption)
  }, 3000)
}

// 初始化图表
const initChart = () => {
  chartInstance = echarts.init(chart.value, 'chalk')
  const initOption = {
    title: {
      text: '︳地区销量排行',
      left: '5%',
      top: '2%',
      textStyle: {
        fontWeight: 'normal'
      }
    },
    grid: {
      left: '10%',
      top: '18%',
      right: '10%',
      bottom: '1%',
      containLabel: true
    },
    tooltip:{},
    dataZoom: [
      {
        type: 'slider',
        show: false,
        startValue: startValue,
        endValue: endValue
      }
    ],
    xAxis: {
      type: 'category',
      axisLabel:{
        rotate: 45,
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        rotate: 45
      },
      // max: 12000,
      // min: 1000,
      scale:true
    },
    series: [
      {
        name: '地区销量统计',
        type: 'bar',
      }
    ]
  }
  chartInstance.setOption(initOption)
  screenAdapter()
  chartInstance.on('mouseover', ()=> {
    clearInterval(timers)
  })
  chartInstance.on('mouseout', ()=> {
    startTimer()
  })
}

// 获取数据
const getData = async () => {
  const { data: res } = await axios.get('/data/rank.json')   // 解构取值，从返回值中回去data 并赋值给res
  allData = res.sort((a: object, b: object) => {  // 对res进行从大到小排序 并赋值给allData
    return b.value - a.value
  })
}

// 更新图表数据
const updataChart = () => {
  const colorArr = [
    ['#0BA82C', '#4FF778'],
    ['#2E72BF', '#23E5E5'],
    ['#5052EE', '#AB6EE5']
  ]
  const updataOption = {
    xAxis: {
      data: allData.map(item => item.local)
    },
    series: {
      data: allData.map(item => item.value),
      itemStyle: {
        borderRadius: [20, 20, 0, 0],
        color: (item: any) => {   // 
          let targetColorArr: string[]
          if (item.value > 8000) {
            targetColorArr = colorArr[0]
          } else if (item.value > 5000) {
            targetColorArr = colorArr[1]
          } else {
            targetColorArr = colorArr[2]
          }
          return {    // 颜色渐变
            type: 'linear',
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0, color: targetColorArr[0]
              },
              {
                offset: 1, color: targetColorArr[1]
              }
            ]
          }
        }
      }
    }
  }
  chartInstance.setOption(updataOption)
}

// 屏幕适配
const screenAdapter = () => {
  const baseSize = chart.value.offsetWidth / 100
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: baseSize*2.8
      }
    },
    series: [
      {
        barWidth: baseSize*3,
      }
    ]
  }
  chartInstance.setOption(adapterOption)
  chartInstance.resize()
}


</script>

<template>
  <div class="com-container">
    <div class="chart-container" ref="chart"></div>
  </div>
</template>

<style scoped>
</style>