<template>
  <div class="outter">
    <el-card class="card">
      <div>
        <h1>小仓熟管理系统</h1>
      </div>
      <el-form>
        <el-form-item>
          <el-input v-model="username" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" placeholder="请输入密码" show-password prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <el-input v-model="vcode" placeholder="请输入验证码"  class="test" prefix-icon="el-icon-key"></el-input><img :src="vcodeImg" @click="changeImg">
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" @click="login">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'UserLogin',
  components: {
  },
  data(){
    return {
      username:"",
      password:"",
      vcodeImg:"",
      vcode:""
    }
  },
  methods:{
    login(){
      let params = {
        username:this.username,
        password:this.password,
        vcode:this.vcode
      }
      console.log(params);

      this.$axios.post('/user/login',params)
      .then(res =>{
        console.log(res);
        if(res.data.code === 200){
          this.$message.success(res.data.msg);
          sessionStorage.setItem("userId",res.data.data.id);
          sessionStorage.setItem("token",res.data.data.token);
          this.$router.push('/Sys');
        }
        else{
          this.$message.error(res.data.msg);
        }
      })
      .catch(err =>{
        this.$message.error(err.message);
      })
    },
    getVcode() {
        this.$axios.get("/user/vcode").then(result => {
          let data = result.data;
          if (data.code == 200) {
            this.vcodeImg = data.data;
          }
        }).catch(() => {
          this.$message.error('请求失败');
        })
    },
    changeImg(){
      this.getVcode();
    },
  },
  mounted(){
    this.getVcode();
  }
}
</script>

<style lang="less" scoped>
.card{
  width: 30vw;
}
.test{
  width:15vw;
}
img {
  cursor: pointer;
  vertical-align: bottom; 
  padding:0 10px;
  width:10vw;
}
.outter{
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('../assets/img/img1.jpg');
}
h1 {
  text-align: center;
}
</style>
