<!-- 横向柱状图 -->
<script setup lang='ts'>
import { dataTool } from 'echarts';
import { computed, getCurrentInstance, onDeactivated, onMounted, reactive, ref, resolveDirective, toRaw, toRef, toRefs } from 'vue';

// 从全局属性中获取echarts, axios
const instance = getCurrentInstance();
const axios = instance?.appContext.config.globalProperties.$axios;
const echarts = instance?.appContext.config.globalProperties.$echarts;

// 获取dom元素
const chart = ref(null)

let scllerChart: any = null
let allData: object[]
let timer: any
let currentPage = 0
const perCount = 5  // 每页显示的数量
const totalPage = computed(() => {
  return allData.length % perCount === 0 ? allData.length / perCount : allData.length / perCount + 1
})

onMounted(async () => {
  initEchart()
  await getData()
  updateEcharts()
  setTimer()
  window.addEventListener('resize', screenAdapter)
})

// 破坏的时候清除事件
onDeactivated(()=> {
  window.removeEventListener('resize', screenAdapter)
})

const setTimer = () => {
  if (timer) {
    clearInterval(timer)
  }
  timer = setInterval(() => {
    currentPage++
    if (currentPage == totalPage.value) {
      currentPage = 0
    }
    updateEcharts()
  }, 3000)
}

// 清除定时器
onDeactivated(() => {
  clearInterval(timer)
})

// 初始化echarts
const initEchart = () => {
  scllerChart = echarts.init(chart.value, 'chalk')
  const initOption = {
    title: {
      text: '｜商家销售统计',
      top: "5%",
      left: "5%",
      textStyle: {
        fontWeight: 'normal'
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        z: 0,
        lineStyle: {
          type: 'solid',
          color: '#2d3443',
        }
      }
    },
    grid: {
      // show: true,
      width: 'auto',
      left: '1%',
      right: '5%',
      top: '15%', 
      bottom: '1%', 
      containLabel: true,
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
    },
    series: [
      {
        name: '销售量',
        type: 'bar',
        label: {
          show: true,
          position: 'right'
        },
        itemStyle: {
          borderRadius: [0, 30, 30, 0],
          color: {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0, color: '#5052EE'
              },
              {
                offset: 1, color: '#AB6EE5'
              }
            ]
          }
        },
        backgroundStyle: {
          color: 'red'
        }
      }
    ]
  }
  scllerChart.setOption(initOption)
  // 鼠标移入，清除定时器
  scllerChart.on('mouseover', () => {
    clearInterval(timer)
  })
  // 鼠标移出 设置定时器
  scllerChart.on('mouseout', () => {
    setTimer()
  })
  // 屏幕适配
  screenAdapter()
}

// 获取数据
const getData = async () => {
  const { data: res } = await axios.get('/data/seller.json')  // 解构取值 从返回值里取data并赋值给res
  res.sort((a: any, b: any) => a.value - b.value)
  allData = res
}

// 更新echarts数据
const updateEcharts = () => {
  const data = allData.slice(currentPage * perCount, (currentPage + 1) * perCount)
  const yAxisData = data.map((item: any) => item.name)  // 对数组调用map方法对其进行遍历,返回结果也是数组类型
  const xAxisData = data.map((item: any) => item.value)

  scllerChart.setOption({
    yAxis: {
      data: yAxisData
    },
    series: [
      {
        data: xAxisData
      }
    ]
  })

}

// 屏幕适配
const screenAdapter = () => {
  const screenWidth = chart.value.offsetWidth
  const fontSize = screenWidth / 100 * 3
  console.log(fontSize)
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: fontSize*1.3
      },
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          width: fontSize+5,
        }
      }
    },
    series: [
      {
         barWidth: fontSize+5,
      }
    ]
  }
  scllerChart.setOption(adapterOption)
  scllerChart.resize()
}


</script>

<template>
  <div class="com-container">
    <div class="chart-container" ref="chart"></div>
  </div>
</template>

<style lang="scss" scoped>

</style>