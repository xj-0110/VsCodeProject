<template>
  <div>
    <!-- 公共模块 -->
    <ManagerMune></ManagerMune>
    <div style="position: absolute; top: 15%; left: 15%">
      <!-- 筛选栏 -->
      <!-- 功能按键栏 -->
      <!-- 库存资源的table -->
      <el-form label-position="left" label-width="80px" :model="resources">
        <el-form-item label="名称">
          <el-input v-model="resources.name"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            action=""
            :http-request="upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="successUpload"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="resources.resourcesType" placeholder="请选择">
            <el-option
              v-for="item in resourcesTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 保存 -->
      <el-button size="small" type="primary" @click="addResources"
        >保存</el-button
      >
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
        uploadImgUrl: "/resources/upLoadImg", //上传图片
        addResourcesUrl: "resources/addResources", //添加资源
      },
      fileList: [],
      resources: {
        name: "",
        imageId: "",
        resourcesType: "", //资源类型
      },
      //资源类型 数组
      resourcesTypeOptions: [
        {
          label: "设备",
          value: 1,
        },
        {
          label: "药品",
          value: 2,
        },
      ],
      path: "",
    };
  },
  methods: {
    //上传图片
    upload(param) {
      console.log(param);
      const formData = new FormData();
      formData.append("file", param.file);
      axios
        .post(this.url.uploadImgUrl, formData)
        .then((result) => {
          console.log(result);
          this.path = result.data.file.content;
          this.resources.imageId = result.data.file.id;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //添加资源
    addResources() {
      console.log(this.resources);
      axios
        .post(this.url.addResourcesUrl, this.resources)
        .then((result) => {
          console.log(result);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 文件上传成功时的钩子
    successUpload(response, file, fileList) {
      console.log(response, file, fileList);
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 	点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file);
    },
    // 	文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
};
</script>