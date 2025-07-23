import { UI_TEXT } from './constants/ui'

export const getLoadingConfig = (type, customOptions = {}) => {
  const configs = {
    [UI_TEXT.loadingTypes.COMPONENT]: {
      message: UI_TEXT.loading.component,
      showProgress: false,
      showHeader: false,
      showTips: false,
      skeletonCount: 1,
      containerClass: 'py-4'
    },

    [UI_TEXT.loadingTypes.SEARCH]: {
      message: UI_TEXT.loading.search,
      showProgress: true,
      showHeader: false,
      showTips: false,
      skeletonCount: 4,
      containerClass: 'py-4'
    },

    [UI_TEXT.loadingTypes.MINIMAL]: {
      message: '',
      showProgress: false,
      showHeader: false,
      showTips: false,
      skeletonCount: 3,
      containerClass: ''
    },

    [UI_TEXT.loadingTypes.FULL]: {
      message: UI_TEXT.loading.posts,
      showProgress: true,
      showHeader: true,
      showTips: true,
      skeletonCount: 3,
      containerClass: 'min-h-screen py-8'
    },

    [UI_TEXT.loadingTypes.DATA]: {
      message: UI_TEXT.loading.posts,
      showProgress: true,
      showHeader: true,
      showTips: false,
      skeletonCount: 3,
      containerClass: 'py-4'
    }
  }

  const defaultConfig = configs[UI_TEXT.loadingTypes.DATA]
  const typeConfig = configs[type] || defaultConfig

  // Filter out undefined values from customOptions to prevent overriding defaults
  const filteredOptions = Object.entries(customOptions).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value
    }
    return acc
  }, {})

  return {
    ...typeConfig,
    ...filteredOptions
  }
}