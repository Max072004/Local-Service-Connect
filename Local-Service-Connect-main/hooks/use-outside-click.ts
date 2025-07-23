"use client"

import type React from "react"

import { useEffect } from "react"

export const useOutsideClick = <T extends HTMLElement>(ref: React.RefObject<T>, callback: () => void) => {
  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [ref, callback])
}

