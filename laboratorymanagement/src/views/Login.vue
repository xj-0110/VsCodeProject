<template>
  <div class="login">
    <h1 class="itemTitle">实验室管理系统</h1>
    <!--flex弹性盒子模型，justify-content：主抽 -->
    <div
      class="loginTable"
      style="display: flex; justify-content: center; margin-top: 150px"
    >
      <el-card style="width: 400px; margin-top: -50px">
        <div slot="header" class="clearfix">
          <span>登录</span>
        </div>
        <table>
          <tr>
            <td>学号</td>
            <td>
              <el-input
                v-model="user.number"
                placeholder="请输入学号"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td>密码</td>
            <td>
              <el-input
                type="password"
                v-model="user.password"
                placeholder="请输入密码"
                @keydown.enter.native="doLogin"
              ></el-input>
              <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
            </td>
          </tr>
          <tr>
            <!-- 占两行-->
            <td colspan="2">
              <el-button style="width: 300px" type="primary" @click="doLogin"
                >登录</el-button
              >
            </td>
          </tr>
        </table>
      </el-card>
    </div>
  </div>
</template>
<script>
import axios from "../../axios";
export default {
  data() {
    return {
      url: {
        loginUrl: "login/toLogin",
      },
      user: {
        number: "172208100150",
        password: "123456",
      },
    };
  },
  methods: {
    doLogin() {
      // let _this = this;
      // _this.user.cookie = document.cookie;
      // this.$ajax({
      //   type: "POST",
      //   xhrFields: {
      //     withCredentials: true,
      //   },
      //   url: this.url.loginUrl,
      //   dataType: "json",
      //   contentType: "application/json;charset=UTF-8",
      //   data: JSON.stringify(_this.user),
      //   success: function (result) {
      //     console.log(result.data.user);
      //     alert("成功");
      //   },
      //   error: function (rs) {
      //     alert("失败");
      //   },
      // });
      axios
        .post(this.url.loginUrl, JSON.stringify(this.user))
        .then((response) => {
          console.log(response);
          console.log(this);
          if (response.success) {
            this.$message({
              showClose: true,
              message: response.message,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: response.message,
              type: "warning",
            });
          }
          //前往 主页面
          if (response.data.user.userType == 0) {
            //管理员登入
            this.$router.push({
              name: "Manager-Home",
            });
          } else if (response.data.user.userType == 1) {
            //老师登入
            this.$router.push({
              name: "Teacher-Home",
            });
          } else if (response.data.user.userType == 2) {
            //学生登入
            this.$router.push({
              name: "Student-Home",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          this.$message({
            showClose: true,
            message: "系统异常",
            type: "error",
          });
        });
    },
  },
  // mounted() {
  //   //判断
  //   console.log(document.cookie);
  // },
};
</script>
<style>
body {
  background-image: url("../assets/bg_admin.jpg");
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
}
.itemTitle {
  text-align: center;
  margin-top: 70px;
  letter-spacing: 10px;
  font-family: "隶书";
  font-size: 55px;
  text-shadow: 0px 0px 0px #3c97e2, 1px 1px 0px #3c92e2, 2px 2px 0px #893ce2,
    3px 3px 0px #3cc9e2, 4px 4px 0px #3c76e2, 5px 5px 0px #3ca5e2;
}
.login {
  opacity: 0.8;
}
</style>
