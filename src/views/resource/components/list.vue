<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
          :inline="true"
          :model="form"
          ref="inlineForm"
          class="demo-form-inline"
        >
          <el-form-item prop="name" label="资源名称">
            <el-input
              v-model="form.name"
              placeholder="资源名称"
            ></el-input> </el-form-item
          ><el-form-item prop="url" label="资源路径">
            <el-input v-model="form.url" placeholder="资源路径"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类">
            <el-select
              clearable
              v-model="form.categoryId"
              placeholder="活动区域"
            >
              <el-option
                v-for="item in resourcesCategories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="loading" type="primary" @click="onSubmit">查询搜索</el-button>
            <el-button :disabled="loading" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="loading" :data="resources" style="width: 100%;margin-bottom:20px;">
        <el-table-column type="index" label="编号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="资源名称"> </el-table-column>
        <el-table-column prop="url" label="资源路径"> </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column prop="createdTime" label="添加时间"> </el-table-column>
        <el-table-column prop="name" label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="loading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'

import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      form: {
        name: '',
        url: '',
        current: 1,
        size: 10,
        categoryId: null
      },
      totalCount: 0,
      resources: [], // 资源列表
      resourcesCategories: [], // 资源分类列表
      loading: false
    }
  },
  created () {
    this.loadResources()
    this.loadResourcesCategories()
  },
  methods: {
    resetForm () {
      (this.$refs.inlineForm as Form).resetFields()
      this.form.current = 1
      this.loadResources()
    },
    async loadResourcesCategories () {
      const { data } = await getResourceCategories()
      console.log(data)
      this.resourcesCategories = data.data
    },
    async loadResources () {
      this.loading = true
      const { data } = await getResourcePages({
        //   查询条件
        ...this.form
      })
      this.loading = false
      //   console.log(data)
      this.resources = data.data.records
      this.totalCount = data.data.total
    },
    onSubmit () {
      //   console.log('submit!')
      //   筛选查询从第一也开始你
      this.form.current = 1
      this.loadResources()
    },
    handleEdit (index: number, row: any) {
      console.log(index, row)
    },
    handleDelete (index: number, row: any) {
      console.log(index, row)
    },
    handleSizeChange (val: number) {
      //   console.log(`每页 ${val} 条`)
      this.form.size = val
      //   每页大小变了默认要去查询第一页的
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (val: number) {
      //   console.log(`当前页: ${val}`)
      // 请求获取对应页码的数据
      this.form.current = val
      this.loadResources()
    }
  }
})
</script>

<style lang="scss" scoped>
.resource-list {
  height: 100%;
  overflow: auto;
}
</style>
