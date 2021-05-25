<template>
  <div>
    <!-- 菜单 -->
    <TeacherMune ref="teacher"></TeacherMune>
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
    <div v-if="experimentId != ''" style="">
      <el-card
        style="height: 500px; width: 1000px; margin-left: 15%; margin-top: -5%"
      >
        <quill-editor
          v-model="content"
          ref="myQuillEditor"
          style="height: 500px"
          :options="editorOption"
        >
        </quill-editor>
      </el-card>
      <div>
        <el-button
          plain
          @click="saveAchievement"
          style="margin-left: 17%; margin-top: 1%"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import TeacherMune from "../../components/TeacherMune";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import axios from "../../../axios";
export default {
  name: "FuncFormsEdit",
  components: {
    quillEditor,
    TeacherMune,
  },
  data() {
    return {
      url: {
        queryExperimentUrl: "/experiment/queryTeacherExperimentClass",
        saveAchievementUrl: "/achievement/add",
      },
      user: {},
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
      experimentDTO.isAll = 0; //查询未提交实验报告的实验课
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
    this.user = this.$refs["teacher"].user;
    //查询 可选实验
    this.queryExperiment();
  },
};
</script>

<style scoped>
</style>