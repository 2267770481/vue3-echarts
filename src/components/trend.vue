<script setup lang='ts'>
import { computed, getCurrentInstance, onDeactivated, onMounted, reactive, ref, toRaw } from 'vue';
const gInstance = getCurrentInstance()
const axios = gInstance?.appContext.config.globalProperties.$axios
const echarts = gInstance?.appContext.config.globalProperties.$echarts

const chart = ref(null)
const isShow = ref(false)
const itemKey = ref('')
const titleSize = ref(1)
const text = reactive({
  title: '',
  selector: []
})
let chartInstance: any
let allData: any


onMounted(async () => {
  initChart()
  await getData()
  updataChart()
  window.addEventListener('resize', screenAdapter)
})

// 破坏的时候清除事件
onDeactivated(() => {
  window.removeEventListener('resize', screenAdapter)
})

// 初始化
const initChart = () => {
  chartInstance = echarts.init(chart.value, 'chalk')
  const initOption = {
    xAxis: {
      type: 'category',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        rotate: 45
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    legend: {
      left: "5%",
      top: "12%",
      icon: 'circle'
    },
    grid: {
      left: '2%',
      top: '20%',
      right: '2%',
      bottom: '1%',
      containLabel: true
    },
  }
  chartInstance.setOption(initOption)
  screenAdapter()
}

// 获取数据
const getData = async () => {
  const { data: res } = await axios.get('/data/trend.json')
  allData = res
  // text.selector = allData.type
  // text.title = text.selector[0].type
  text.selector = allData.type
  text.title = text.selector[0].text
  itemKey.value = text.selector[0].type
}

// 更新数据
const updataChart = () => {
  // 半透明的颜色值
  const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)',
    'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)']
  // 全透明的颜色值
  const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)',
    'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)']
  const data = allData[itemKey.value].data
  const xAxisData = data[0].data.map((item: any) => item.month)
  const seriesData = data.map((item: any, index: number) => {
    return {
      type: 'line',
      name: item.name,
      data: item.data,
      stack: 'map',
      areaStyle: {
        color: {
          type: 'liner',
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0, color: colorArr1[index]
            },
            {
              offset: 1, color: colorArr2[index]
            }
          ]
        }
      }
    }
  })

  const updataOption = {
    xAxis: {
      data: xAxisData,
    },
    series: seriesData
  }
  // console.log(updataOption)
  chartInstance.setOption(updataOption)
}
// 屏幕适配
const screenAdapter = () => {
  const baseWidth = chart.value.offsetWidth / 100
  const legendSize = baseWidth * 1.5
  titleSize.value = baseWidth * 3
  const adapterOption = {
    legend: {
      textStyle: {
        fontSize: legendSize*1.3
      }
    }
  }
  chartInstance.setOption(adapterOption)
  chartInstance.resize()
}

// 切换项目
const changeItem = (item: object) => {
  console.log(item)
  text.title = item.text
  itemKey.value = item.type
  isShow.value = false
  console.log(555, itemKey.value)
  updataChart()
}
</script>

<template>
  <div class="com-container">
    <div class="title-container">
      <h4 :style="{fontSize: titleSize + 'px'}">
        ｜{{ text.title }}
        <span class="down" @click="isShow = !isShow">👇</span>
      </h4>
      <div class="select-container" v-if="isShow">
        <p
          class="fl"
          v-for="item in text.selector"
          key="{{item.type}}"
          @click="changeItem(item)"
          :style="{fontSize: titleSize - 10 + 'px'}"
        >{{ item.text }}</p>
      </div>
    </div>
    <div class="chart-container" ref="chart"></div>
  </div>
</template>

<style lang="scss" scoped>
.title-container {
  position: absolute;
  z-index: 10;
  left: 40px;
  top: 10px;
  color: rgb(255, 255, 255);
  h4{
    font-weight: bold;
  }
}
.select-container {
  p {
    border-left: 2px solid wheat;
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 5px;
  }
  p:first-child {
    border-left: none;
  }
}
.down {
  cursor: pointer;
}
</style>