import { useCallback } from "react"

export const useClassNames = () => {
  const classNames = useCallback((...classes) => {
    return classes.filter(Boolean).join(" ")
  }, [])

  return { classNames }
}
