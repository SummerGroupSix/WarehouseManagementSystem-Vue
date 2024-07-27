<template>
    <el-row>
        <el-col :span="8" >
            <el-card class="box-card" style="padding-right:10px">
                <div class="user">
                    <img :src="userData.imgUrl">
                    <div class="userinfo">
                        <p class="name">{{userData.username}}</p>
                        <p class="access">{{userData.username}}</p>
                    </div>
                </div>
                <el-divider></el-divider>
                <div class="login-info">
                    账号地址：<span class="address">{{userData.address}}</span>
                </div>
            </el-card>
        </el-col>
        <el-col :span="16" >
            <el-card class="topGragh">
                <Echarts class="chart1" :option="option3" autoresize style="height:35vh; width:58vw; padding: 0; margin: 0;"/>
            </el-card>
        </el-col>
        <el-col>
            <div class="bottomGragh">
                <el-card style="height:50vh;width: 40vw;" class="left">
                    <Echarts class="chart2" :option="option2" autoresize style="height:50vh; width:35vw;"/>
                </el-card>
                <el-card style="height:50vh;width: 60vw;" class="right">
                    <Echarts class="chart3" :option="option" autoresize style="height:50vh; width:55vw;"/>
                </el-card>
            </div>
        </el-col>
        
    </el-row>
</template>
  
<script>
export default {
    name: 'HomePage',
    data(){
        return {
            userData:{},
            mychart1:null,
            option: {
            title: {
                text: '品牌分布',
                subtext: '比例图',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ],
                emphasis: {
                    itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
                }
            ]
            },
            option2: {
                xAxis: {
                    type: 'category',
                    //: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                // : [
                //     {
                //     // data: [120, 200, 150, 80, 70, 110, 130],
                //     type: 'bar'
                //     }
                // ]
            },
            option3: {
                legend: {
                    selectedMode: false
                },
                yAxis: {
                    type: 'value'
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
            },
        }
    },
    methods:{
        transformDataToMatrix(data) {  
            //图3
            // 提取所有唯一的产品名  
            const uniqueProducts = [...new Set(data.map(item => item.product_name))];  
            
            // 初始化二维数组  
            const transformedData = [];  
            const depotNames = [...new Set(data.map(item => item.depot_name))];  
            depotNames.forEach(() => {  
                 const row = []; // 第一列是仓库名  
                // 初始化所有产品的总量为0  
                row.push(...uniqueProducts.map(() => 0));  
                transformedData.push(row);  
            });  
                
            // 填充二维数组  
            data.forEach(item => {  
                const depotIndex = depotNames.findIndex(row => row === item.depot_name);  
                const productIndex = uniqueProducts.findIndex(product => product === item.product_name);  
                if (depotIndex !== -1 && productIndex !== -1) {  
                    transformedData[depotIndex][productIndex] = item.total_quantity; // +1 跳过仓库名  
                }  
            });  
            
            const rawData = transformedData;
            const totalData = [];
            for (let i = 0; i < rawData[0].length; ++i) {
            let sum = 0;
            for (let j = 0; j < rawData.length; ++j) {
                sum += rawData[j][i];
            }
            totalData.push(sum);
            }
            const grid = {
            left: 100,
            right: 100,
            top: 50,
            bottom: 50
            };
            const series = uniqueProducts.map((name, sid) => {
                return {
                    name,
                    type: 'bar',
                    stack: 'total',
                    barWidth: '60%',
                    label: {
                    show: true,
                    formatter: (params) => Math.round(params.value * 1000) / 10 + '%'
                    },
                    data: rawData[sid].map((d, did) =>
                    totalData[did] <= 0 ? 0 : d / totalData[did]
                    )
                };
            });
            this.option3.grid = grid;
            this.option3.series = series;
            this.option3.xAxis.data = depotNames;
            console.log(transformedData);

            //图2
            let sumStorage = [];
            transformedData.forEach((e,index)=>{
                sumStorage[index] = e.reduce((sum,num)=>sum+num,0);
            });
            this.option2 =  {
                xAxis: {
                    type: 'category',
                    data: depotNames
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                    data: sumStorage,
                    type: "bar"
                    }
                ]
            };
        },
        transPieData(data){
        let s=data.map(e=>{
            return {
                value:e.total_count,
                name:e.product_brand
            }
            })
            this.option={
            title: {
                text: '品牌分布',
                subtext: '比例图',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: s,
                emphasis: {
                    itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
                }
            ]
            }
        }
        
    },
    mounted(){
        //获取用户信息
        let params = {
            id:sessionStorage.getItem("userId")
        }
        this.$axios
        .get("/user/getUserById", { params: params })
        .then((res) => {
          console.log(res);
          let data = res.data;
            this.userData = data;
            console.log(this.userData)
        })
        .catch((err) => {
          this.$message.error("请求失败");
          console.log(err);
        });
        //
        this.$axios
        .get("depot-product/getGraphStorage")
        .then((res) => {
          console.log(res);
          let raw = res.data.data;
          let computedData = this.transformDataToMatrix(raw);
          console.log(computedData)
        })
        .catch((err) => {
          this.$message.error("请求失败");
          console.log(err);
        });

        this.$axios
        .get("product/getBrandPart")
        .then((res) => {
          console.log(res);
          let raw = res.data.data;
          let computedData = this.transPieData(raw);
          console.log(computedData)
        })
        .catch((err) => {
          this.$message.error("请求失败");
          console.log(err);
        });
    },
    beforeDestroy() {  
        
    } 
}
</script>

<style lang="less" scoped>
.topGragh /deep/  .el-card__body {  
  padding: 0 !important;  
} 
.bottomGragh /deep/  .el-card__body {  
  padding: 0 !important;  
} 
.topGragh {
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    margin: 10px 10px;
    height: 30vh;
    // width: 30vw;
}
.bottomGragh{
    display: flex;
    justify-content: space-between;
    height:30vh;
    .left{
        margin-top: 10px;
        margin-right: 10px;
    }
    .right{
        margin-top: 10px;
        margin-right: 10px;
    }
}
.box-card{
    padding: 10px 10px;
    margin: 10px 10px;
    height: 30vh;
}
.user{
    display: flex;
    align-items: center;
    img{
        height: 150px;
        margin-right: 40px;
        width: 150px;
        border-radius: 50%;
    }
    .userinfo{
        .name{
            font-size: 32px;
            margin-bottom: 10px;
        }
        .access{
            color: #999;
        }
    }
}
.login-info{
    font-size: 14px;
    color: #999;
    margin-left: 30px;
    .address{
        margin-left: 30px;
        color: #3c3c3c;
    }
}
</style>

  