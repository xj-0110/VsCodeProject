<template>
  <div>
    <!-- 学生菜单 -->
    <student-mune></student-mune>
    <!-- 默认初始页面为 查看已选择的实验 -->
    <div style="position: absolute; top: 15%; left: 15%">
      <el-table
        :data="experimentTableData"
        border
        style="width: 1100; margin-top: 2%"
      >
        <el-table-column fixed prop="number" label="实验编号" width="150">
        </el-table-column>
        <el-table-column prop="name" label="实验名称" width="120">
        </el-table-column>
        <!-- <el-table-column prop="time" label="时间" width="120">
        </el-table-column> -->
        <el-table-column prop="place" label="实验地点" width="120">
        </el-table-column>
        <el-table-column prop="selectNum" label="已选人数" width="120">
        </el-table-column>
        <el-table-column prop="haveNum" label="可选人数" width="120">
        </el-table-column>
        <el-table-column prop="teacher" label="实验老师" width="150">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scopeLab">
            <el-popover
              placement="bottom"
              title="老师"
              width="500"
              trigger="click"
            >
              <!-- <p>{{ scopeLab.row.teacherVOList }}</p> -->
              <!-- 老师表格 -->
              <el-table :data="scopeLab.row.teacherVOList">
                <el-table-column
                  width="100"
                  property="number"
                  label="编号"
                ></el-table-column>
                <el-table-column
                  width="100"
                  property="name"
                  label="姓名"
                ></el-table-column>
                <el-table-column
                  width="200"
                  property="remake"
                  label="备注"
                ></el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" width="100">
                  <template slot-scope="scopeTeacher">
                    <el-button
                      @click="selectLabTeacher(scopeLab.row, scopeTeacher.row)"
                      type="text"
                      size="small"
                    >
                      选择
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button slot="reference">选择实验老师</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 目前选的实验 -->
    <div
      v-if="selectLabList.length != 0"
      style="position: absolute; top: 90%; left: 15%"
    >
      <span style="color: white">已选择实验</span>
      <!-- 已选实验table -->
      <el-table :data="selectLabList">
        <el-table-column
          width="100"
          property="lab.number"
          label="实验标号"
        ></el-table-column>
        <el-table-column
          width="100"
          property="lab.name"
          label="实验名称"
        ></el-table-column>
        <el-table-column
          width="200"
          property="teacher.name"
          label="老师"
        ></el-table-column>
      </el-table>
      <el-button round @click="saveSelectLabList">提交</el-button>
    </div>
  </div>
</template>
<script>
import StudentMune from "../../components/StudentMune";
import axios from "../../../axios";
export default {
  components: {
    StudentMune,
  },
  data() {
    return {
      url: {
        queryExperimentUrl: "/experiment/query", //分页查询实验
        saveSelectLabListUrl: "/experiment/selectExperiment", //保存选课
      },
      //用户信息
      user: {
        number: "172208100149",
        password: "172208100149",
      },
      //分页数据
      pagination: {},
      //筛选实验数据
      experimentDTO: {
        id: "",
        schoole: "",
        number: "",
        name: "",
        describe: "",
      },
      //labDTO
      labDTO: {
        lab: {}, //实验
        teacher: {}, //教师
      },
      lab: {},
      //实验 数据集合
      experimentTableData: [],
      //老师table数据
      teacherData: [],
      //选择的实验
      selectLabList: [],
    };
  },
  methods: {
    //筛选实验
    queryExperiment() {
      axios
        .post(this.url.queryExperimentUrl, JSON.stringify(this.experimentDTO))
        .then((result) => {
          console.log(result);
          this.experimentTableData = result.rows;
          this.pagination.total = result.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //选择实验与教师
    selectLabTeacher(labRow, teacherRow) {
      if (this.isSelectLabList(labRow)) {
        console.log("修改");
        //赋值
        for (let labDTO of this.selectLabList) {
          if (labRow.id == labDTO.lab.id) {
            labDTO.teacher = teacherRow;
          }
        }
      } else {
        //参数处理
        var obj = {};
        obj.lab = labRow;
        obj.teacher = teacherRow;
        this.selectLabList.unshift(obj);
      }
      console.log(this.labDTO);
    },
    //保存选择的实验
    saveSelectLabList() {
      var personExperimentRelList = [];
      for (let item of this.selectLabList) {
        let personExperimentRel = {};
        personExperimentRel.number = this.user.number;
        personExperimentRel.experimentId = item.lab.id; //实验id
        personExperimentRel.teacherId = item.teacher.id; //老师id
        personExperimentRelList.unshift(personExperimentRel);
      }
      console.log(JSON.stringify(personExperimentRelList));
      axios
        .post(
          this.url.saveSelectLabListUrl,
          JSON.stringify(personExperimentRelList)
        )
        .then((result) => {
          console.log(result);
          if (result.success) {
            this.$message({
              message: "选择实验成功",
              type: "success",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //判断 实验是否已经被选择
    isSelectLabList(row) {
      for (let labDTO of this.selectLabList) {
        console.log(labDTO.lab.id + " " + row.id);
        if (labDTO.lab.id == row.id) {
          return true;
        }
      }
      return false;
    },
  },
  mounted() {
    this.queryExperiment();
  },
};
</script>