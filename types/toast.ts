import type { ReactElement, ReactNode } from 'react'

export type ToastActionElement = ReactElement

export type ToastProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToasterToast = ToastProps & {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ToastActionElement
}

export type ToastActionType = {
  ADD_TOAST: 'ADD_TOAST'
  UPDATE_TOAST: 'UPDATE_TOAST'
  DISMISS_TOAST: 'DISMISS_TOAST'
  REMOVE_TOAST: 'REMOVE_TOAST'
}

export type ToastAction =
  | {
      type: ToastActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ToastActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ToastActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ToastActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

export type ToastState = {
  toasts: ToasterToast[]
}

export type Toast = Omit<ToasterToast, 'id'>
