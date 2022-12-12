import { SUB_LEVEL_ID } from 'src/assets/gameCategories'
import { Notify, SessionStorage } from 'quasar'
import { i18n } from 'boot/i18n'
import { useSysStore } from 'src/stores/sys'
import { useRouter } from 'vue-router'

const { t: lang } = i18n.global

const useMainGame = () => {
  const sysStore = useSysStore()
  const router = useRouter()
  const handleGameClick = (game: IMainGame) => {
    if (game.id) {
      if (SUB_LEVEL_ID.includes(game.catId)) {
        if (+game.availableWh === 2) Notify.create(lang('该场馆正在维护，请先娱乐其他场馆游戏'))
        else if (game.depotCode === 'OBLI') sysStore.enterGame(game)
        else router.push(`/vide-games/${game.catId === 3 ? game.depotId : game.id}/${game.depotCode}/${game.catId}`)
      } else if (['XM', 'FBOB', 'SBOD'].includes(game.depotCode)) {
        if (+game.availableWh === 2) sysStore.enterGame(game)
        else {
          const temp = game.depotCode === 'FBOB' ? '' : (game.depotCode === 'XM' ? '0,0,0' : '1,0,0')
          SessionStorage.set('matchTabData', temp)
          router.push('/sports')
        }
      } else sysStore.enterGame(game)
    } else Notify.create(lang('游戏数据加载中，请稍后再试'))
  }
  return {
    handleGameClick
  }
}

export default useMainGame