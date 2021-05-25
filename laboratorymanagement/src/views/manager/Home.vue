<template>
  <div>
    <!-- 公共模块 -->
    <ManagerMune ref="manager"></ManagerMune>
    <!-- 用户管理 -->
    <div style="position: absolute; top: 15%; left: 15%">
      <!-- 用户信息删选 -->
      <el-form ref="form" :model="personDTO" label-width="80px" style="">
        <el-button
          @click="queryPerson"
          icon="el-icon-search"
          circle
          style="float: left"
        ></el-button>
        <el-form-item label="学号" style="float: left">
          <el-input
            v-model="personDTO.number"
            size="small"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" style="float: left">
          <el-input
            v-model="personDTO.name"
            size="small"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位" style="float: left">
          <el-select
            v-model="personDTO.userType"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="position in positionList"
              :key="position.value"
              :label="position.label"
              :value="position.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态" style="float: left">
          <el-select v-model="personDTO.status" clearable placeholder="请选择">
            <el-option
              v-for="status in statusList"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-top: 5%">
        <!-- 功能按钮 -->
        <div>
          <!-- <el-button round @click="lockPersonList">批量锁定</el-button> -->
          <el-button round @click="toAddPersonPage">新增用户</el-button>
        </div>

        <!-- 用户信息表格 -->
        <el-table
          :data="personTableData"
          @selection-change="handleSelectionChange"
          border
          style="width: 1000px; margin-top: 2%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column fixed prop="number" label="学号" width="150">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column label="职位" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.userType == 0">管理员 </span>
              <span v-if="scope.row.userType == 1">老师 </span>
              <span v-if="scope.row.userType == 2">学生 </span>
            </template>
          </el-table-column>
          <el-table-column label="学校" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.schoolId == 0">未知 </span>
              <span v-if="scope.row.schoolId == 1">江汉大学 </span>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号码" width="150">
          </el-table-column>
          <el-table-column label="账号状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">正常 </span>
              <span v-if="scope.row.status == 1">锁定 </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <!-- 锁定状态 如果用户被锁定后 再保存年限过后会被自动删除 -->
              <el-button
                v-if="scope.row.status == 0"
                @click="lockPerson(scope.row)"
                type="text"
                size="small"
                >锁定</el-button
              >
              <el-button
                v-if="scope.row.status == 1"
                @click="unlockPerson(scope.row)"
                type="text"
                size="small"
                >解锁</el-button
              >
              <!-- <el-button @click="showPerson(scope.row)" type="text" size="small"
                >查看</el-button
              > -->
              <el-button @click="editPerson(scope.row)" type="text" size="small"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.pagination.number"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total,slot, sizes, prev, pager, next, jumper"
            :total="this.pagination.total"
          >
            <span style=""
              >显示{{
                (this.pagination.number - 1) * this.pagination.size + 1
              }}到{{
                this.pagination.number * this.pagination.size
              }}条信息</span
            >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ManagerMune from "../../components/Mune";
import axios from "../../../axios";
export default {
  components: {
    ManagerMune,
  },
  data() {
    return {
      url: {
        queryPersonUrl: "/person/query", //分页查询个人信息
        lockUserUrl: "/person/updateUser",
        // exitLoginUrl: "/api/login/loginOut", //退出登入
        // editPasswordUrl: "/login/editPassword", //修改密码
        // checkIdentityUrl: "/api/login/toLogin", //验证登入
      },
      //登入用户
      user: {
        number: "",
        password: "",
      },
      //筛选用户数据
      personDTO: {
        number: "", //学号
        name: "", //姓名
        userType: "", //职位
        status: "", //账号状态
      },
      //选择框 职位
      positionList: [
        {
          value: "2",
          label: "学生",
        },
        {
          value: "1",
          label: "老师",
        },
        {
          value: "0",
          label: "管理员",
        },
      ],
      statusList: [
        {
          value: "1",
          label: "锁定",
        },
        {
          value: "0",
          label: "正常",
        },
      ],
      //用户表 数据集合
      personTableData: [],
      //被选择的用户集合
      multipleSelection: [],
      //分页对象
      pagination: {
        size: 10, //页面大小
        number: 1, //第几面
        total: 0, //数据总数
      },
    };
  },
  methods: {
    //身份验证
    checkIdentity() {
      let _this = this;
      this.$ajax({
        async: false, //同步  验证时需等待
        type: "POST",
        url: this.url.checkIdentityUrl,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(_this.user),
        success: function (result) {
          if (!result.success) {
            //跳转到 登入页面
            _this.toLoginPage();
          }
        },
        error: function (rs) {
          //跳转到 登入页面
          _this.toLoginPage();
        },
      });
    },
    //筛选用户
    queryPerson() {
      this.personDTO.length = this.pagination.size;
      this.personDTO.start =
        (this.pagination.number - 1) * this.pagination.size;
      this.personDTO.operateId = this.user.personId;
      console.log(this.personDTO);
      axios
        .post(this.url.queryPersonUrl, JSON.stringify(this.personDTO))
        .then((result) => {
          console.log(result);
          this.personTableData = result.rows;
          this.pagination.total = result.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //锁定用户
    lockPerson(row) {
      var user = {};
      user.id = row.userId;
      user.status = 1;
      axios
        .post(this.url.lockUserUrl, JSON.stringify(user))
        .then((result) => {
          this.showMessage("success", "用户账号已被锁定");
          this.queryPerson();
        })
        .catch(function (error) {
          this.showMessage("error", error.message);
        });
    },
    //取消锁定账号
    unlockPerson(row) {
      var user = {};
      user.id = row.userId;
      user.status = 0;
      axios
        .post(this.url.lockUserUrl, JSON.stringify(user))
        .then((result) => {
          this.showMessage("success", "用户账号已取消锁定");
          this.queryPerson();
        })
        .catch(function (error) {
          this.showMessage("error", error.message);
        });
    },
    //批量锁定
    lockPersonList() {
      console.log(this.multipleSelection);
    },
    //消息提示
    showMessage(type, message) {
      if (type == "error") {
        this.$message.error(message);
      } else if ((type = "usual")) {
        this.$message(message);
      } else {
        this.$message({
          message: message,
          type: type,
        });
      }
    },
    //显示用户详细信息
    showPerson() {
      console.log(row);
    },
    toAddPersonPage() {
      //跳转到 添加用户页面
      this.$router.push({
        name: "Manager-AddPerson",
      });
    },
    //编辑用户
    editPerson(row) {
      console.log(row);
      this.$router.push({
        name: "Manager-EditPerson",
        params: { id: row.id },
      });
    },

    //多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    //分页大小改变
    handleSizeChange(val) {
      this.pagination.size = val;
      console.log("每页" + this.pagination.size + "条");
      console.log("当前页" + this.pagination.number);
    },
    //分页 页数改变
    handleCurrentChange(val) {
      this.pagination.number = val;
      console.log("每页" + this.pagination.size + "条");
      console.log("当前页" + this.pagination.number);
      this.queryPerson();
    },
    //跳转到 登入页面
    toLoginPage() {
      this.$router.push({
        name: "Login",
      });
    },
  },
  mounted() {
    // 登入验证
    this.user = this.$refs["manager"].user;
    // 查询person
    this.queryPerson();
  },
};
</script>
