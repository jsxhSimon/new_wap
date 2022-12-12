import { defineStore } from 'pinia'
import { axios } from 'boot/axios'
import { cloneDeep } from 'src/utils/index'
import crypto from 'src/utils/crypto'
import { useUserStore } from './user'

/**
 * userSig 签名过期时间，建议不要设置的过短
 * <p>
 * 时间单位：秒
 * 默认时间：7 x 24 x 60 x 60 = 604800 = 7 天
 */
const EXPIRE_TIME = 604800

interface IMessage {
  msgSeq: string;
  sequence: string;
  type: string;
  ident: string;
  nick: string;
  from: string;
  name: string;
  src: string;
  text: string;
}

interface ITimStore {
  SDKReady: boolean;
  isTimLogin: boolean;
  myProfile: Partial<{nick: string}>;
  isJoin: boolean;
  joinError: boolean;
  groupModel: {
    messageList: IMessage[],
    id: string;
    onlineNum: 0,
  },
}

export const useTimStore = defineStore('tim', {
  state: (): ITimStore => ({
    SDKReady: false,
    isTimLogin: false,
    myProfile: {},
    isJoin: false,
    joinError: false,
    groupModel: {
      messageList: [],
      id: '',
      onlineNum: 0,
    }
  }),
  actions: {
    getUserSig(loginName: string) {
      const params = {
        userid: `${process.env.APP_DEFAULT_SPTVTOKEN}${loginName}`,
        expire: EXPIRE_TIME,
      }
      return axios.get('splive/app/getUserSig', { params })
        .then(res => res.data.userSig)
    },
    async TIMLogin() {
      const userStore = useUserStore()
      const { loginName = '' } = userStore.userInfo
      const userSig = await this.getUserSig(loginName)
      try {
        const promise = window.tim.login({ userID: `${process.env.APP_DEFAULT_SPTVTOKEN}${loginName}`, userSig })
        promise.then(() => {
          this.$patch(state => state.isTimLogin = true)
        }).catch((imError: any) => {
          console.log(imError)
        })
      } catch (e) {
        // console.log('get userSig error:', e)
      }
    },
    TIMLogout() {
      const promise = window.tim.logout()
    },
    updateMyProfile(nick: string) {
      const userStore = useUserStore()
      const promise = window.tim.updateMyProfile({
        nick: nick || userStore.nickNameInfo.nickName || userStore.userInfo.loginName,
      })
      promise.then((imResponse: any) => {
        this.$patch(state => state.myProfile = imResponse.data || {})
      })
    },
    joinGroup(groupID: string) {
      this.clearGroupModel()
      this.$patch(state => {
        state.isJoin = false
        state.joinError = false
        state.groupModel.id = groupID
      })
      const TIM = window.TIM
      const promise = window.tim.joinGroup({ groupID })
      return promise.then((imResponse: any) => {
        switch (imResponse.data.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
            // console.log('等待管理员同意')
            break
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
            // console.log('加群成功', imResponse) // 加入的群组资料
            // dispatch('getOnLineOfChatGroup', groupID)
            this.$patch(state => state.isJoin = true)
            break
          case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
            // console.log('已经在群中', imResponse)
            this.$patch(state => state.isJoin = true)
            break
          default:
            this.$patch(state => state.isJoin = false)
            break
        }
      })
    },
    checkGroup(groupId: string) {
      return axios.post(`splive/app/checkGroup?groupId=${groupId}`)
        .then(({ data }) => data)
    },
    // 获取直播间在线人数
    getOnLineOfChatGroup(groupId: string) {
      axios.get(`splive/app/groupRandomOnline?groupId=${groupId}`)
        .then(({ data }) => {
          this.$patch(state => state.groupModel.onlineNum = data.online || 0)
        })
    },
    sendTopicMsg(params: {content: string; topicName: string;}) { // 领取优惠券
      const url = encodeURI(`content=${params.content}&topicName=${params.topicName}`)
      return axios
        .post(`splive/app/sendMQOfTopic?${url}`)
        .then(({ data }) => data.data)
    },
    // 获取直播间历史数据
    getChatLog(groupId: string) {
      const params = {
        groupId,
        msgSeq: 0,
        pageNo: 1,
        pageSize: 10,
      }
      return axios.post('splive/im/listChatLog', params)
        .then(({ data }) => data.data)
    },
    getSdkAppId() {
      return axios.get('splive/im/getSdkAppId')
        .then(({ data }) => data.imSdkAppID)
    },
    clearGroupModel() {
      this.$patch(state => {
        state.groupModel.id = ''
        state.groupModel.onlineNum = 0
        state.groupModel.messageList = []
      })
    },
    pushMessageList() {
      const setMessageList = (data) => {
        if (data.payload) {
          const payloadText = crypto.Decrypt(data.payload.data)
          const bool = payloadText.includes('deleteBool')
          const curMessageList = cloneDeep(this.groupModel.messageList)
          if (bool) {
            const { deleteBool, msgSeq, fromAccount } = JSON.parse(payloadText)
            const msgBool = !!msgSeq
            if (deleteBool) {
              if (msgBool) {
                const index = curMessageList.findIndex((item: IMessage) => (item.msgSeq ? item.msgSeq === msgSeq : item.sequence === msgSeq))
                curMessageList.splice(index, 1)
                state.groupModel.messageList = curMessageList
              } else {
                const arr = []
                curMessageList.forEach((item) => {
                  if (item.fromAccount !== fromAccount && item.from !== fromAccount) {
                    arr.push(item)
                  }
                })
                state.groupModel.messageList = arr
              }
              return
            }
          }
        }
      }
    },
  },
})

