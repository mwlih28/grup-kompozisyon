"use client"

import * as React from "react"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

type ToastVariant = "default" | "destructive" | "success"

export interface ToasterToast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
  variant?: ToastVariant
}

type State = { toasts: ToasterToast[] }

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(state: State) {
  memoryState = state
  listeners.forEach((listener) => {
    listener(state)
  })
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ToastInput = Omit<ToasterToast, "id">

function toast(props: ToastInput) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      toasts: memoryState.toasts.map((t) => (t.id === props.id ? props : t)),
    })
  const dismiss = () => dispatch({ toasts: memoryState.toasts.filter((t) => t.id !== id) })

  dispatch({
    toasts: [
      ...memoryState.toasts,
      {
        id,
        ...props,
      },
    ],
  })

  setTimeout(() => dismiss(), 4000)

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      dispatch({
        toasts: toastId
          ? memoryState.toasts.filter((t) => t.id !== toastId)
          : [],
      })
    },
  }
}

export { useToast, toast }

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant }) {
        return (
          <Toast key={id} variant={variant}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
