# scss全局样式不生效
## 问题
```
在global.scss文件中写了某个全局样式，但是在vue文件中却不生效。比如以下的 .chart-container 样式。
------------
$font-color: red;
.com-container{
  width: 100%;
  height: 100%;
};
.chart-container {
  width: 100%;
  height: calc(100vh);
};
canvas {
  border-radius:25px;
}
```
## 解决方案
```
现在vue文件中使用以下在global.scss文件中定义的变量，比如上边的$font-color，这样上边定义的.chart-container 这个样式就会在这个vue文件中生效了。
```