<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input v-model="productName" placeholder="商品名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPage" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="showAddProduct" icon="el-icon-plus">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border max-height = "600px">
      <el-table-column fixed prop="id" label="商品id"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="productPrice" label="商品单价"></el-table-column>
      <el-table-column prop="productType" label="商品类型"></el-table-column>
      <el-table-column prop="productBrand" label="商品品牌"></el-table-column>
      <el-table-column prop="productOrigin" label="商品产地"></el-table-column>
      <el-table-column prop="updateTime" label="商品更新时间"></el-table-column>
      <el-table-column prop="createTime" label="商品创建时间"></el-table-column>
      <el-table-column prop="operator" label="商品创建人"></el-table-column>
      
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showModifyForm(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="inData(scope.row)">入库</el-button>
          <!-- <el-button type="text" size="small" @click="outData(scope.row)">出库</el-button> -->
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

    <!-- Form -->
    <el-dialog title="添加商品信息" :visible.sync="addProductFormVisible">
      <el-form :model="addProduct">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="addProduct.productName" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="商品单价" :label-width="formLabelWidth">
          <el-input v-model="addProduct.productPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" :label-width="formLabelWidth">
          <el-input v-model="addProduct.productType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" :label-width="formLabelWidth">
          <el-input v-model="addProduct.productBrand" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品产地" :label-width="formLabelWidth">
          <el-input v-model="addProduct.productOrigin" autocomplete="off"></el-input>
        </el-form-item>
          <!-- 
          向后台发送请求 action为请求路径
          handleAvatarSuccess为上传成功触发事件
           -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddProduct">取 消</el-button>
        <el-button type="primary" @click="saveProduct">确 定</el-button>
      </div>
    </el-dialog>

    
    <!-- Form -->
    <el-dialog title="修改商品信息" :visible.sync="updateProductFormVisible">
      <el-form :model="updateProduct">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="updateProduct.productName" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="商品单价" :label-width="formLabelWidth">
          <el-input v-model="updateProduct.productPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" :label-width="formLabelWidth">
          <el-input v-model="updateProduct.productType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" :label-width="formLabelWidth">
          <el-input v-model="updateProduct.productBrand" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品产地" :label-width="formLabelWidth">
          <el-input v-model="updateProduct.productOrigin" autocomplete="off"></el-input>
        </el-form-item>
          <!-- 
          向后台发送请求 action为请求路径
          handleAvatarSuccess为上传成功触发事件
           -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateProduct">取 消</el-button>
        <el-button type="primary" @click="modifyProduct">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 入库 -->
    <el-dialog :visible.sync="dialogVisible" title="入库" @close="resetInForm">  
      <el-form :model="inForm" ref="inForm">  
        <el-form-item label="产品ID" :label-width="formLabelWidth">  
          <el-input v-model="inForm.productId" placeholder="请输入产品ID"></el-input>  
        </el-form-item>  
        <el-form-item label="仓库名称" :label-width="formLabelWidth">  
          <el-input v-model="inForm.depotName" placeholder="请输入仓库名称"></el-input>  
        </el-form-item>  
        <el-form-item label="数量" :label-width="formLabelWidth">  
          <el-input v-model="inForm.quantity" placeholder="请输入数量" type="number"></el-input>  
        </el-form-item>  
      </el-form>  
      <span slot="footer" class="dialog-footer">  
        <el-button @click="dialogVisible = false">取 消</el-button>  
        <el-button type="primary" @click="submitInData">确 定</el-button>  
      </span>  
    </el-dialog> 

    <!-- 出库 -->
    <!-- <el-dialog :visible.sync="outDialogVisible" title="出库" @close="resetOutForm">  
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
    </el-dialog>   -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize:5,
      total:0,
      productName:"",
      id:"",
      addProductFormVisible:false,
      updateProductFormVisible:false,
      products: [], // 产品列表  
      dialogVisible: false, // 入库对话框可见性  
      outDialogVisible: false, // 出库对话框可见性  
      addProduct:{
        productName:"",
        productPrice:"",
        productType:"",
        productBrand:"",
        productOrigin:"",
      },
      updateProduct:{
        productName:"",
        productPrice:"",
        productType:"",
        productBrand:"",
        productOrigin:"",
      },
      inForm: {  
        productId: '',  
        depotName: '',  
        quantity: ''  
      },  
      // outForm: {  
      //   productId: '',  
      //   quantity: ''  
      // },  
      productList:[],
      formLabelWidth:"120px"
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
      this.inForm.productId = row.id; // 设置入库产品ID  
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
    // outData(row) {  
    //   this.outForm.productId = row.productId; // 设置出库产品ID  
    //   this.outDialogVisible = true; // 打开出库对话框  
    // },  
    // submitOutData() {  
    //   this.$axios.post('/product/out', this.outForm)  
    //     .then(res=>{
    //         let data = res.data;
    //         if(data.code == 200){
    //         this.$message.success(data.msg);
    //         this.outDialogVisible = false;  
    //         this.getPage(); // 刷新产品列表  
    //         }
    //         else{
    //         this.$message.error(data.msg);
    //         }
    //     })
    //     .catch(e=>{console.log(e)});
    // },  
    resetInForm() {  
      this.inForm = { productId: '', depotName: '', quantity: '' }; // 重置入库表单  
    },  
    // resetOutForm() {  
    //   this.outForm = { productId: '', quantity: '' }; // 重置出库表单  
    // }  
  },
  mounted(){
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