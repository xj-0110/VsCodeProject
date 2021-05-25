<template>
  <div class="studentMune">
    <!-- 公共菜单模板 -->
    <el-container>
      <!-- 顶部 -->
      <el-header>
        <span> {{ user.name }}！ 欢迎您</span>
        <el-popover
          placement="bottom"
          width="50px"
          trigger="click"
          style="float: right"
        >
          <el-table
            :data="itemTableData"
            :show-header="false"
            @row-click="rowClick"
            style="width: 100%"
          >
            <el-table-column prop="item" width="180"> </el-table-column>
          </el-table>
          <el-button slot="reference">更多操作</el-button>
        </el-popover>
      </el-header>
      <!-- 侧边栏 -->
      <el-aside>
        <el-row class="tac">
          <el-col :span="12">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
            >
              <!-- 学生实验管理 -->
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">实验管理</span>
                </template>
                <!-- 选择 实验下的老师 -->
                <el-menu-item>
                  <span slot="title" index="1-1" @click="toLabManagePage">
                    选择实验
                  </span>
                </el-menu-item>
                <!-- 显示 被启用的设备状态 闲置、使用中、锁定-->
                <el-menu-item>
                  <span slot="title" index="1-2" @click="toShowLabPage">
                    查看实验
                  </span>
                </el-menu-item>
              </el-submenu>

              <!-- 实验室的添加 信息的修改 实验室不能被删除 实验室状态 空闲、使用中、锁定-->
              <el-menu-item index="2">
                <i class="el-icon-house"></i>
                <span slot="title" @click="toAchievementPage">成果提交</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "StudentMune",
  data() {
    return {
      url: {
        exitLoginUrl: "/api/login/loginOut", //退出登入
        editPasswordUrl: "/login/editPassword", //修改密码
        checkIdentityUrl: "/api/login/toLogin", //验证登入
      },
      user: { name: "" },
      itemTableData: [
        { id: "1", item: "修改密码" },
        { id: "2", item: "退出登入" },
      ],
      cookie: "",
    };
  },
  methods: {
    //身份验证
    checkIdentity() {
      let _this = this;
      console.log("****");
      _this.$ajax({
        async: false, //同步  验证时需等待
        type: "POST",
        url: _this.url.checkIdentityUrl,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(_this.user),
        success: function (result) {
          if (!result.success) {
            //跳转到 登入页面
            _this.toLoginPage();
          } else {
            console.log(result);
            _this.user = result.data.user;
            console.log(_this.user);
            // if(result.data.type!=2){
            //   _this.
            // }
          }
          console.log("****");
        },
        error: function (rs) {
          //跳转到 登入页面
          _this.toLoginPage();
        },
      });
    },
    //修改密码或退出
    rowClick(row, column, event) {
      console.log(row, event, column);
      if (row.id == 1) {
        //修改密码
        this.open();
      } else {
        //退出登入
        this.exitLogin();
      }
    },
    //退出登入
    exitLogin() {
      let _this = this;
      let userDTO = {};
      userDTO.number = _this.user.number;
      console.log(JSON.stringify(userDTO));
      this.$ajax({
        async: false, //同步  验证时需等待
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        url: this.url.exitLoginUrl,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success: function (result) {
          alert("成功退出");
        },
        error: function (rs) {},
      });
    },
    open() {
      this.$prompt("请输入密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: "密码格式不正确",
      })
        .then(({ value }) => {
          //修改密码
          this.user.password = value;
          axios
            .post(this.url.editPasswordUrl, JSON.stringify(this.user))
            .then((result) => {
              console.log(result);
            })
            .catch(function (error) {
              console.log(error);
            });
          this.$message({
            type: "success",
            message: "你的密码是: " + value,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 去查看已选择的实验页面
    toShowLabPage() {
      this.$router.push({
        name: "Student-ShowLab",
      });
    },
    //跳转到 登入页面
    toLoginPage() {
      this.$router.push({
        name: "Login",
      });
    },
    //去选择实验页面
    toLabManagePage() {
      this.$router.push({
        name: "Student-Home",
      });
    },
    //提交实验报告页面
    toAchievementPage() {
      this.$router.push({
        name: "Student-Achievement",
      });
    },
  },
  mounted() {
    // 登入验证
    this.checkIdentity();
    // 查询person
    // this.queryPerson();
  },
};
</script>

<style>
body {
  /* background-image: url("../assets/5119s.j"); */
}
.el-row .el-col .el-menu {
  width: 150px;
}
.tac {
  margin-top: 2%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  font-size: 20px;
}
.tr,
.td:hover {
  color: rgb(24, 29, 92);
}
</style>
