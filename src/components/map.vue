<script setup lang='ts'>
import { normalize } from 'path/posix';
import { getCurrentInstance, onDeactivated, onMounted, ref } from 'vue';
const instance = getCurrentInstance()
const axios = instance?.appContext.config.globalProperties.$axios
const echarts = instance?.appContext.config.globalProperties.$echarts

const chart = ref(null)
let chartInstance: any
let chinaMap: object[]
let userInfo: object[]

onMounted(async () => {
  initChart()
  await getData()
  console.log(chinaMap)
  updataChart()
  setLines()
  window.addEventListener('resize', screenAdapter)
})

// 破坏的时候清除事件
onDeactivated(()=> {
  window.removeEventListener('resize', screenAdapter)
})

// 初始化echarts
const initChart = () => {
  chartInstance = echarts.init(chart.value, 'chalk')
  const initOption = {
  }
  chartInstance.setOption(initOption)
  screenAdapter()
  chartInstance.on('click', (item: any) => {
    console.log(item)
  })
}

// 获取数据
const getData = async () => {
  const { data: res } = await axios.get('/map/china.json')  // 解构取值 从返回值里取data并赋值给res
  chinaMap = res
  const { data: user } = await axios.get('/data/map.json')
  userInfo = user
}

// 更新图表
const updataChart = () => {
  echarts.registerMap('china', chinaMap)
  const scatterSeris = userInfo.map((item: object) => {  // 对数组调用map方法对其进行遍历,返回结果也是数组类型
    return {
      name: item.key,
      type: 'effectScatter',
      coordinateSystem: 'geo',
      symbolSize: 10,
      rippleEffect: {
        scale: 5,
        brushType: 'stroke'
      },
      data: item.value.map((local: object) => {
        return local.cp
      })
    }
  })

  const updataOption = {
    title: {
      text: '︳用户地区分布图',
      left: '5%',
      top: '5%',
      textStyle: {
        fontWeight: 'normal',
      }
    },
    legend: {
      left: '10%',
      bottom: '5%',
      orient: 'vertical'
    },
    geo: {
      type: 'map',
      map: 'china',
      // left: '15%',
      // right: '15%',
      // top: '2%',
      // bottom: '1%',
      label: {
        show: true
      },
      itemStyle: {
        areaColor: 'skyblue'
      },
      roam: true,
      scaleLimit: {
        min: 1,
        max: 10
      }
    },
    series:scatterSeris
  }
  chartInstance.setOption(updataOption)
}

// 屏幕适配
const screenAdapter = () => {
  const baseSize = chart.value.offsetWidth / 100
  const mapLeft = baseSize * 20
  const hightBase = 1.2
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: baseSize*2.8
      }
    }
  }
  chartInstance.setOption(adapterOption)
  chartInstance.resize()
}

const setLines = () => {
  const linesOption = {
    series: [
      {},   // 这三个空对象表示的是updata里边的用户数据
      {},
      {},
      {
        type: 'lines',
        // name: '航线',
        coordinateSystem: 'geo',
        symbol: ['none', 'arrow'],
        symbolSize: 10,
        lineStyle: {
          normal: {
            color: {
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#FF6600' // 0% 处的颜色
              }, {
                offset: 1, color: '#FFCC99'  // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            width: 2,
            opacity: 0.6,
            curveness: 0.7
          },
        },
        data: [{
          coords: [
            [112.982279, 28.19409],  // 起点
            [117.190182, 39.125596]  // 终点
          ],
        }],
        effect: {
          show: true,
          symbol: 'arrow',
          symbolSize: 10
        }
      }
    ]
  }

  chartInstance.setOption(linesOption)
}

</script>

<template>
  <div class="com-container">
    <div class="chart-container" ref="chart"></div>
  </div>
</template>

<style scoped>
</style>