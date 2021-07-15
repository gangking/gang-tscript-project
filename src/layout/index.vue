<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px">
        <app-aside />
      </el-aside>
      <el-container>
        <el-header>
          <app-header />
        </el-header>
        <el-main>
          <!-- 子路由出口 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppAside from './components/app-aside.vue'
import AppHeader from './components/app-header.vue'

export default Vue.extend({
  name: 'LayoutIndex',
  components: {
    AppAside,
    AppHeader
  }
})
</script>

<style lang="scss" scoped>
.el-container {
  max-height: 100vh;
  min-width: 980px;
}
.el-aside {
  background: #b3dce6;
}
.el-header {
  background: white;
}
.el-main {
  background: #e9eef3;
  height: calc(100% - 60px);
  box-sizing: border-box;
}
</style>
