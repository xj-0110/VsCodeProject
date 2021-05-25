<template>
  <div>
    <ManagerMune></ManagerMune>
    <!-- 信息编辑 -->
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
          <el-button type="primary" @click="editPerson">保存</el-button>
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
        getPersonUrl: "/person/getPerson", //获取个人信息
        editPersonUrl: "/person/update", //编辑个人信息
      },
      personDTO: {
        id: "",
        userType: "",
        number: "",
        name: "",
        birthday: "",
        sex: "",
        credentials_num: "",
        mobile: "",
        email: "",
        emergency_name: "",
        emergency_phone: "",
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
    //查询个人
    getPerson() {
      axios
        .post(this.url.getPersonUrl, { id: this.personDTO.id })
        .then((result) => {
          console.log(result.data.person);
          this.personDTO = result.data.person;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //编辑个人
    editPerson() {
      //数据校验
      if (this.checkPersonData()) {
        console.log(JSON.stringify(this.personDTO));
        axios
          .post(this.url.editPersonUrl, JSON.stringify(this.personDTO))
          .then((result) => {
            this.$message({
              message: "更新成功",
              type: "success",
            });
            this.$router.push({
              name: "Manager-Home",
            });
          })
          .catch(function (error) {
            console.log(error);
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
    //获取传过来的personId
    if (this.$route.params.id == undefined) {
      this.$router.push({
        name: "Manager-Home",
      });
    }
    this.personDTO.id = this.$route.params.id;
    console.log(this.personDTO.id);
    //数据填充
    this.getPerson();
  },
};
</script>