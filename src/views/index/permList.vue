<template>
  <div>
    <!-- 操作按钮 -->
    <el-form inline>
      <el-form-item>
        <el-input v-model="permName" placeholder="权限名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPage" icon="el-icon-search" style="padding-left:10px">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="showAddPerm" icon="el-icon-plus" v-if="permList.indexOf('perm:add')!==-1">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 权限表 -->
    <el-table :data="tableData" border max-height="600px">
      <el-table-column fixed prop="id" label="序号"></el-table-column>
      <el-table-column prop="permName" label="权限名"></el-table-column>
      <el-table-column prop="permType" label="权限类型"></el-table-column>
      <el-table-column prop="permKey" label="权限编码"></el-table-column>
      <el-table-column prop="permUrl" label="权限路径"></el-table-column>
      <el-table-column prop="parentId" label="父级菜单id"></el-table-column>
      <el-table-column fixed="right" label="操作" style="text-align:center;line-height: 100%;">
        <template slot-scope="scope">
            <el-button
              type="text"
              size="median"
              @click="showModifyForm(scope.row)"
              style="margin-right: 20px;"
              v-if="permList.indexOf('perm:update') !== -1">
              修改
            </el-button>
          <el-button
            type="text"
            size="median"
            @click="deleteData(scope.row)"
            v-if="permList.indexOf('perm:delete') !== -1"
            >删除</el-button
          >
          <!-- <el-divider></el-divider> -->
          <!-- <el-switch
            style="display: block"
            v-model="scope.row.stateCode"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="关闭"
            inactive-text="开启"
            @click="stateChange(scope.row.stateCode,row)">
          </el-switch> -->
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

    <!-- 添加权限列表 -->
    <el-dialog title="添加用户信息" :visible.sync="addPermFormVisible">
        <el-form :model="addPerm">
          <el-form-item label="权限名" :label-width="formLabelWidth">
            <el-input v-model="addPerm.permName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限类型" :label-width="formLabelWidth">
            <el-input v-model="addPerm.permType" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限编码" :label-width="formLabelWidth">
              <el-input v-model="addPerm.permKey" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限路径名" :label-width="formLabelWidth">
              <el-input v-model="addPerm.permUrl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item  label="父级菜单id" :label-width="formLabelWidth">
            <el-input v-model="addPerm.parentId" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddPerm">取 消</el-button>
          <el-button type="primary" @click="savePerm">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 修改权限表 -->
    <el-dialog title="修改权限" :visible.sync="updatePermFormVisible">
      <el-form :model="updatePerm">
        <el-form-item label="权限ID" :label-width="formLabelWidth">
          <el-input
            v-model="updatePerm.id"
            autocomplete="off"
            disabled
          ></el-input>
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
        <el-form-item label="权限路径名" :label-width="formLabelWidth">
            <el-input v-model="updatePerm.permUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="父级菜单id" :label-width="formLabelWidth">
            <el-input v-model="updatePerm.parentId" autocomplete="off"></el-input>
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
import PubSub from "pubsub-js";
export default {
  data() {
    return {
      open:"",//权限是否打开
      tableData: [],//权限表信息
      permList: [],//权限列表
      currentPage: 1,
      pageSize: 5,
      total: 0,
      permName: "",
      addPermFormVisible: false,
      updatePermFormVisible: false,
      operator: "",
      formLabelWidth: "120px",
      addPerm: {
        permName: "",
        permType: "",
        permKey: "",
        permUrl:"",
        parentId:"",
        createBy:""
      },
      updatePerm: {
        permName: "",
        permType: "",
        permKey: "",
        permUrl:"",
        parentId:"",
        createBy:""
      },
      postPerm:{}
    };
  },
  methods: {
    // 分页查找权限
    getPage() {
      let params = {
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
      };

      if (this.permName != "") {
        params.permName = this.permName;
      }

      console.log(params);
      //发送请求
      this.$axios
        .get("/perm/page", { params: params })
        .then((res) => {
          console.log(res);
          let data = res.data;
          if (data.code == 200) {
            this.total = data.data.total;
            this.tableData = data.data.rows;
          }
        })
        .catch((err) => {
          this.$message.error("请求失败");
          console.log(err);
        });
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
    handleAvatarSuccess(res, file) {
      console.log(res);
      console.log(file);
      this.imgUrl = res.data;
      this.addUser.imgUrl = res.data;
    },
    showModifyForm(row) {
      this.updatePermFormVisible = true;
      this.updatePerm = row;
    },
    handleUpdateSuccess(res, file) {
      console.log(res);
      console.log(file);
      this.imgUrl = res.data;
      this.updateUser.imgUrl = res.data;
    },
    cancelUpdateUser() {
      this.updatePermFormVisible = false;
      this.getPage();
    },
    modifyPerm() {
      console.log(this.updatePerm);
      this.updatePerm.operator = this.operator;
      this.postPerm = this.updatePerm;
      this.$axios
        .post("/perm/update", this.postPerm)
        .then((res) => {
          let data = res.data;
          if (data.code === 200) {
            this.$message.success(data.msg);
            PubSub.publish("updatePermList");
            this.postPerm = "";
            this.getPage();
            this.cancelUpdateUser();
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteData(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deletePerm(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    deletePerm(row) {
      this.$axios
        .get("/perm/delete", { params: { id: row.id } })
        .then((res) => {
          let data = res.data;
          if (data.code === 200) {
            this.$message.success(data.msg);
            PubSub.publish("updatePermList");
            this.getPage();
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getPermList() {
      this.$axios
        .get("/user/permList", {
          params: { id: sessionStorage.getItem("userId") },
        })
        .then((res) => {
          this.permList = res.data.data;
          console.log(this.permList);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getUserInfo() {
      let params = {
        userId: sessionStorage.getItem("userId"),
      };

      //发送请求
      this.$axios
        .get("/user/info", { params: params })
        .then((res) => {
          console.log(res);
          let data = res.data;
          if (data.code == 200) {
            this.operator = data.data.username;
            console.log(this.updatePerm);
          }
        })
        .catch((err) => {
          this.$message.error("请求失败");
          console.log(err);
        });
    },
    showAddPerm(){
      this.addPermFormVisible = true;
    },
    cancelAddPerm() {
      this.addPermFormVisible = false;
    },
    savePerm(){
      this.addPerm.createBy = this.operator;
      console.log(this.addPerm)
      this.$axios
        .post("/perm/savePerm",this.addPerm)
        .then((res) => {
          console.log(res);
          let data = res.data;
          if (data.code == 200) {
            this.$message.success("保存成功");
            this.addPermFormVisible = false;
            PubSub.publish("updatePermList");
            this.getPage();
          }
          
        })
        .catch((err) => {
          this.$message.error("请求失败");
          console.log(err);
        });
    },
    // change(stateCode,row){
    //   this.$axios
    //     .post("/perm/changeState", {
    //       stateCode:stateCode,
    //       id:row.id
    //     })
    //     .then((res) => {
    //       console.log(res);
    //       let data = res.data;
    //       if (data.code == 200) {
    //         this.$message.success("状态更新成功");
    //       }
    //     })
    //     .catch((err) => {
    //       this.$message.error("请求失败");
    //       console.log(err);
    //     });
    // }

  },
  mounted() {
    this.getPermList();
    this.getUserInfo();
    this.getPage();
  },
};
</script>
  
<style lang="less" scoped>
.el-divider{
  margin: 10px 0px;
  width: 100%;
}
.block {
  padding: 20px 20px;
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
.el-switch__core {
width: 30px !important;
height: 16px;
}
.el-switch__core::after {
width: 14px;
height: 14px;
margin-top: -1px;
}
.el-switch.is-checked .el-switch__core::after{
margin-left: -15px;
}
</style>