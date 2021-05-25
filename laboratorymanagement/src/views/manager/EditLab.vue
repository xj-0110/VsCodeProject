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
          <el-button type="primary" @click="updateLab">保存</el-button>
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
        updateLabUrl: "/resources/updateLab",
        queryLabUrl: "/resources/queryLab",
      },
      user: {},
      labDTO: {},
    };
  },
  methods: {
    //添加 实验室
    updateLab() {
      this.labDTO.operateId = this.user.personId;
      console.log(this.labDTO);
      if (this.checkLabData) {
        axios
          .post(this.url.updateLabUrl, JSON.stringify(this.labDTO))
          .then((result) => {
            if (result.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "修改实验室成功",
              });
              this.$router.push({
                name: "Manager-LabManage",
              });
            } else {
              this.$message({
                showClose: true,
                type: "warning",
                message: result.message,
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
    query() {
      let lab = {};
      lab.id = this.$route.params.labId;
      this.labDTO.operateId = this.user.personId;
      axios
        .post(this.url.queryLabUrl, JSON.stringify(lab))
        .then((result) => {
          console.log(result);
          this.labDTO = result.rows[0];
        })
        .catch(function (error) {
          console.log(error);
        });
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
  },
  mounted() {
    // 登入验证
    this.user = this.$refs["manager"].user;
    //查询实验室
    this.query();
  },
};
</script>