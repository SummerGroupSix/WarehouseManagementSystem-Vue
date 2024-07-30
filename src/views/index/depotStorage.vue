<template>
    <div>
    <el-form inline>
      <el-form-item>
        <el-input v-model="productName" placeholder="商品名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPage" icon="el-icon-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="pageData" border max-height = "600px">
      <el-table-column fixed prop="productId" label="商品id"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="productPrice" label="商品单价"></el-table-column>
      <el-table-column prop="quantity" label="商品库存数量"></el-table-column>
      <el-table-column prop="updateTime" label="商品更新时间"></el-table-column>
      <el-table-column prop="operatorId" label="操作人id"></el-table-column>

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="outData(scope.row)">出库</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 出库 -->
    <el-dialog :visible.sync="outDialogVisible" title="出库" @close="resetOutForm">  
      <el-form :model="outForm" ref="outForm">  
        <el-form-item label="产品ID" :label-width="formLabelWidth">  
          <el-input v-model="outForm.productId" placeholder="请输入产品ID" disabled></el-input>  
        </el-form-item>  
        <el-form-item label="出库数量" :label-width="formLabelWidth">  
          <el-input v-model="outForm.quantity" placeholder="请输入出库数量" type="number"></el-input>  
        </el-form-item>  
      </el-form>  
      <span slot="footer" class="dialog-footer">  
        <el-button @click="outDialogVisible = false">取 消</el-button>  
        <el-button type="primary" @click="submitOutData">确 定</el-button>  
      </span>  
    </el-dialog>  
  </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
      // 分页的数据
      pageData: [],
      currentPage: 1,
      pageSize:5,
      total:0,
      productName:"",
      id:"",
      // quantity:"",
      // productPrice:"",
      // updateTime:"",
      // operator:"",
      outDialogVisible: false, // 出库对话框可见性  
      outForm: {  
        productId: '',  
        quantity: '' ,
        depotId: ''
      },  
      formLabelWidth:"120px"
      };
    },
    methods:{
      getPage(){
        let params = {
          pageSize:this.pageSize,
          pageNumber:this.currentPage,
          depotId: this.depotId
        }
        if(this.productName != ""){
          params.name = this.productName;
        }
        console.log(params)
        //发送请求
        this.$axios.get('/depot-product/page',{params:params})
        .then(res=>{
          console.log(res);
          let data = res.data;
          if(data.code==200){
            this.total = data.data.total;
            this.pageData = data.data.rows;
          }
        })
        .catch(err=>{this.$message.error("请求失败");
          console.log(err);
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getPage();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getPage();
      },

      outData(row) {  
        this.outForm.productId = row.productId; // 设置出库产品ID  
        this.outDialogVisible = true; // 打开出库对话框  
      },  
      submitOutData() { 
        this.outForm.depotId = this.depotId;
        this.$axios.post('/depot-product/out', this.outForm)  
          .then(res=>{
              let data = res.data;
              if(data.code == 200){
              this.$message.success(data.msg);
              this.outDialogVisible = false;  
              this.getPage(); // 刷新产品列表  
              }
              else{
              this.$message.error(data.msg);
              }
          })
          .catch(e=>{console.log(e)});
      },   
      resetOutForm() {  
        this.outForm = { productId: '', quantity: '' }; // 重置出库表单  
      },
    },
    mounted(){
      this.depotId = this.$route.params.id;
      this.getPage();
    }
  };
  </script>
  
  <style lang="less" scoped>
    .block {
      padding: 20px 20px;
      text-align: center;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  </style>