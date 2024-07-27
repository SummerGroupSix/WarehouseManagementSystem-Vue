<template>
    <div>
        depotStorage
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
      };
    },
    methods:{
      getPage(){
        let params = {
          pageSize:this.pageSize,
          pageNumber:this.currentPage
        }
        if(this.productName != ""){
          params.name = this.productName;
        }
        console.log(params)
        //发送请求
        this.$axios.get('/product/page',{params:params})
        .then(res=>{
          console.log(res);
          let data = res.data;
          if(data.code==200){
            this.total = data.data.total;
            this.tableData = data.data.rows;
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
      cancelAddProduct(){
        this.addProduxtFormVisible = false;
      },
      saveProduct(){
        this.addProductFormVisible = false;
        console.log(this.addProduct);
        this.$axios.post('/product/add',this.addProduct)
        .then(res=>{
          let data = res.data;
          if(data.code == 200){
            this.$message.success(data.msg);
            this.getPage();
            this.cancelAddProduct();
          }
          else{
            this.$message.error(data.msg);
          }
        })
        .catch(e=>{console.log(e)});
      },
      showAddProduct(){
        this.addProductFormVisible = true;
      },
      showModifyForm(row){
        this.updateProductFormVisible = true;
        this.updateProduct = row;
      },
      cancelUpdateProduct(){
        this.updateProductFormVisible = false;
        this.getPage();
      },
      modifyProduct(){
        console.log(this.updateProduct);
        this.$axios.post('/product/update',this.updateProduct)
        .then(res=>{
          let data = res.data;
          if(data.code == 200){
            this.$message.success(data.msg);
            this.cancelUpdateProduct();
          }
          else{
            this.$message.error(data.msg);
          }
        })
        .catch(e=>{console.log(e)});
      },
      deleteData(row){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
  
          }).then(() => {
  
            this.deleteProduct(row);
  
          }).catch(() => {
  
            this.$message({
              type: 'info',
              message: '已取消删除'
            });   
  
          });
      },
      deleteProduct(row){
        this.$axios.get('/product/delete',{params:{"id":row.id}})
            .then(res=>{
              let data = res.data;
              if(data.code == 200){
                this.$message.success(data.msg);
                this.getPage();
              }
              else{
                this.$message.error(data.msg);
              }
            })
            .catch(e=>{console.log(e)});
      },
      inData(row) {  
        this.inForm.productId = row.productId; // 设置入库产品ID  
        this.dialogVisible = true; // 打开入库对话框  
      },  
      submitInData() {  
        this.$axios.post('/product/in', this.inForm)  
          .then(res=>{
              let data = res.data;
              if(data.code == 200){
              this.$message.success(data.msg);
              this.dialogVisible = false;  
              this.getPage(); // 刷新产品列表
              }
              else{
              this.$message.error(data.msg);
              }
          })
          .catch(e=>{console.log(e)});
      },  
      outData(row) {  
        this.outForm.productId = row.productId; // 设置出库产品ID  
        this.outDialogVisible = true; // 打开出库对话框  
      },  
      submitOutData() {  
        this.$axios.post('/product/out', this.outForm)  
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
      resetInForm() {  
        this.inForm = { productId: '', depotName: '', quantity: '' }; // 重置入库表单  
      },  
      resetOutForm() {  
        this.outForm = { productId: '', quantity: '' }; // 重置出库表单  
      },
    },
    mounted(){
        this.depotId = this.$route.params.id
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