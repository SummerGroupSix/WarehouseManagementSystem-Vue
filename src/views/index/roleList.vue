<template>
    <div style="width:100vw;height: 100vh;">
        <Echarts class="chart" :option="option" />
    </div>
</template>
  
<script>
  
export default {
    name: 'roleList',
    data(){
        return {
            option: {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                    data: [150, 230, 224, 218, 135, 147, 260],
                    type: 'line'
                    }
                ]
            }
        }
    }
}
</script>

  