<template>
  <div>
    <!-- 菜单 -->
    <TeacherMune ref="teacher"></TeacherMune>
    <div style="position: absolute; top: 20%; left: 15%">
      <!-- 实验信息删选 -->
      <el-form ref="form" :model="achievementDTO" label-width="80px" style="">
        <el-form-item label="实验课" style="float: left">
          <el-select
            v-model="achievementDTO.id"
            clearable
            placeholder="请选择"
            @change="changeAchievementList"
          >
            <el-option
              v-for="experimentClass in experimentClassList"
              :key="experimentClass.id"
              :label="experimentClass.nameString"
              :value="experimentClass.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-top: 5%">
        <!-- 功能按钮 -->
        <!-- 实验课成果信息表格 -->
        <el-table
          :data="achievementTableData"
          @selection-change="handleSelectionChange"
          border
          style="width: 1070px; margin-top: 2%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column fixed prop="nameString" label="实验名称" width="260">
          </el-table-column>
          <el-table-column prop="personString" label="提交人" width="120">
          </el-table-column>
          <el-table-column label="提交角色" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.userType == 1">老师</span>
              <span v-if="scope.row.userType == 2">学生</span>
            </template>
          </el-table-column>
          <el-table-column label="实验课结束时间" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.endDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提交成果时间" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <!-- 锁定状态 如果用户被锁定后 再保存年限过后会被自动删除 -->
              <el-button
                @click="deleteAchievement(scope.row)"
                type="text"
                size="small"
                >退回</el-button
              >
              <el-button
                @click="toShowAchievementPage(scope.row)"
                type="text"
                size="small"
                >查看</el-button
              >
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
        queryAchievementUrl: "/achievement/queryAchievement", //查询实验成果
        deleteAchievementUrl: "/achievement/delete", //删除实验成果
        queryExperimentAllUrl: "/experiment/queryTeacherExperimentClassAll", //分页查询实验
      },
      user: {},
      //所有的实验成果集合
      achievementList: [],
      //满足条件的实验成果集合
      achievementTableData: [],
      //成果筛选对象
      achievementDTO: {},
      //分页对象
      pagination: {
        size: 10, //页面大小
        number: 1, //第几面
        total: 0, //数据总数
      },
      //可选实验
      experimentClassList: [],
      //已选实验课 id
      experimentClassId: "",
    };
  },
  methods: {
    //查询 所有实验
    queryExperimentAll() {
      let experimentDTO = {};
      experimentDTO.personId = this.user.personId;
      axios
        .post(this.url.queryExperimentAllUrl, JSON.stringify(experimentDTO))
        .then((result) => {
          console.log(result);
          this.experimentClassList = result.rows;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //获取与老师有关 所有的实验报告
    queryAchievement() {
      let achievementDTO = {};
      achievementDTO.operateId = this.user.personId;
      axios
        .post(this.url.queryAchievementUrl, JSON.stringify(achievementDTO))
        .then((result) => {
          console.log(result);
          this.achievementList = result.rows;
          this.pagination.total = result.total;
          //初始为全部 实验成果
          this.achievementTableData = this.achievementList;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //当实验课选择 改变时
    changeAchievementList() {
      // console.log(this.achievementDTO.id);
      console.log(this.achievementList);
      //清除数据
      this.achievementTableData = [];
      //循环 所有的成果数据
      for (let i = 0; i < this.achievementList.length; i++) {
        //找到满足实验课的实验成果
        // console.log(
        //   this.achievementList[i].experimentClassId +
        //     "  " +
        //     this.achievementDTO.id
        // );
        if (
          this.achievementDTO.id != "" &&
          this.achievementList[i].experimentClassId == this.achievementDTO.id
        ) {
          //给数据赋值
          this.achievementTableData.unshift(this.achievementList[i]);
        }
      }
    },
    //删除 实验报告
    deleteAchievement(row) {
      axios
        .post(this.url.deleteAchievementUrl, JSON.stringify(row))
        .then((result) => {
          console.log(result);
          this.$message({
            showClose: true,
            message: "实验报告退回成功!",
            type: "success",
          });
        })
        .catch(function (error) {
          console.log(error);
          this.$message({
            showClose: true,
            message: "系统繁忙!",
            type: "error",
          });
        });
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
    toShowAchievementPage(row) {
      this.$router.push({
        name: "Teacher-ShowAchievement",
        params: { achievement: row },
      });
    },
  },
  mounted() {
    this.user = this.$refs["teacher"].user;
    //查询 可选实验
    this.queryExperimentAll();
    //查询所有实验报告
    this.queryAchievement();
  },
};
</script>

<style scoped>
</style>