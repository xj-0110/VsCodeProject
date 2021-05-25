<template>
  <div>
    <!-- 学生菜单 -->
    <student-mune ref="student"></student-mune>
    <!-- 标题 -->
    <div style="position: absolute; top: 10%; left: 15%">
      <h1 style="margin-let: 60%">实验报告</h1>
      <el-select v-model="experimentId" clearable placeholder="请选择实验">
        <el-option
          v-for="item in experimentList"
          :key="item.id"
          :label="item.nameString"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 富文本编辑框 -->
    <div
      v-if="experimentId != ''"
      style="position: absolute; left: 200px; top: 220px"
    >
      <el-card style="height: 500px; width: 1000px">
        <quill-editor
          v-model="content"
          ref="myQuillEditor"
          style="height: 500px"
          :options="editorOption"
        >
        </quill-editor>
      </el-card>
      <div>
        <el-button plain @click="saveAchievement" style="margin-top: 1%"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import StudentMune from "../../components/StudentMune";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import axios from "../../../axios";
export default {
  name: "FuncFormsEdit1",
  components: {
    quillEditor,
    StudentMune,
  },
  data() {
    return {
      url: {
        queryExperimentUrl: "/experiment/queryStudentExperimentClass",
        saveAchievementUrl: "/achievement/add",
      },
      user: {},
      // user: {
      //   id: "2", //人物id
      //   number: "", //编号
      // },
      //可选实验
      experimentList: [],
      //已选实验 id
      experimentId: "",
      content: "",
      editorOption: {},
    };
  },
  methods: {
    //获取实验选择
    queryExperiment() {
      let experimentDTO = {};
      experimentDTO.personId = this.user.personId;
      axios
        .post(this.url.queryExperimentUrl, JSON.stringify(experimentDTO))
        .then((result) => {
          console.log(result);
          this.experimentList = result.rows;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //提交实验报告
    saveAchievement() {
      let achievementDTO = {};
      achievementDTO.experimentClassId = this.experimentId;
      achievementDTO.personId = this.user.personId;
      achievementDTO.content = this.content;
      if (this.content == "") {
        console.log("长度");
      }
      console.log(JSON.stringify(achievementDTO));
      axios
        .post(this.url.saveAchievementUrl, JSON.stringify(achievementDTO))
        .then((result) => {
          console.log(result);
          if (result.success) {
            this.$message({
              message: "上传成功",
              type: "success",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  mounted() {
    this.user = this.$refs["student"].user;
    console.log(this.user);
    //查询 可选实验
    this.queryExperiment();
  },
};
</script>

<style scoped>
</style>