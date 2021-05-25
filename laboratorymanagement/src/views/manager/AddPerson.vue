<template>
  <div>
    <ManagerMune ref="manager"></ManagerMune>
    <!-- 信息填写 -->
    <div style="position: absolute; top: 15%; left: 15%">
      <el-form label-width="100px">
        <el-form-item label="账户类型" :required="true">
          <el-select v-model="personDTO.userType" placeholder="请选择">
            <el-option
              v-for="item in userTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编号">
          <el-input
            type="text"
            v-model="personDTO.number"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" :required="true">
          <el-input
            type="text"
            v-model="personDTO.name"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" :required="true">
          <el-select v-model="personDTO.sex" placeholder="请选择">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="personDTO.birthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input
            type="text"
            v-model="personDTO.credentialsNum"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            type="text"
            v-model="personDTO.mobile"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            type="text"
            v-model="personDTO.email"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人">
          <el-input
            type="text"
            v-model="personDTO.emergencyName"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="紧急联系电话">
          <el-input
            type="text"
            v-model="personDTO.emergencyPhone"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input
            type="text"
            v-model="personDTO.address"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="text"
            v-model="personDTO.remark"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPerson">保存</el-button>
        </el-form-item>
      </el-form>
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
        addPersonUrl: "/person/addPersonAndUser",
      },
      user: {},
      personDTO: {
        userType: 2,
        number: "",
        name: "",
        birthday: "",
        sex: 0,
        credentialsNum: "",
        mobile: "",
        email: "",
        emergencyName: "",
        emergencyPhone: "",
        address: "",
        remark: "",
      },
      //性别 数组
      sexOptions: [
        {
          label: "男",
          value: 0,
        },
        {
          label: "女",
          value: 1,
        },
      ],
      //账户类型数组
      userTypeOptions: [
        {
          label: "管理员",
          value: 0,
        },
        {
          label: "老师",
          value: 1,
        },
        {
          label: "学生",
          value: 2,
        },
      ],
    };
  },
  methods: {
    //添加个人
    addPerson() {
      //数据校验
      if (this.checkPersonData()) {
        this.personDTO.operateId = this.user.personId;
        console.log(JSON.stringify(this.personDTO));
        axios
          .post(this.url.addPersonUrl, JSON.stringify(this.personDTO))
          .then((result) => {
            console.log(result);
            if (result.success) {
              this.$message({
                showClose: true,
                message: result.message,
                type: "success",
              });
              //跳转到 人员管理页面
              this.$router.push({
                name: "Manager-Home",
              });
            } else {
              this.$message({
                showClose: true,
                message: result.message,
                type: "warning",
              });
            }
          })
          .catch(function (error) {
            console.log(error);
            this.$message({
              showClose: true,
              message: "新增失败",
              type: "error",
            });
          });
      }
    },
    //信息检验
    checkPersonData() {
      if (this.personDTO.name == "") {
        this.showWarnMessage("姓名必须填写");
        return false;
      }
      if (this.personDTO.number == "") {
        this.showWarnMessage("编号必须填写");
        return false;
      }
      if (this.personDTO.mobile == "") {
        this.showWarnMessage("电话必须填写");
        return false;
      }
      return true;
    },
    //消息提示
    showWarnMessage(message) {
      this.$message({
        message: message,
        type: "warning",
      });
    },
  },
  mounted() {
    // 登入验证
    this.user = this.$refs["manager"].user;
  },
};
</script>