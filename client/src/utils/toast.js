/**
 * Simple toast notification utility
 * Creates temporary success/error messages that auto-dismiss
 */

export const showToast = (message, type = 'success', duration = 3000) => {
  // Remove existing toast if any
  const existingToast = document.getElementById('app-toast')
  if (existingToast) {
    existingToast.remove()
  }

  // Create toast element
  const toast = document.createElement('div')
  toast.id = 'app-toast'
  toast.textContent = message

  // Style based on type
  const baseStyles = `
    position: fixed;
    top: 50%;
    left: 50%;
    padding: 16px 28px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    max-width: 50vw;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
  `

  const typeStyles = {
    success: 'background-color: #10b981;',
    error: 'background-color: #ef4444;',
    info: 'background-color: #3b82f6;',
  }

  toast.style.cssText = baseStyles + (typeStyles[type] || typeStyles.success)

  // Add to DOM
  document.body.appendChild(toast)

  // Slide in animation
  setTimeout(() => {
    toast.style.transform = 'translate(-50%, -50%)'
  }, 10)

  // Auto remove after duration
  setTimeout(() => {
    toast.style.transform = 'translate(-50%, -50%)'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300)
  }, duration)
}

export const showSuccessToast = (message, duration) =>
  showToast(message, 'success', duration)
export const showErrorToast = (message, duration) =>
  showToast(message, 'error', duration)
export const showInfoToast = (message, duration) =>
  showToast(message, 'info', duration)
