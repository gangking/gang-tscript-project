<template>
  <div class="login">
    <h2 class="systemName">Edu Boss管理系统</h2>
    <el-form
      class="login-form"
      ref="ruleForm"
      :rules="rules"
      label-position="top"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          :loading="loading"
          @click="onSubmit"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'

import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771', // 18201288771
        password: '111111' // 111111
      },
      loading: false,
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 18,
            message: '长度 6 - 18 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 1、表单验证
        await (this.$refs.ruleForm as Form).validate()
        // 登录loading
        this.loading = true
        // 2、表单验证通过  -》 提交表单
        const { data } = await login(this.form)
        // const { data } = await request({
        //   method: 'POST',
        //   url: '/front/user/login',
        //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //   data: qs.stringify(this.form) // axios 默认发送 application/json 格式数据
        // })
        // console.log(data)
        // 3、处理请求结果
        // 失败   提示
        if (data.state !== 1) {
          // return window.alert(data.message)
          return this.$message.error(data.message)
        } else {
          // 1、登录成功，记录登录状态，状态需要能够全局访问(放在vuex容器中)
          this.$store.commit('setUser', data.content)
          // 2、访问需要登录的页面的时候判断有没有登录状态(路由拦截器)
          // 成功   跳转首页
          this.$router.push((this.$route.query.redirect as string) || '/')
          // this.$router.push({
          //   name: 'home'
          // })
          this.$message.success('登录成功')
        }
      } catch (error) {
        console.log('登录失败')
      }
      // 结束加载
      this.loading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  // display: flex;
  // justify-content: center;
  // align-content: center;
  .systemName {
    font-weight: normal;
    font-size: 48px;
    color: #696f75;
    text-align: center;
    width: 320px;
    margin: 0 auto;
    margin-top: 30px;
  }
  .login-form {
    // display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    background: white;
    padding: 20px;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
