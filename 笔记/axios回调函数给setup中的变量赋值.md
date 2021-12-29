# axios回调函数给setup中的变量赋值

## 错误放法
```
<script setup lang='ts'>
  let allData:any

  onMounted(() => {
    getData()
    console.log(888, allData);
  })

  // 获取数据
  const getData = async () => {
    await axios.get('/data/seller.json').then((res: any) => {
      allData = res.data
    })
  }
</script>
--------------
像上边这种直接是没法赋值的，可以用this.xxx 去赋值，但是setup中不能使用this。所以可以用以下的方法。
```

## 正确用法
```
<script setup lang='ts'>
  let allData:any = null


  onMounted(async () => {
    await getData()   // 注意这里也要用await 将异步变成同步
    console.log(allData);
    
  })

  // 获取数据
  const getData = async () => {
    const {data: res} = await axios.get('/data/seller.json')  // 将异步变成同步
    allData = res
  }
</script>
---------------
原因： 因为axios是异步的，所以在调用的时候，get请求还没有执行完，所以要将异步变成同步的方式去调用。注意要在getData函数和onMounted的函数中都需要变成同步。
```
