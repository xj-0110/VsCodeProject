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
          <el-button round @click="toInStock">新增资源</el-button>
          <!-- <el-button round @click="toAddPersonPage"></el-button> -->
        </div>

        <!-- 资源信息表格 -->
        <el-table
          :data="resourcesList"
          @selection-change="handleSelectionChange"
          border
          style="width: 900px; margin-top: 2%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="名称" width="120">
          </el-table-column>
          <el-table-column label="资源类型" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.resourcesType == 0">设备 </span>
              <span v-if="scope.row.resourcesType == 1">药品 </span>
            </template>
          </el-table-column>
          <el-table-column label="图片" width="150">
            <template slot-scope="scope">
              <img :src="scope.row.content" width="50px" height="50px" />
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="资源数量" width="120">
          </el-table-column>
          <el-table-column label="单位" width="150">
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
                <!-- 老师表格 -->
                <el-input
                  v-model="resourcesNum"
                  placeholder="请输入内容"
                ></el-input>
                <el-button round @click="inStock(scope.row)">确定</el-button>
                <el-button slot="reference">入库</el-button>
              </el-popover>
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
        queryResourcesUrl: "/resources/query", //上传图片
        inStockUrl: "/resources/inStock", //入库
      },
      //登入用户
      user: {
        id: "1",
        number: "",
        password: "",
      },
      resourcesList: [],
      //分页对象
      pagination: {
        size: 10, //页面大小
        number: 1, //第几面
        total: 0, //数据总数
      },
      resources: {},
      resourcesNum: "", //数量
    };
  },
  methods: {
    //查询 资源
    query() {
      axios
        .post(this.url.queryResourcesUrl, JSON.stringify(this.resources))
        .then((result) => {
          console.log(result);
          this.resourcesList = result.rows;
          this.pagination.total = result.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //入库
    inStock(row) {
      var stockPaper = {};
      stockPaper.personId = this.user.id;
      stockPaper.num = this.resourcesNum;
      stockPaper.resourcesId = row.id;
      console.log(stockPaper);

      axios
        .post(this.url.inStockUrl, JSON.stringify(stockPaper))
        .then((result) => {
          console.log(result);
          this.resourcesList = result.rows;
          this.pagination.total = result.total;
          //刷新 table
          this.query();
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
    this.query();
  },
};
</script>