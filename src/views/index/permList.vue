<template>
    <div>
      <el-form inline>
        <el-form-item>
          <el-input v-model="permName" placeholder="权限名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPage" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border max-height = "600px">
        <el-table-column fixed prop="id" label="序号"></el-table-column>
        <el-table-column prop="permName" label="权限名"></el-table-column>
        <el-table-column prop="permType" label="权限类型"></el-table-column>
        <el-table-column prop="permKey" label="权限编码"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showModifyForm(scope.row)" v-if="permList.indexOf('perm:update')!==-1">修改</el-button>
            <el-button type="text" size="small" @click="deleteData(scope.row)" v-if="permList.indexOf('perm:delete')!==-1">删除</el-button>
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
      <!-- <el-dialog title="添加用户信息" :visible.sync="addPermFormVisible">
        <el-form :model="addUser">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="addUser.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="初始密码" :label-width="formLabelWidth">
            <el-input v-model="addUser.password" autocomplete="off" show-password></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-select v-model="addUser.sex" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input v-model="addUser.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="地址" :label-width="formLabelWidth">
            <el-input v-model="addUser.address" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="头像" :label-width="formLabelWidth">
            
            向后台发送请求 action为请求路径
            handleAvatarSuccess为上传成功触发事件
             
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8088/user/img"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              >
              <img v-if="imgUrl" :src="imgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddUser">取 消</el-button>
          <el-button type="primary" @click="saveUser">确 定</el-button>
        </div>
      </el-dialog> -->
  
      <!-- Form -->
      <el-dialog title="修改权限" :visible.sync="updatePermFormVisible">
        <el-form :model="updatePerm">
          <el-form-item label="权限ID" :label-width="formLabelWidth">
            <el-input v-model="updatePerm.id" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="权限名" :label-width="formLabelWidth">
            <el-input v-model="updatePerm.permName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限类型" :label-width="formLabelWidth">
            <el-input v-model="updatePerm.permType" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限编码" :label-width="formLabelWidth">
            <el-input v-model="updatePerm.permKey" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUpdateUser">取 消</el-button>
          <el-button type="primary" @click="modifyPerm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import PubSub from 'pubsub-js';
  export default {
    data() {
      return {
        tableData: [],
        currentPage: 1,
        pageSize:5,
        total:0,
        permName:"",
        addPermFormVisible:false,
        updatePermFormVisible:false,
        addPerm:{
          permName:"",
          permType:"",
          permKey:"",
        },
        updatePerm:{
          permName:"",
          permType:"",
          permKey:"",
        },
        operator:"",
        permList:[],
        formLabelWidth:"120px"
      };
    },
    methods:{
      getPage(){
        let params = {
          pageSize:this.pageSize,
          pageNumber:this.currentPage
        }
        if(this.permName != ""){
          params.permName = this.permName;
        }
        console.log(params)
        //发送请求
        this.$axios.get('/perm/page',{params:params})
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
      cancelAddPerm(){
        this.addUserFormVisible = false;
      },
      handleAvatarSuccess(res,file){
        console.log(res);
        console.log(file);
        this.imgUrl = res.data;
        this.addUser.imgUrl = res.data;
      },
      showModifyForm(row){
        this.updatePermFormVisible = true;
        this.updatePerm = row;
      },
      handleUpdateSuccess(res,file){
        console.log(res);
        console.log(file);
        this.imgUrl = res.data;
        this.updateUser.imgUrl = res.data;
      },
      cancelUpdateUser(){
        this.updatePermFormVisible = false;
        this.getPage();
      },
      modifyPerm(){
        console.log(this.updatePerm);
        this.updatePerm.operator = this.operator;
        this.$axios.post('/perm/update',this.updatePerm)
        .then(res=>{
          let data = res.data;
          if(data.code === 200){
            this.$message.success(data.msg);
            PubSub.publish("updatePermList");
            this.cancelUpdateUser();
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
  
            this.deletePerm(row);
  
          }).catch(() => {
  
            this.$message({
              type: 'info',
              message: '已取消删除'
            });   
  
          });
      },
      deletePerm(row){
        this.$axios.get('/perm/delete',{params:{"id":row.id}})
            .then(res=>{
              let data = res.data;
              if(data.code === 200){
                this.$message.success(data.msg);
                PubSub.publish("updatePermList");
                this.getPage();
              }
              else{
                this.$message.error(data.msg);
              }
            })
            .catch(e=>{console.log(e)});
      },
      getPermList(){
        this.$axios.get("/user/permList",{params:{"id":sessionStorage.getItem("userId")}})
        .then((res)=>{
          this.permList = res.data.data;
          console.log(this.permList);
        })
        .catch(e=>{console.log(e)});
      },
      getUserInfo(){
        let params = {
          userId:sessionStorage.getItem("userId")
        }

        //发送请求
        this.$axios.get('/user/info',{params:params})
        .then(res=>{
          console.log(res);
          let data = res.data;
          if(data.code==200){
            this.operator = data.data.username;
            console.log(this.updatePerm);
          }
        })
        .catch(err=>{this.$message.error("请求失败");
          console.log(err);
        })
      },
    },
    mounted(){
      this.getPermList();
      this.getUserInfo();
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