import {
  AlertTriangle,
  Share,
  Trash2,
  Info,
  CheckCircle,
  X,
} from 'lucide-react'

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default', // delete, share, info, success, warning, default
  loading = false,
  showOverlay = true,
}) => {
  if (!isOpen) return null

  const typeConfig = {
    delete: {
      icon: Trash2,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100',
      confirmBtn: 'btn-error',
      title: title || 'Delete Item',
      message:
        message ||
        'Are you sure you want to delete this item? This action cannot be undone.',
    },
    share: {
      icon: Share,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
      confirmBtn: 'btn-primary',
      title: title || 'Share Item',
      message: message || 'Are you sure you want to share this item?',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
      confirmBtn: 'btn-primary',
      title: title || 'Information',
      message: message || 'Please confirm your action.',
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100',
      confirmBtn: 'btn-success',
      title: title || 'Success',
      message: message || 'Operation completed successfully.',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-100',
      confirmBtn: 'btn-warning',
      title: title || 'Warning',
      message: message || 'Please proceed with caution.',
    },
    default: {
      icon: Info,
      iconColor: 'text-gray-500',
      iconBg: 'bg-gray-100',
      confirmBtn: 'btn-primary',
      title: title || 'Confirm Action',
      message: message || 'Are you sure you want to proceed?',
    },
  }

  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-[2px]'>
      <div className='bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='flex items-start justify-between p-6 pb-4'>
          <div className='flex items-start space-x-4'>
            <div className={`p-3 rounded-full ${config.iconBg} flex-shrink-0`}>
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className='flex-1 pt-1'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                {config.title}
              </h3>
              <p className='text-gray-600 leading-relaxed text-sm'>
                {config.message}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-4'
            disabled={loading}
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Actions */}
        <div className='flex justify-end space-x-3 p-6 pt-4 bg-gray-50 rounded-b-xl'>
          <button
            onClick={onClose}
            className='btn btn-ghost btn-sm hover:bg-gray-200'
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              if (!loading) onClose()
            }}
            className={`btn ${config.confirmBtn} btn-sm`}
            disabled={loading}
          >
            {loading ? (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
