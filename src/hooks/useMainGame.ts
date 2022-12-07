import { SUB_LEVEL_ID } from 'src/assets/gameCategories'
import { Notify } from 'quasar'
import { i18n } from 'boot/i18n'
const { t: lang } = i18n.global

export const useMainGame = () => {
  const handleGameClick = (game: IMainGame) => {
    if (game.id) {
      if (SUB_LEVEL_ID.includes(game.catId)) {
        if (+game.availableWh === 2) Notify.create(lang('该场馆正在维护，请先娱乐其他场馆游戏'))
        else if (game.depotCode === 'OBLI')
      }
    }
  }
}
