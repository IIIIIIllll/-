<template>
<div>
    <!-- 头部 -->
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <!-- 底部 -->
    <div class="container">
        <div class="title">
            <h3>手机号登陆</h3>
            <p>未注册的手机号登陆后将自动注册</p>
        </div>

        <div class="from">
            <div class="form-item">
                <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号" type="text">
            </div>
            <div class="form-item">
                <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入验证码" type="text">
                <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="">
            </div>
            <div class="form-item">
                <input v-model="msgCode" class="inp" placeholder="请输入短信验证码" type="text">
                <button @click="getCode">
                    {{ second === totalSecond ? '获取验证码' : second + '秒后重新发送' }}
                </button>
            </div>
        </div>
        <div @click="login" class="login-btn">登陆</div>
    </div>
</div>
</template>

<script>

import {
    codeLogin,
    getMsgCode,
    getPicCode,
} from '@/api/login'
import {
    Toast
} from 'vant'
export default {
    name: 'LoginIndex',
    data() {
        return {
            picCode: '', // 用户输入的图形验证码 
            picKey: '', // 将来请求传递的图形验证码唯一标识
            picUrl: '', // 存储请求渲染的图片地址
            totalSecond: 60, // 总秒数
            second: 60, // 当前秒数
            timer: null, // 定时器id
            mobile: '', // 手机号
            msgCode:'' // 短信验证码
        }
    },
    async created() {
        this.getPicCode()
    },
    methods: {
        // 获取图形验证码
        async getPicCode () {
        const { data: { base64, key } } = await getPicCode()
        this.picUrl = base64 // 存储地址
        this.picKey = key // 存储唯一标识
        },
        // 校验手机号和图形验证码是否符合
        valiFn() {
            if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
                Toast('请输入正确的手机号')
                return false
            } else if (!/^\w{4}$/.test(this.picCode)) {
                Toast('请输入正确的图形验证码')
                return false
            }
            return true
        },
        // 获取短信验证码
        async getCode() {
            if (!this.valiFn()) {
                // 如果没通过校验则返回
                return
            }
            // 当前无定时器开启，且 totalSecond 和 second 一致
            if (!this.timer && this.second === this.totalSecond) {

                // 发送请求
                const res = await getMsgCode(this.picCode, this.picKey, this.mobile)
                Toast('短信发送成功，注意查收')

                // 开启倒计时
                setTimeout(() => {
                    // 设置定时器
                    this.timer = setInterval(() => {
                        this.second--;

                        if (this.second <= 0) {
                            clearInterval(this.timer);
                            this.timer = null; // 重置定时器id
                            this.second = this.totalSecond; // 归位
                        }
                    }, 1000);
                }, 1000); // 延迟1秒启动定时器，等待短信发送

            }
        },

        // 登陆
        async login () {
          if (!this.valiFn()) {
            return
          }

          else if (/^\d{6}$/.test(this.msg)) {
            Toast('请输入正确的手机验证码')
            return
          }

          console.log('发送登陆请求')

          const res = await codeLogin(this.mobile, this.msgCode)
          this.$store.commit('user/setUserInfo', res.data)
          this.$toast('user/setUserInfo', res.data )
          console.log(res)
          this.$toast('登陆成功')

          //判断地址栏有无回跳地址
          const url = this.$route.query.backUrl || '/'
          this.$router.replace(url)
        }
    },
    // 离开页面清除计时器
    destroyed() {
        clearInterval(this.timer)
    }
}
</script>

<style lang="less" scoped>
.container {
    padding: 49px 49px;
}

.title {
    margin-bottom: 20px;

    h3 {
        font-size: 26px;
    }

    p {
        font-weight: lighter;
    }
}

.form-item {
    display: flex;
    align-items: center;
    // border-bottom: 1px solid;
    padding: 8px;
    margin-bottom: 14px;
}

.inp {
    display: block;
    border: none;
    outline: none;
    height: 32px;
    font-size: 14px;
    flex: 1;
}

.img {
    width: 94px;
    height: 31px;
}

button {
    height: 31px;
    border: none;
    font-size: 13px;
    color: antiquewhite;
    background-color: transparent;
}

.login-btn {
    color: white;
    width: 100%;
    height: 30px;
    margin-top: 39px;
    border-radius: 30px;
    background: linear-gradient(90deg, #ecb53c, #ff9211);
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 1);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
