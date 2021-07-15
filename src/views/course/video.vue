<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <div>课程：XXX</div>
        <div>阶段：XXX</div>
        <div>课时：XXX</div>
      </div>
      <el-form label-width="40px">
        <el-form-item label="视频">
          <input ref="video-file" type="file" />
        </el-form-item>
        <el-form-item label="封面">
          <input ref="image-file" type="file" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="authUpload">开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p>视频上传中: {{ uploadPercent }}%</p>
          <p v-show="isUploadSuccess">
            视频转码中：{{
              isTransCodeSuccess ? '完成' : '正在处理，请稍后...'
            }}
          </p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios'
import {
  aliyunImagUploadAddressAdnAuth,
  aliyunVideoUploadAddressAdnAuth,
  transCodeVideo,
  getAliyunTransCodePercent
} from '@/services/aliyun-oss'

export default {
  data () {
    return {
      uploader: null,
      videoId: null,
      imageUrl: '',
      fileName: '',
      uploadPercent: 0,
      isUploadSuccess: false,
      isTransCodeSuccess: false
    }
  },
  computed: {
    video () {
      return this.$refs['video-file']
    },
    image () {
      return this.$refs['image-file']
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    authUpload () {
      this.isUploadSuccess = false
      this.isTransCodeSuccess = false
      this.uploadPercent = 0
      // 获取上传文件
      const videoFile = this.video.files[0]
      const imgFile = this.image.files[0]
      // 将用户所选文件添加到上传列表中
      // 一旦开始上传，就会按照列表中添加顺序开始上传
      this.uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')
      this.uploader.addFile(imgFile, null, null, null, '{"Vod":{}}')
      this.fileName = videoFile.name

      // 开始上传，触发onUploadstarted
      this.uploader.startUpload()
    },
    initUploader () {
      // 初始化上传实例
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
        userId: 1618139964448548,
        // 上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
        region: 'cn-shanghai',
        // 分片大小默认1M，不能小于100K
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          console.log('onUploadstarted', uploadInfo)
          let uploadAuthInfo = null
          // 1、通过我们后端获取文件上传凭证
          // 判断是上传图片还是上传视频
          if (uploadInfo.isImage) {
            // 获取图片上传凭证
            const { data } = await aliyunImagUploadAddressAdnAuth()
            this.imageUrl = data.data.imageURL
            uploadAuthInfo = data.data
          } else {
            // 获取视频上传凭证
            const { data } = await aliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name
            })
            this.videoId = data.data.videoId
            uploadAuthInfo = data.data
          }

          // console.log('uploadAuthInfo', uploadAuthInfo)

          // 2、调用uploader.setUploadAuthAndAddress设置上传凭证
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAuthInfo.uploadAuth,
            uploadAuthInfo.uploadAddress,
            uploadAuthInfo.videoId || uploadAuthInfo.imageId
          )
          // 3、设置好上传凭证确认没有问题，上传进度开始
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
          console.log('onUploadSucceed', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log('onUploadFailed')
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          console.log('onUploadTokenExpired')
        },
        // 全部文件上传结束后，开始转码
        onUploadEnd: async uploadInfo => {
          // console.log(uploadInfo)
          // console.log({
          //   sectionId: this.$route.query.sectionId,
          //   lessonId: this.$route.query.lessonId, // 课时ID
          //   fileId: this.videoId,
          //   coverImageUrl: this.imageUrl,
          //   fileName: this.fileName
          // })
          this.isUploadSuccess = true
          // 请求转码
          const { data } = await transCodeVideo({
            // sectionId: this.$route.query.sectionId,
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageUrl,
            fileName: this.fileName,
            fileId: this.videoId
          })
          console.log(data)

          // 轮询转码进度
          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(
              this.$route.query.lessonId
            )
            console.log('获取转码进度', data)
            if (data.data === 100) {
              this.isTransCodeSuccess = true
              window.clearInterval(timer)
              console.log('转码成功！')
            }
            //  在线网址验证 edufront.lagou.com
          }, 3000)
        }
      })
    }
  }
}
</script>
