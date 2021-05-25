<template>
  <div>
    <!-- 公共模块 -->
    <TeacherMune ref="teacher"></TeacherMune>
    <!-- 实验管理 -->
    <div style="position: absolute; top: 20%; left: 15%">
      <!-- 实验信息删选 -->
      <el-form ref="form" :model="experimentDTO" label-width="80px" style="">
        <el-button
          @click="queryExperimentAll"
          icon="el-icon-search"
          circle
          style="float: left"
        ></el-button>
        <el-form-item label="实验编号" style="float: left">
          <el-input
            v-model="experimentDTO.number"
            size="small"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="实验名称" style="float: left">
          <el-input
            v-model="experimentDTO.name"
            size="small"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="实验状态" style="float: left">
          <el-select
            v-model="experimentDTO.status"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="status in statusList"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-top: 5%">
        <!-- 功能按钮 -->

        <!-- 用户信息表格 -->
        <el-table
          :data="experimentTableData"
          @selection-change="handleSelectionChange"
          border
          style="width: 1070px; margin-top: 2%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column fixed prop="number" label="实验编号" width="100">
          </el-table-column>
          <el-table-column prop="name" label="实验名称" width="120">
          </el-table-column>
          <el-table-column prop="labName" label="实验室名称" width="120">
          </el-table-column>
          <!-- <el-table-column label="所属学校" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.schoolId == 0">未知 </span>
              <span v-if="scope.row.schoolId == 1">江汉大学 </span>
            </template>
          </el-table-column> -->
          <el-table-column label="实验申请时间" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实验开始时间" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.startDate }} </span>
            </template>
          </el-table-column>
          <el-table-column label="实验结束时间" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.endDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实验状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">未开始 </span>
              <span v-if="scope.row.status == 1">执行中 </span>
              <span v-if="scope.row.status == 2">已结束 </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.pagination.number"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total,slot, sizes, prev, pager, next, jumper"
            :total="this.pagination.total"
          >
            <span style=""
              >显示{{
                (this.pagination.number - 1) * this.pagination.size + 1
              }}到{{
                this.pagination.number * this.pagination.size
              }}条信息</span
            >
          </el-pagination>
        </div>
      </div>
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
        queryExperimentAllUrl: "/experiment/queryTeacherExperimentClassAll", //分页查询实验
        addExperimentUrl: "/experiment/add", //保存实验
        updateExperimentUrl: "/experiment/update", //更新实验
      },
      //登入用户
      user: {
        number: "",
        password: "",
      },
      //筛选实验数据
      experimentDTO: {
        id: "",
        schoole: "",
        number: "",
        name: "",
        describe: "",
      },
      //状态
      statusList: [
        {
          value: "0",
          label: "未开始",
        },
        {
          value: "1",
          label: "执行中",
        },
        {
          value: "2",
          label: "已结束",
        },
      ],
      //用户表 数据集合
      experimentTableData: [],
      //被选择的集合
      multipleSelection: [],
      //分页对象
      pagination: {
        size: 10, //页面大小
        number: 1, //第几面
        total: 0, //数据总数
      },
    };
  },
  methods: {
    //筛选实验
    queryExperimentAll() {
      this.experimentDTO.personId = this.user.personId;
      axios
        .post(
          this.url.queryExperimentAllUrl,
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
    //消息提示
    showMessage(type, message) {
      if (type == "error") {
        this.$message.error(message);
      } else if ((type = "usual")) {
        this.$message(message);
      } else {
        this.$message({
          message: message,
          type: type,
        });
      }
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
    //跳转到 登入页面
    toLoginPage() {
      this.$router.push({
        name: "Login",
      });
    },
  },
  mounted() {
    // 登入验证
    // this.checkIdentity();
    // 查询person
    console.log(this.$refs["teacher"].user);
    this.user = this.$refs["teacher"].user;
    this.queryExperimentAll();
  },
};
</script>
