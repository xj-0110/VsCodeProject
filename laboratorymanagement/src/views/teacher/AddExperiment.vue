<template>
  <div>
    <TeacherMune></TeacherMune>
    <!-- 信息填写 -->
    <div style="position: absolute; top: 15%; left: 15%">
      <el-form label-width="100px">
        <el-form-item label="实验名称" :required="true">
          <el-input
            type="text"
            v-model="experimentDTO.name"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="实验日期" :required="true">
          <div class="block">
            <el-date-picker
              v-model="timePicker"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              @change="selectExperimentTime"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </el-form-item> -->
        <!-- <el-form-item label="实验时间" :required="true"> -->
        <!-- <div>
            <el-time-picker
              v-model="startTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="任意时间点"
            >
            </el-time-picker>
            <el-time-picker
              arrow-control
              v-model="endTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="任意时间点"
              @change="endTimeChange"
            >
            </el-time-picker> -->
        <!-- <el-time-select placeholder="起始时间" v-model="startTime">
            </el-time-select>
            <el-time-select placeholder="结束时间" v-model="endTime">
            </el-time-select> -->
        <!-- </div> -->
        <!-- </el-form-item> -->
        <el-form-item label="描述" :required="true">
          <el-input
            type="text"
            v-model="experimentDTO.describe"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            type="text"
            v-model="experimentDTO.remark"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addExperiment">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import TeacherMune from "../../components/TeacherMune";
import axios from "../../../axios";
export default {
  components: {
    TeacherMune,
  },
  data() {
    return {
      url: {
        addExperimentUrl: "/experiment/add",
      },
      experimentDTO: {
        number: "",
        name: "",
        status: "",
        describe: "",
        // startDate: "",
        // endDate: "",
      },
      startTime: "",
      endTime: "",
      //选择的时间数组
      timePicker: [],
      //状态
      statusList: [
        {
          value: "0",
          label: "待发布",
        },
        {
          value: "1",
          label: "已发布",
        },
        {
          value: "2",
          label: "已失效",
        },
      ],
      //时间选择器 禁用过去时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //禁用以前的日期，今天不禁用
          // return date.getTime() <= Date.now();    //禁用今天以及以前的日期
        },
      },
    };
  },
  methods: {
    endTimeChange() {
      if (this.endTime < this.startTime) {
        this.showWarnMessage("开始时间需小于结束时间");
        this.startTime = "";
        this.endTime = "";
      }
    },
    selectExperimentTime() {
      // 确定时间范围之后触发的函数
      this.experimentDTO.startDate = this.timePicker[0];
      this.experimentDTO.endDate = this.timePicker[1];
    },
    //添加基础实验
    addExperiment() {
      //数据校验
      if (this.checkExperimentData()) {
        // console.log(JSON.stringify(this.experimentDTO));
        // this.experimentDTO.startDate =
        //   this.timePicker[0] + " " + this.startTime;
        // this.experimentDTO.endDate = this.timePicker[1] + " " + this.endTime;
        console.log(JSON.stringify(this.experimentDTO));
        axios
          .post(this.url.addExperimentUrl, JSON.stringify(this.experimentDTO))
          .then((result) => {
            console.log(result);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },

    //信息检验
    checkExperimentData() {
      if (this.experimentDTO.name == "") {
        this.showWarnMessage("实验名称必须填写");
        return false;
      }
      if (this.experimentDTO.describe == "") {
        this.showWarnMessage("实验描述必须填写");
        return false;
      }
      if (this.experimentDTO.remake == "") {
        this.showWarnMessage("实验备注必须填写");
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
};
</script>