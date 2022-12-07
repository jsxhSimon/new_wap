import {
  Loading,
  QSpinnerDots,
  Notify,
} from 'quasar'

Loading.setDefaults({
  spinnerSize: 40,
  spinner: QSpinnerDots,
})

Notify.setDefaults({
  timeout: 2000,
  position: 'center',
  classes: 'text-center',
})
