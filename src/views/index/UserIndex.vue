<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router>
        <h2>权限管理系统</h2>
        <el-submenu :index="menu.permUrl" v-for="(menu) in menuList" :key="menu.id">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span>{{menu.permName}}</span>
          </template>
          <el-menu-item-group v-if="menu.children.length > 0 ">
            <el-menu-item :index="child.permUrl" v-for="(child) in menu.children" :key="child.id">
              {{child.permName}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div></div>
        <div class="rightContent">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#333"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-dropdown @command="logout">
              <span class="el-dropdown-link" >
                {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item > 退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import PubSub from 'pubsub-js';
export default {
  name: 'UserIndex',
  components: {
    
  },
  data(){
    return {
      activeIndex:"1",
      menuList:[],
      username:""
    }
  },
  methods:{
    getMenuByUserId(){
      //从缓存获取userId
      let params = {
        userId:sessionStorage.getItem("userId")
      }

      //发送请求
      this.$axios.get('/user/menu',{params:params})
      .then(res=>{
        console.log(res);
        let data = res.data;
        this.menuList = data.data;
      })
      .catch(err=>{
        this.$message.error("请求失败");
        console.log(err);
      })
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
          this.username = data.data.username;
        }
      })
      .catch(err=>{this.$message.error("请求失败");
        console.log(err);
      })
    },
    logout(){
      sessionStorage.clear();
      this.$router.push('/');
    }
  },
  mounted(){
    this.getMenuByUserId();
    this.getUserInfo();
    PubSub.subscribe("updatePermList",(e)=>{
      console.log(e)
      console.log("updatePermList");
      this.getMenuByUserId();
    })
  }
}
</script>
<style lang="less" scoped>
.el-dropdown{
  color: white;
}
.rightContent{
  padding-right: 30px;
}
.el-container{
  height: 100vh;
  border: 0;
  margin: 0;
  padding: 0;
}
.el-header {
  background-color: #333;
  color: #333;
  text-align: center;
  line-height: 60px;
  border: 0;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
  border-right: 0;

}
h2 {
  font-size: 20px;
  height: 200px;
  margin: 0;
  color: #E9EEF3;
}
.el-menu-vertical-demo {
  height: 100vh;
  margin: 0;
  padding: 0;
  border: 0;
}
.el-main {
  
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
