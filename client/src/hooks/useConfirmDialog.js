import { useState } from 'react'
import { UI_TEXT } from '../utils/constants/ui'
import { showSuccessToast } from '../utils/toast'

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState({})
  const [resolvePromise, setResolvePromise] = useState(null)

  const defaultOptions = {
    type: 'delete',
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    loading: false,
    successMessage: null, // Optional success toast message
  }

  const confirm = (customOptions = {}) => {
    return new Promise((resolve) => {
      setOptions({ ...defaultOptions, ...customOptions })
      setResolvePromise(() => resolve)
      setIsOpen(true)
    })
  }

  const handleConfirm = () => {
    setIsOpen(false)
    if (resolvePromise) {
      resolvePromise(true)
      setResolvePromise(null)

      // Show success toast if provided
      if (options.successMessage) {
        showSuccessToast(options.successMessage)
      }
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    if (resolvePromise) {
      resolvePromise(false)
      setResolvePromise(null)
    }
  }

  // Preset configurations for common use cases
  const presets = {
    deletePost: {
      type: 'delete',
      title: UI_TEXT.dialogs.deletePost.title,
      message: UI_TEXT.dialogs.deletePost.message,
      confirmText: UI_TEXT.dialogs.deletePost.confirmText,
      cancelText: UI_TEXT.dialogs.deletePost.cancelText,
    },
    deletePostFromProfile: {
      type: 'delete',
      title: UI_TEXT.dialogs.deletePostFromProfile.title,
      message: UI_TEXT.dialogs.deletePostFromProfile.message,
      confirmText: UI_TEXT.dialogs.deletePostFromProfile.confirmText,
      cancelText: UI_TEXT.dialogs.deletePostFromProfile.cancelText,
    },
  }

  // Helper methods for common actions
  const confirmDelete = (message) =>
    confirm({
      ...presets.deletePost,
      message,
      successMessage: 'Post deleted successfully!',
    })
  const confirmDeleteFromProfile = (message) =>
    confirm({
      ...presets.deletePostFromProfile,
      message,
      successMessage: 'Post deleted successfully!',
    })

  return {
    // Core functionality
    confirm,
    isOpen,
    options,
    handleConfirm,
    handleCancel,

    // Presets
    presets,
    confirmDelete,
    confirmDeleteFromProfile,

    // Dialog props (spread this into ConfirmDialog component)
    dialogProps: {
      isOpen,
      onClose: handleCancel,
      onConfirm: handleConfirm,
      type: options.type,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      loading: options.loading,
      showOverlay: options.showOverlay,
    },
  }
}
