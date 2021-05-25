<template>
  <div>
    <TeacherMune ref="teacher"></TeacherMune>
    <!-- 信息填写 -->

    <div style="position: absolute; top: 15%; left: 15%">
      <el-form label-width="100px">
        <el-form-item label="选择实验" :required="true">
          <el-select
            v-model="experimentClassResources.experimentId"
            clearable
            placeholder="请选择实验"
          >
            <el-option
              v-for="item in this.experimentList"
              :key="item.experimentId"
              :label="item.experimentName"
              :value="item.experimentId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验日期" :required="true">
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
        </el-form-item>
        <el-form-item label="实验时间" :required="true">
          <div>
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
            </el-time-picker>
            <!-- <el-time-select placeholder="起始时间" v-model="startTime">
            </el-time-select>
            <el-time-select placeholder="结束时间" v-model="endTime">
            </el-time-select> -->
          </div>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            type="text"
            v-model="experimentClassResources.remark"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>

        <!-- 选择 实验地点 -->
        <el-form-item>
          <template>
            <el-popover placement="right" width="580" trigger="click">
              <el-table :data="labTable">
                <el-table-column
                  width="100"
                  property="name"
                  label="名称"
                ></el-table-column>
                <el-table-column
                  width="175"
                  property="place"
                  label="地址"
                ></el-table-column>
                <el-table-column
                  width="175"
                  property="description"
                  label="描述"
                ></el-table-column>

                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click="selectLab(scope.row)"
                      v-if="scope.row.id != experimentClassResources.labId"
                      type="text"
                      size="small"
                      >选择</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <el-button slot="reference" type="primary" @click="queryLab">
                选择实验地点</el-button
              >
            </el-popover>
          </template>
        </el-form-item>
        <!-- 选择 实验资源 -->
        <el-form-item>
          <template>
            <el-popover placement="right" width="850" trigger="click">
              <!-- 资源信息表格 -->
              <el-table
                :data="resourcesList"
                @selection-change="handleSelectionChange"
                border
                style="width: 1040px; margin-top: 2%"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="name" label="民称" width="120">
                </el-table-column>
                <el-table-column label="资源类型" width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.resourcesType == 0">设备 </span>
                    <span v-if="scope.row.resourcesType == 1">药品 </span>、
                  </template>
                </el-table-column>
                <el-table-column label="图片" width="150">
                  <template slot-scope="scope">
                    <img :src="scope.row.content" width="50px" height="50px" />
                  </template>
                </el-table-column>
                <el-table-column prop="amount" label="资源数量" width="120">
                </el-table-column>
                <el-table-column
                  prop="applyAmount"
                  label="申请的资源数量"
                  width="80"
                >
                </el-table-column>
                <el-table-column label="单位" width="50">
                  <template slot-scope="scope">
                    <span v-if="scope.row.unit == 0">个</span>
                    <span v-if="scope.row.unit == 1">g</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="scope">
                    <el-popover
                      placement="bottom"
                      title="数量"
                      width="500"
                      trigger="click"
                    >
                      <el-input
                        v-model="resourcesNum"
                        placeholder="请输入内容"
                      ></el-input>
                      <el-button round @click="outStock(scope.row)"
                        >确定</el-button
                      >
                      <el-button slot="reference">出库</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
              <el-button slot="reference" type="primary">
                选择实验资源</el-button
              >
            </el-popover>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyExperimentResources"
            >提交</el-button
          >
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
        addExperimentUrl: "/experiment/applyLabResouces",
        queryMyExperimentUrl: "/experiment/queryMyExperiment",
        queryLabUrl: "/resources/queryUseAble",
        queryResourcesUrl: "/resources/query",
        outStockUrl: "/resources/outStockTeacher", //出库
      },
      user: {},
      //分页对象
      pagination: {
        size: 10, //页面大小
        number: 1, //第几面
        total: 0, //数据总数
      },
      //可选实验
      experimentList: [],
      //实验室table数据
      labTable: [],
      //资源table表
      resourcesList: [],
      //选择的资源数组
      selectResourcesList: [],
      //选择的实验Id
      experimentId: "",
      resourcesNum: "",

      experimentClassResources: {
        labId: "",
        number: "",
        stockPaperDTOList: [],
        name: "",
        status: "",
        describe: "",
        startTime: "",
        endTime: "",
        remark: "",
      },
      startTime: "",
      endTime: "",
      //选择的时间数组
      timePicker: [],
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
    //查询 我申请过的实验
    queryMyExperiment() {
      var experimentCS = {};
      experimentCS.personId = this.user.personId;
      console.log(experimentCS);
      axios
        .post(this.url.queryMyExperimentUrl, JSON.stringify(experimentCS))
        .then((result) => {
          console.log(result);
          this.experimentList = result.rows;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //查询 可选择的实验室
    queryLab() {
      this.experimentClassResources.startTime =
        this.timePicker[0] + " " + this.startTime + ":00";
      this.experimentClassResources.endTime =
        this.timePicker[1] + " " + this.endTime + ":00";
      console.log(JSON.stringify(this.experimentClassResources));
      axios
        .post(
          this.url.queryLabUrl,
          JSON.stringify(this.experimentClassResources)
        )
        .then((result) => {
          console.log(result);
          this.labTable = result.rows;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //选择实验室
    selectLab(row) {
      this.experimentClassResources.labId = row.id;
      console.log(this.experimentClassResources.labId);
    },
    //入库
    outStock(row) {
      var stockPaper = {};
      stockPaper.personId = this.user.personId;
      stockPaper.num = this.resourcesNum;
      stockPaper.experimentId = this.experimentClassResources.experimentId;
      stockPaper.resourcesId = row.id;
      console.log(stockPaper);
      let temp = 0;
      for (var i = 0; i < this.selectResourcesList.length; i++) {
        if (this.selectResourcesList[i].resourcesId == stockPaper.resourcesId) {
          temp = 1;
          this.selectResourcesList.splice(i, 1);
          this.selectResourcesList.unshift(stockPaper);
        }
      }
      if (temp != 1) {
        this.selectResourcesList.unshift(stockPaper);
      }
      for (var j = 0; j < this.resourcesList.length; j++) {
        for (var k = 0; k < this.selectResourcesList.length; k++) {
          if (
            this.selectResourcesList[k].resourcesId == this.resourcesList[j].id
          ) {
            this.resourcesList[j].applyAmount = this.selectResourcesList[j].num;
          }
        }
      }

      this.experimentClassResources.stockPaperDTOList = this.selectResourcesList;
      console.log(JSON.stringify(this.experimentClassResources));
      // this.outStockBatch();
    },
    //批量申请 资源
    outStockBatch() {
      axios
        .post(
          this.url.outStockUrl,
          JSON.stringify(this.experimentClassResources)
        )
        .then((result) => {
          console.log(result);
          this.resourcesList = result.rows;
          this.pagination.total = result.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //查询 资源
    query() {
      var resources = {};
      axios
        .post(this.url.queryResourcesUrl, JSON.stringify(resources))
        .then((result) => {
          console.log(result);
          this.resourcesList = result.rows;
          this.pagination.total = result.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    endTimeChange() {
      if (this.endTime < this.startTime) {
        this.showWarnMessage("开始时间需小于结束时间");
        this.startTime = "";
        this.endTime = "";
      }
    },
    selectExperimentTime() {
      // 确定时间范围之后触发的函数
      this.experimentClassResources.startTime = this.timePicker[0];
      this.experimentClassResources.endTime = this.timePicker[1];
    },
    //申请实验资源
    applyExperimentResources() {
      //数据校验
      if (this.checkExperimentData()) {
        // console.log(JSON.stringify(this.experimentClassResources));
        // this.experimentClassResources.startTime =
        //   this.timePicker[0] + " " + this.startTime;
        // this.experimentClassResources.endTime =
        //   this.timePicker[1] + " " + this.endTime;
        console.log(JSON.stringify(this.experimentClassResources));
        axios
          .post(
            this.url.addExperimentUrl,
            JSON.stringify(this.experimentClassResources)
          )
          .then((result) => {
            console.log(result);
            if (result.success) {
              this.$message({
                showClose: true,
                message: "成功申请实验资源",
                type: "success",
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
              message: "系统异常",
              type: "error",
            });
          });
      }
    },

    //信息检验
    checkExperimentData() {
      if (this.experimentClassResources.experimentId == "") {
        this.showWarnMessage("实验名称必须填写");
        return false;
      }
      if (this.experimentClassResources.remark == "") {
        this.showWarnMessage("实验备注必须填写");
        return false;
      }
      return true;
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
    this.user = this.$refs["teacher"].user;
    //查询 老师 申请过的实验
    this.queryMyExperiment();
    //查询 可选择的 实验室
    // this.queryLab();
    //查询 资源信息
    this.query();
  },
};
</script>