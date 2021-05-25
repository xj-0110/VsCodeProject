<template>
  <div>
    <!-- 学生菜单 -->
    <student-mune ref="student"></student-mune>

    <!-- 已选实验table -->
    <div style="position: absolute; top: 15%; left: 15%">
      <div>
        <span>已选择 实验</span>
      </div>
      <el-table
        :data="experimentTableData"
        border
        style="width: 1220; margin-top: 2%"
      >
        <el-table-column fixed prop="experimentNumber" label="实验编号" width="150">
        </el-table-column>
        <el-table-column prop="experimentName" label="实验名称" width="120">
        </el-table-column>
        <el-table-column prop="createTime" label="选择实验的时间" width="240">
        </el-table-column>
        <el-table-column prop="teacherName" label="选择的实验老师" width="150">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import StudentMune from "../../components/StudentMune.vue";
import axios from "../../../axios";
export default {
  components: {
    StudentMune,
  },
  data() {
    return {
      url: {
        queryStudentExperimentUrl: "/experiment/queryStudentExperiment",
      },
      user: {},
      experimentDTO: {},
      pagination: {
        total: 0,
      },
      // 选择的实验 table
      experimentTableData: [],
    };
  },
  methods: {
    queryStudentExperiment() {
      console.log(this.user);
      this.experimentDTO.personId = this.user.personId;
      axios
        .post(
          this.url.queryStudentExperimentUrl,
          JSON.stringify(this.experimentDTO)
        )
        .then((result) => {
          console.log(result);
          this.experimentTableData = result.rows;
          this.pagination.total = result.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  mounted() {
    console.log(this.$refs["student"].user);
    this.user = this.$refs["student"].user;
    this.queryStudentExperiment();
  },
};
</script>StudentMune