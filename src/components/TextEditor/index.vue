<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'

import { uploadCourseImage } from '@/services/course'

export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  // 组件已经渲染好，可以初始化操作 DOM 了
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor as any)
      // 注意：事件监听必须在 create 之前
      editor.config.onchange = (value: string) => {
        this.$emit('input', value)
      }

      // 上传本地图片
      editor.config.customUploadImg = async function (
        resultFiles: any,
        insertImgFn: any
      ) {
        console.log(resultFiles, insertImgFn)
        // 1、上传图片到服务器
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        // 上传图片，返回结果，将图片插入到编辑器中
        insertImgFn(data.data.name)
      }

      editor.create()

      // 注意：设置初始化必须在 create 之后
      console.log('富文本框内容', this.value)
      editor.txt.html(this.value)
    }
  }
})
</script>

<style lang="scss" scoped></style>
