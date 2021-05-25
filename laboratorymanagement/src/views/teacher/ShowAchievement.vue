<template>
  <div>
    <!-- 菜单 -->
    <TeacherMune ref="teacher"></TeacherMune>
    <!-- 标题 -->
    <div style="position: absolute; top: 10%; left: 15%">
      <h1 style="margin-let: 60%">实验报告</h1>
      <el-select
        v-model="this.achievementDTO.experimentClassId"
        clearable
        placeholder="请选择实验"
        disabled
      >
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
    <el-card
      style="height: 500px; width: 1000px; margin-left: 15%; margin-top: -5%"
    >
      <quill-editor
        v-model="content"
        ref="myQuillEditor"
        style="height: 500px"
        @focus="focus($event)"
        :options="editorOption"
      >
      </quill-editor>
    </el-card>
    <div>
      <el-button
        plain
        @click="toAchievementPage"
        style="margin-left: 17%; margin-top: 1%"
        >退出</el-button
      >
      <el-button
        plain
        @click="deleteAchievement"
        style="margin-left: 17%; margin-top: 1%"
        >删除</el-button
      >
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
        deleteAchievementUrl: "/achievement/delete", //删除实验成果
      },
      user: {},
      //成果信息
      achievementDTO: {},
      //实验课id
      experimentClassId: "",
      //实验课list
      experimentList: [],
      editorOption: {},
      content: "",
    };
  },
  methods: {
    //退出 该实验
    deleteAchievement() {
      axios
        .post(
          this.url.deleteAchievementUrl,
          JSON.stringify(this.achievementDTO)
        )
        .then((result) => {
          console.log(result);
          this.$message({
            showClose: true,
            message: "实验报告退回成功!",
            type: "success",
          });
          this.toAchievementPage();
        })
        .catch(function (error) {
          this.$message({
            showClose: true,
            message: "系统繁忙!",
            type: "error",
          });
        });
    },
    //获取焦点事件
    focus(event) {
      event.enable(false); //设置富文本编辑器不可编辑
    },
    //退出 去成果管理页面
    toAchievementPage() {
      this.$router.push({
        name: "Teacher-AchievementManage",
      });
    },
  },
  mounted() {
    this.user = this.$refs["teacher"].user;
    //获取成果信息
    this.achievementDTO = this.$route.params.achievement;
    // console.log(this.achievementDTO);
    //设置 实验课数据
    let experimentClass = {};
    experimentClass.id = this.achievementDTO.experimentClassId;
    experimentClass.nameString = this.achievementDTO.nameString;
    this.experimentList[0] = experimentClass;
    //设置 成果内容
    this.content = this.achievementDTO.content;
  },
};
</script>

<style scoped>
</style>