// 此处用于存放所有登陆相关的接口请求
import request from '@/utils/request'
// 获取图形验证码
export const getPicCode = () => {
  return request.get('/captcha/image')
}

// 获取短息验证码
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}

// 登陆接口
export const codeLogin = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      isParty: false,
      partyData: {},
      mobile,
      smsCode
    }
  })
}
