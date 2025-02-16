import cssText from "data-text:~globals.css"
import type { PlasmoCSConfig } from "plasmo"
import { createRoot } from "react-dom/client"

import { LoginForm } from "~components/login-form"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const styleElement = document.createElement("style")

/**
 * Generates a style element with adjusted CSS to work correctly within a Shadow DOM.
 *
 * Tailwind CSS relies on `rem` units, which are based on the root font size (typically defined on the <html>
 * or <body> element). However, in a Shadow DOM (as used by Plasmo), there is no native root element, so the
 * rem values would reference the actual page's root font size—often leading to sizing inconsistencies.
 *
 * To address this, we:
 * 1. Replace the `:root` selector with `:host(plasmo-csui)` to properly scope the styles within the Shadow DOM.
 * 2. Convert all `rem` units to pixel values using a fixed base font size, ensuring consistent styling
 *    regardless of the host page's font size.
 */
export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize

    return `${pixelsValue}px`
  })

  styleElement.textContent = updatedCssText

  return styleElement
}

const CSUIExample = () => {
  const containerBox = () => {
    const container = document.createElement("div")
    const root = createRoot(container)
    root.render(
      <div
        className={`h-[300px] w-full bg-slate-50 text-black dark:bg-slate-900 dark:text-white`}>
        <p className="text-center text-2xl text-red-500">container box</p>
      </div>
    )
    return container
  }

  function injectTailwind() {
    const nameElement = document.getElementById("hero-section-brand-heading")
    if (nameElement) {
      const textGroupParent = nameElement.parentElement
      if (textGroupParent) {
        textGroupParent.insertBefore(containerBox(), textGroupParent.firstChild)
      }
    }
  }

  injectTailwind()

  return (
    <div className="flex w-[400px] flex-col border-2 bg-yellow-50">
      <LoginForm />
    </div>
  )
}

export default CSUIExample
