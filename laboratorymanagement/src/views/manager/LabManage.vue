<template>
  <div>
    <!-- 公共模块 -->
    <ManagerMune ref="manager"></ManagerMune>
    <div style="position: absolute; top: 15%; left: 15%">
      <!-- 筛选栏 -->
      <!-- 库存资源的table -->
      <div style="margin-top: 5%">
        <!-- 功能按钮 -->
        <div>
          <el-button round @click="toAddLabPage">新增实验室</el-button>
        </div>
        <!-- 实验室信息表格 -->
        <el-table
          :data="labList"
          @selection-change="handleSelectionChange"
          border
          style="width: 700px; margin-top: 2%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="名称" width="120">
          </el-table-column>
          <el-table-column prop="place" label="地点" width="120">
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">正常</span>
              <span v-if="scope.row.status == 1">锁定</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" width="120">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <!-- 锁定状态 如果用户被锁定后 再保存年限过后会被自动删除 -->
              <el-button
                v-if="scope.row.status == 0"
                @click="lockLab(scope.row)"
                type="text"
                size="small"
                >锁定</el-button
              >
              <el-button
                v-if="scope.row.status == 1"
                @click="unlockLab(scope.row)"
                type="text"
                size="small"
                >解锁</el-button
              >
              <el-button
                @click="toEditLabPage(scope.row)"
                type="text"
                size="small"
                >编辑</el-button
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
import ManagerMune from "../../components/Mune";
import axios from "../../../axios";
export default {
  components: {
    ManagerMune,
  },
  data() {
    return {
      url: {
        queryLabUrl: "/resources/queryLab",
        updateLabUrl: "/resources/updateLab",
      },
      //登入用户
      user: {
        number: "",
        password: "",
      },
      labList: [],
      //分页对象
      pagination: {
        size: 10, //页面大小
        number: 1, //第几面
        total: 0, //数据总数
      },
      labDTO: {},
    };
  },
  methods: {
    //查询 实验室
    query() {
      //设置分页参数
      this.labDTO.length = this.pagination.size;
      this.labDTO.start = (this.pagination.number - 1) * this.pagination.size;
      this.labDTO.operateId = this.user.personId;
      console.log(this.labDTO);
      axios
        .post(this.url.queryLabUrl, JSON.stringify(this.labDTO))
        .then((result) => {
          console.log(result);
          this.labList = result.rows;
          this.pagination.total = result.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //锁定实验室
    lockLab(row) {
      let lab = {};
      lab.id = row.id;
      lab.status = 1;
      axios
        .post(this.url.updateLabUrl, JSON.stringify(lab))
        .then((result) => {
          if (result.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: "锁定实验室成功",
            });
            this.query();
          } else {
            this.$message({
              showClose: true,
              type: "warning",
              message: result.message,
            });
          }
        })
        .catch(function (error) {
          this.$message({
            showClose: true,
            type: "error",
            message: "系统繁忙",
          });
        });
    },
    unlockLab(row) {
      let lab = {};
      lab.id = row.id;
      lab.status = 0;
      axios
        .post(this.url.updateLabUrl, JSON.stringify(lab))
        .then((result) => {
          if (result.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: "解锁实验室成功",
            });
            this.query();
          } else {
            this.$message({
              showClose: true,
              type: "warning",
              message: result.message,
            });
          }
        })
        .catch(function (error) {
          this.$message({
            showClose: true,
            type: "error",
            message: "系统繁忙",
          });
        });
    },
    //去新增实验室页面
    toAddLabPage() {
      this.push({
        name: "Manager-AddLab",
      });
    },
    //去编辑实验室页面
    toEditLabPage(row) {
      this.$router.push({
        name: "Manager-EditLab",
        params: { labId: row.id },
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
    //跳转到新增资源页面
    toInStock() {
      this.$router.push({
        name: "Manager-InStock",
      });
    },
    //跳转到 登入页面
    toLoginPage() {
      this.$router.push({
        name: "Login",
      });
    },
  },
  mounted() {
    // console.log(this.$refs["manager"].user);
    // 登入验证
    this.user = this.$refs["manager"].user;
    this.query();
  },
};
</script>