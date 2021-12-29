<script setup lang='ts'>
import { getCurrentInstance, onDeactivated, onMounted, ref } from 'vue';

const instance = getCurrentInstance()
const axios = instance?.appContext.config.globalProperties.$axios
const echarts = instance?.appContext.config.globalProperties.$echarts

const chart = ref(null)
let chartInstance: any
let allData: object[]
let index = 0
const count = 5
let totalPage:number
let gaugeRadius:string
let titleFontSize: number
let detailFontSize: number
let timer: any

onMounted(async () => {
  initChart()
  await getData()
  console.log(allData)
  updateChart()
  screenAdapter()
  window.addEventListener('resize', screenAdapter)
})

onDeactivated(() => {
  clearInterval(timer)
  window.removeEventListener('resize', screenAdapter)
})

// 初始化图表
const initChart = () => {
  chartInstance = echarts.init(chart.value, 'chalk')
  const initOption = {
    title: {
      text: '︳商品销售&库存占比',
      left: '2%',
      top: '5%'
    }
  }
  chartInstance.setOption(initOption)
  chartInstance.on('mouseover', ()=> {
    clearInterval(timer)
  })
  chartInstance.on('mouseout', ()=> {
    setTimer()
  })
  
  setTimer()
}

// 获取数据
const getData = async () => {
  const { data: res } = await axios.get('/data/stock.json')  // 解构取值 从返回值取data并赋值给res
  allData = res
  totalPage = allData.length % count? allData.length / count +1 : allData.length / count
}

// 更新图表
const updateChart = () => {
  const data = allData.slice(index*count, (index+1)*count)
  console.log(555, index)
  // 圆环坐标
  const centerArr = [
    ['18%', '40%'],
    ['50%', '40%'],
    ['82%', '40%'],
    ['34%', '75%'],
    ['66%', '75%'],
  ]
  const seriesData = data.map((item, index) => {
    return {
      type: 'gauge',
      radius: gaugeRadius,
      name: 'aaa',
      startAngle: 90,
      endAngle: -270,
      pointer: {
        show: false
      },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          // borderWidth: 1,
          // borderColor: '#464646'
        }
      },
      splitLine: {
        show: false,
        distance: 0,
        length: 10
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false,
        distance: 50
      },
      axisLine: {
        lineStyle: {
          width: 20
        }
      },
      title: {
        fontSize: titleFontSize,
        color: "whate",
      },
      detail: {
        color: 'auto',
        fontSize: detailFontSize,
        borderColor: 'auto',
        // borderRadius: 20,
        // borderWidth: 1,
        formatter: '{value}%',
      },
      data: item.data,  // 数据里边包含每个标题个值的位置坐标。
      center: centerArr[index]
    }
  })
  const updateOption = {
    series: seriesData
  }
  console.log(updateOption)
  chartInstance.setOption(updateOption)
}

// 屏幕适配
const screenAdapter = () => {
  const baseSize = chart.value.offsetWidth / 100
  console.log(baseSize)
  gaugeRadius = `${baseSize*10}%`
  titleFontSize = baseSize*2
  detailFontSize = baseSize*1.8
  updateChart()
  chartInstance.resize()
}

const setTimer = ()=>{
  if (timer) {
    clearInterval(timer)
  }
  timer = setInterval(() => {
    index++
    if (index==totalPage)
    {
      index = 0
    }
    updateChart()
  }, 3000)
}
</script>

<template>
  <div class="com-container">
    <div class="chart-container" ref="chart"></div>
  </div>
</template>

<style scoped>
</style>