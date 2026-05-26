'use client'

import { useEffect } from 'react'

const EXCLUDED_TAGS = new Set([
  'CODE',
  'INPUT',
  'NOSCRIPT',
  'OPTION',
  'PRE',
  'SCRIPT',
  'STYLE',
  'SVG',
  'TEXTAREA',
])

const SENTENCE_BREAK_PATTERN = /。([」』）)])?(?!\n|$)/g

function formatJapaneseSentenceBreaks(text: string) {
  return text.replace(SENTENCE_BREAK_PATTERN, (_, closing = '') => `。${closing}\n`)
}

function isEligibleElement(element: HTMLElement | null) {
  if (!element) return false
  if (EXCLUDED_TAGS.has(element.tagName)) return false
  if (element.isContentEditable) return false
  if (element.closest('code, pre, script, style, svg, textarea, input, option, noscript')) return false
  if (element.classList.contains('whitespace-nowrap')) return false
  return true
}

function processTextNode(textNode: Text) {
  const parentElement = textNode.parentElement
  if (!parentElement) return
  if (!isEligibleElement(parentElement)) return

  const originalText = textNode.textContent
  if (!originalText || !originalText.includes('。')) return

  const formattedText = formatJapaneseSentenceBreaks(originalText)
  if (formattedText === originalText) return

  textNode.textContent = formattedText
  parentElement.dataset.jpSentenceBreaks = 'true'
}

function processSubtree(root: Node) {
  const documentRef = root.ownerDocument ?? (root as Document)
  const walker = documentRef.createTreeWalker(root, NodeFilter.SHOW_TEXT)

  let currentNode = walker.nextNode()
  while (currentNode) {
    processTextNode(currentNode as Text)
    currentNode = walker.nextNode()
  }
}

export function AutoJapaneseLineBreaks() {
  useEffect(() => {
    const root = document.body
    processSubtree(root)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          processTextNode(mutation.target as Text)
          continue
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node as Text)
            return
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            processSubtree(node)
          }
        })
      }
    })

    observer.observe(root, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

  return null
}
