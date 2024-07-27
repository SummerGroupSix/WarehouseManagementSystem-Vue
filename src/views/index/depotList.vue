<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input v-model="depotName" placeholder="仓库名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPage" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="showAddDepot" icon="el-icon-plus" >添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border max-height = "600px">
      <el-table-column fixed prop="id" label="仓库id"></el-table-column>
      <el-table-column prop="depotName" label="仓库名称"></el-table-column>
      <el-table-column prop="depotAddress" label="仓库地址"></el-table-column>
      <el-table-column prop="depotCapacity" label="仓库容量"></el-table-column>
      
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showModifyForm(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="openDepotStorage(scope.row)">查看仓库</el-button>
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
    <el-dialog title="添加仓库信息" :visible.sync="addDepotFormVisible">
      <el-form :model="addDepot">
        <el-form-item label="仓库名称" :label-width="formLabelWidth">
          <el-input v-model="addDepot.depotName" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="仓库地址" :label-width="formLabelWidth">
          <el-input v-model="addDepot.depotAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="仓库容量" :label-width="formLabelWidth">
          <el-input v-model="addDepot.depotCapacity" autocomplete="off"></el-input>
        </el-form-item>
          <!-- 
          向后台发送请求 action为请求路径
          handleAvatarSuccess为上传成功触发事件
           -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddDepot">取 消</el-button>
        <el-button type="primary" @click="saveDepot">确 定</el-button>
      </div>
    </el-dialog>

    <!-- Form -->
    <el-dialog title="修改仓库信息" :visible.sync="updateDepotFormVisible">
      <el-form :model="updateDepot">
        <el-form-item label="仓库名称" :label-width="formLabelWidth">
          <el-input v-model="updateDepot.depotName" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="仓库地址" :label-width="formLabelWidth">
          <el-input v-model="updateDepot.depotAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="仓库容量" :label-width="formLabelWidth">
          <el-input v-model="updateDepot.depotCapacity" autocomplete="off"></el-input>
        </el-form-item>
          <!-- 
          向后台发送请求 action为请求路径
          handleAvatarSuccess为上传成功触发事件
           -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateDepot">取 消</el-button>
        <el-button type="primary" @click="modifyDepot">确 定</el-button>
      </div>
    </el-dialog>
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
      id:"",
      depotName:"",
      addDepotFormVisible:false,
      updateDepotFormVisible:false,
      addDepot:{
        depotName:"",
        depotAddress:"",
        depotCapacity:"",
      },
      updateDepot:{
        depotName:"",
        depotAddress:"",
        depotCapacity:"",
      },
      depotList:[],
      formLabelWidth:"120px"
    };
  },
  methods:{
    getPage(){
      let params = {
        pageSize:this.pageSize,
        pageNumber:this.currentPage
      }
      if(this.depotName != ""){
        params.name = this.depotName;
      }
      console.log(params)
      //发送请求
      this.$axios.get('/depot/page',{params:params})
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
    cancelAddDepot(){
      this.addDepotFormVisible = false;
    },
    saveDepot(){
      this.addDepotFormVisible = false;
      console.log(this.addDepot);
      this.$axios.post('/depot/add',this.addDepot)
      .then(res=>{
        let data = res.data;
        if(data.code == 200){
          this.$message.success(data.msg);
          this.getPage();
          this.cancelAddDepot();
        }
        else{
          this.$message.error(data.msg);
        }
      })
      .catch(e=>{console.log(e)});
    },
    showAddDepot(){
      this.addDepotFormVisible = true;
    },
    showModifyForm(row){
      this.updateDepotFormVisible = true;
      this.updateDepot = row;
    },
    cancelUpdateDepot(){
      this.updateDepotFormVisible = false;
      this.getPage();
    },
    modifyDepot(){
      console.log(this.updateDepot);
      this.$axios.post('/depot/update',this.updateDepot)
      .then(res=>{
        let data = res.data;
        if(data.code == 200){
          this.$message.success(data.msg);
          this.cancelUpdateDepot();
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

          this.deleteDepot(row);

        }).catch(() => {

          this.$message({
            type: 'info',
            message: '已取消删除'
          });   

        });
    },
    deleteDepot(row){
      this.$axios.get('/depot/delete',{params:{"id":row.id}})
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
    openDepotStorage(row){
      this.$router.replace({name:'depotStorage',params: {id:row.id}})
    }
    // getDepotList(){
    //   this.$axios.get("/depot/list/{id}",{params:{"id":sessionStorage.getItem("id")}})
    //   .then((res)=>{
    //     this.depotList = res.data.data;
    //     console.log(this.depotList);
    //   })
    //   .catch(e=>{console.log(e)});
    // }
  },
  mounted(){
    this.getPage();
    // this.getDepotList();
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