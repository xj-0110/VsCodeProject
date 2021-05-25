<template>
  <div>
    <!-- 公共模块 -->
    <ManagerMune></ManagerMune>
    <div style="position: absolute; top: 15%; left: 15%">
      <!-- 筛选栏 -->
      <!-- 功能按键栏 -->
      <!-- 库存资源的table -->
      <div style="margin-top: 5%">
        <!-- 功能按钮 -->
        <div>
          <!-- <el-button round @click="toInStock">新增资源</el-button> -->
          <!-- <el-button round @click="toAddPersonPage"></el-button> -->
        </div>

        <!-- 资源信息表格 -->
        <el-table
          :data="stockPaperList"
          @selection-change="handleSelectionChange"
          border
          style="width: 650px; margin-top: 2%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="personName" label="操作人名称" width="120">
          </el-table-column>
          <el-table-column prop="experimentName" label="实验名称" width="120">
          </el-table-column>
          <el-table-column label="单据类型" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 0">入库 </span>
              <span v-if="scope.row.type == 1">出库 </span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="240">
          </el-table-column>
          <!-- <el-table-column prop="experimentName" label="使用时间" width="120">
          </el-table-column> -->
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
        queryStockPaperUrl: "/resources/queryStockPaper",
      },
      //登入用户
      user: {
        id: "",
        number: "",
        password: "",
      },
      stockPaperList: [],
      //分页对象
      pagination: {
        size: 10, //页面大小
        number: 1, //第几面
        total: 0, //数据总数
      },
      stockPaperDTO: {},
    };
  },
  methods: {
    //查询 单据
    query() {
      this.stockPaperDTO.length = this.pagination.size;
      this.stockPaperDTO.start =
        (this.pagination.number - 1) * this.pagination.size;
      axios
        .post(this.url.queryStockPaperUrl, JSON.stringify(this.stockPaperDTO))
        .then((result) => {
          console.log(result);
          this.stockPaperList = result.rows;
          this.pagination.total = result.total;
        })
        .catch(function (error) {
          console.log(error);
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
      this.query();
    },
    //分页 页数改变
    handleCurrentChange(val) {
      this.pagination.number = val;
      console.log("每页" + this.pagination.size + "条");
      console.log("当前页" + this.pagination.number);
      this.query();
    },
    //跳转到 登入页面
    toLoginPage() {
      this.$router.push({
        name: "Login",
      });
    },
  },
  mounted() {
    this.query();
  },
};
</script>