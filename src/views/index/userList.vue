<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input v-model="username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPage" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="showAddUser" icon="el-icon-plus" v-if="permList.indexOf('user:add')!==-1">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border max-height = "600px">
      <el-table-column fixed prop="id" label="序号"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="imgUrl" label="头像">
        <template slot-scope="scope">
          <!-- {{ scope.row.imgUrl }} -->
          <img :src="scope.row.imgUrl" width="100" height="100" v-if="scope.row.imgUrl!==null"/>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showModifyForm(scope.row)" v-if="permList.indexOf('user:update')!==-1">修改</el-button>
          <el-button type="text" size="small" @click="deleteData(scope.row)" v-if="permList.indexOf('user:delete')!==-1">删除</el-button>
          <el-button type="text" size="small" @click="changeRole(scope.row)" v-if="permList.indexOf('user:role')!==-1">分配角色</el-button>
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
    <el-dialog title="添加用户信息" :visible.sync="addUserFormVisible">
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
        <!-- <el-form-item label="角色" :label-width="formLabelWidth" v-if="permList.indexOf('user:role')!==-1">
          <el-select v-model="selectRoleList" placeholder="请选择角色" multiple>
            <el-option v-for="o in roleList" :key="o.id" :label="o.roleName" :value="o.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="addUser.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="addUser.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <!-- 
          向后台发送请求 action为请求路径
          handleAvatarSuccess为上传成功触发事件
           -->
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8088/user/img"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            >
            <img v-if="addUser.imgUrl" :src="addUser.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddUser">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- Form -->
    <el-dialog title="修改用户信息" :visible.sync="updateUserFormVisible">
      <el-form :model="updateUser">
        <el-form-item label="用户ID" :label-width="formLabelWidth">
          <el-input v-model="updateUser.id" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="updateUser.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始密码" :label-width="formLabelWidth">
          <el-input v-model="updateUser.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-select v-model="updateUser.sex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="角色" :label-width="formLabelWidth" v-if="permList.indexOf('user:role')!==-1">
          <el-select v-model="selectRoleList" placeholder="请选择角色" multiple>
            <el-option v-for="o in roleList" :key="o.id" :label="o.roleName" :value="o.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="updateUser.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="updateUser.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <!-- 
          向后台发送请求 action为请求路径
          handleAvatarSuccess为上传成功触发事件
           -->
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8088/user/img"
            :show-file-list="false"
            :on-success="handleUpdateSuccess"
            >
            <img v-if="updateUser.imgUrl" :src="updateUser.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateUser">取 消</el-button>
        <el-button type="primary" @click="modifyUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- Form -->
    <el-dialog title="分配角色" :visible.sync="roleFormVisible">
      <el-form :model="roleForm">
        <el-form-item label="角色" :label-width="formLabelWidth" v-if="permList.indexOf('user:role')!==-1">
          <el-select v-model="roleForm.roleId" placeholder="请选择角色" multiple>
            <el-option v-for="o in roleList" :key="o.id" :label="o.roleName" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRoleForm">取 消</el-button>
        <el-button type="primary" @click="saveRoleForm">确 定</el-button>
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
      roleList:[],
      // userRoleList:[],
      roleFormVisible:false,
      username:"",
      addUserFormVisible:false,
      updateUserFormVisible:false,
      imgUrl:"",
      addUser:{
        username:"",
        sex:"",
        age:"",
        address:"",
        password:"",
        roleName:""
      },
      updateUser:{
        username:"",
        sex:"",
        age:"",
        address:"",
        password:"",
        roleName:""
      },
      roleForm:{
        userId:"",
        roleId:[]
      },
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
      if(this.username != ""){
        params.username = this.username;
      }
      console.log(params)
      //发送请求
      this.$axios.get('/user/page',{params:params})
      .then(res=>{
        console.log(res);
        let data = res.data;
        if(data.code==200){
          this.total = data.data.total;
          this.tableData = data.data.rows;
          // this.userRoleList = data.data.rows.map(e=>{
          //   return {
          //     "id":e.id,
          //     "roleList":e.roleList
          //   };
          // })
          // console.log(this.userRoleList)
        }
      })
      .catch(err=>{this.$message.error("请求失败");
        console.log(err);
      })
    },
    getRole(){
      //发送请求
      this.$axios.get('/role/roleNameList')
      .then(res=>{
        console.log(res);
        let data = res.data;
        if(data.code==200){
          this.roleList = data.data;
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
    cancelAddUser(){
      this.addUserFormVisible = false;
      this.imgUrl = "";
    },
    saveUser(){
      this.addUserFormVisible = false;
      console.log(this.addUser);
      this.$axios.post('/user/add',this.addUser)
      .then(res=>{
        let data = res.data;
        if(data.code === 200){
          this.$message.success(data.msg);
          this.getPage();
          this.cancelAddUser();
        }
        else{
          this.$message.error(data.msg);
        }
      })
      .catch(e=>{console.log(e)});
    },
    showAddUser(){
      this.addUserFormVisible = true;
    },
    handleAvatarSuccess(res,file){
      console.log(res);
      console.log(file);
      this.imgUrl = res.data;
      this.addUser.imgUrl = res.data;
    },
    showModifyForm(row){
      this.updateUserFormVisible = true;
      this.updateUser = row;
      this.imgUrl = row.imgUrl;
      // this.userRoleList.forEach((e)=>{
      //     if(e.id === row.id){
      //       this.selectRoleList = e.roleList;
      //     }
      // });
    },
    handleUpdateSuccess(res,file){
      console.log(res);
      console.log(file);
      this.imgUrl = res.data;
      this.updateUser.imgUrl = res.data;
    },
    cancelUpdateUser(){
      this.updateUserFormVisible = false;
      
      this.getPage();
    },
    modifyUser(){
      console.log(this.selectRoleList)
      console.log(this.updateUser);
      this.$axios.post('/user/update',this.updateUser)
      .then(res=>{
        let data = res.data;
        if(data.code === 200){
          this.$message.success(data.msg);
          this.selectRoleList = "";
          this.imgUrl = "";
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

          this.deleteUser(row);

        }).catch(() => {

          this.$message({
            type: 'info',
            message: '已取消删除'
          });   

        });
    },
    deleteUser(row){
      this.$axios.get('/user/delete',{params:{"id":row.id}})
          .then(res=>{
            let data = res.data;
            if(data.code === 200){
              this.$message.success(data.msg);
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
    changeRole(row){
      this.roleFormVisible = true;
      this.roleForm.userId = row.id;

      this.$axios.get('/user/getUserRoleByUserId',{params:{"userId":row.id}})
      .then(res=>{
        let data = res.data;
        console.log(data);
        if(data.code==200){
          this.roleForm.roleId = data.data.map((e)=>{return e.roleId});
        }
      })
      .catch(err=>{this.$message.error("请求失败");
        console.log(err);
      })
      console.log(row)
    },
    cancelRoleForm(){
      this.roleFormVisible = false;
      console.log(this.roleForm.roleId);
    },
    saveRoleForm(){
      console.log(this.roleForm);
      let params = {
        userId:this.roleForm.userId,
        roleId:this.roleForm.roleId
      }
      this.$axios.post('/userRole/update',params)
      .then(res=>{
        console.log(res);
        let data = res.data;
        if(data.code==200){
          this.$message.success("分配权限成功");
        }
      })
      .catch(err=>{this.$message.error("请求失败");
        console.log(err);
      })
      this.roleFormVisible = false;
    }
  },
  mounted(){
    this.getPage();
    this.getPermList();
    this.getRole();
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