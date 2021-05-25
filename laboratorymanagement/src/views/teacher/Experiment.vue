<template>
  <div>
    <!-- 公共模块 -->
    <TeacherMune ref="teacher"></TeacherMune>
    <!-- 基础实验管理 -->
    <div style="position: absolute; top: 20%; left: 15%">
      <!-- 实验信息删选 -->
      <el-form ref="form" :model="experimentDTO" label-width="80px" style="">
        <el-button
          @click="queryExperiment"
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
        <el-form-item label="描述" style="float: left">
          <el-input
            v-model="experimentDTO.description"
            size="small"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-top: 5%">
        <!-- 功能按钮 -->
        <div>
          <el-button
            round
            @click="toAddExperimentPage"
            style="margin-left: -73%"
            >新增实验</el-button
          >
        </div>

        <!-- 用户信息表格 -->
        <el-table
          :data="experimentTableData"
          @selection-change="handleSelectionChange"
          border
          style="width: 1000px; margin-top: 2%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column fixed prop="number" label="编号" width="150">
          </el-table-column>
          <el-table-column prop="name" label="实验名称" width="120">
          </el-table-column>
          <el-table-column prop="description" label="描述" width="200">
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="120">
          </el-table-column>
          <el-table-column label="教授老师" width="160">
            <template slot-scope="scope">
              <!--  -->
              <span v-for="item in scope.row.teacherVOList" :key="item.id"
                >{{ item.name }} <br />
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <!-- 基础实验 可以编辑和删除 -->
              <el-button
                v-if="scope.row.status == 0 && checkIn(scope.row.teacherVOList)"
                @click="issueExperiment(scope.row)"
                type="text"
                size="small"
                >申请实验</el-button
              >
              <el-button
                v-if="scope.row.status == 0"
                @click="editExperiment"
                type="text"
                size="small"
                >编辑</el-button
              >
              <span v-if="scope.row.status != 0">不可编辑</span>
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
        checkIdentityUrl: "/api/login/toLogin", //账号验证url
        queryExperimentUrl: "/experiment/query", //分页查询实验
        addExperimentUrl: "/experiment/add", //保存实验
        updateExperimentUrl: "/experiment/update", //更新实验
        issueExperimentUrl: "/experiment/issueExperiment", // 发布实验
      },
      //登入用户
      user: {},
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
    //身份验证
    checkIdentity() {
      let _this = this;
      this.$ajax({
        async: false, //同步  验证时需等待
        type: "POST",
        url: this.url.checkIdentityUrl,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(_this.user),
        success: function (result) {
          if (!result.success) {
            //跳转到 登入页面
            _this.toLoginPage();
          }
          _this.user = result.data.user;
          console.log(_this.user);
        },
        error: function (rs) {
          //跳转到 登入页面
          _this.toLoginPage();
        },
      });
    },
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
    //发布实验
    issueExperiment(row) {
      var personExperimentRel = {};
      personExperimentRel.experimentId = row.id; //实验id
      personExperimentRel.number = this.user.number;
      console.log(JSON.stringify(personExperimentRel));
      axios
        .post(this.url.issueExperimentUrl, JSON.stringify(personExperimentRel))
        .then((result) => {
          console.log(result);
          this.queryExperiment();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //编辑实验
    editExperiment() {
      axios
        .post(this.url.updateExperimentUrl, JSON.stringify(this.experimentDTO))
        .then((result) => {
          console.log(result);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //判断 是否申请过该实验
    checkIn(list) {
      // console.log(list);
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == this.user.personId) {
          return false;
        }
      }
      return true;
    },

    //去新增实验 页面
    toAddExperimentPage() {
      this.$router.push({
        name: "Teacher-AddExperiment",
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
    this.queryExperiment();
  },
};
</script>
