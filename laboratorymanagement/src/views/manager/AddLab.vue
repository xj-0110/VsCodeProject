<template>
  <div>
    <ManagerMune ref="manager"></ManagerMune>
    <!-- 信息填写 -->
    <div style="position: absolute; top: 15%; left: 15%">
      <el-form label-width="100px">
        <el-form-item label="名称" :required="true">
          <el-input
            type="text"
            v-model="labDTO.name"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="地点" :required="true">
          <el-input
            type="text"
            v-model="labDTO.place"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="text"
            v-model="labDTO.description"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addLab">保存</el-button>
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
        addLabUrl: "/resources/addLab",
      },
      user: {},
      labDTO: {},
    };
  },
  methods: {
    //添加 实验室
    addLab() {
      this.labDTO.operateId = this.user.personId;
      console.log(this.labDTO);
      if (this.checkLabData) {
        axios
          .post(this.url.addLabUrl, JSON.stringify(this.labDTO))
          .then((result) => {
            if (result.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "新增实验室成功",
              });
              this.$router.push({
                name: "Manager-LabManage",
              });
            } else {
              this.$message({
                showClose: true,
                type: "warning",
                message: "新增实验室成功",
              });
            }
          })
          .catch(function (error) {
            this.$message({
              showClose: true,
              type: "error",
              message: "系统繁忙",
            });
          });
      }
    },
    //信息检验
    checkLabData() {
      if (this.labDTO.name == "") {
        this.showWarnMessage("名称必须填写");
        return false;
      }
      if (this.labDTO.place == "") {
        this.showWarnMessage("地点必须填写");
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