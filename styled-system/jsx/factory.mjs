import { createElement, forwardRef } from 'react'
import { getDisplayName } from './factory-helper.mjs';
import { css, cx } from '../css/index.mjs';

function createStyledFn(Dynamic) {
  return function styledFn(template) {
    const styles = css.raw(template)

    const StyledComponent = /* @__PURE__ */ forwardRef(function StyledComponent(props, ref) {
      const { as: Element = Dynamic.__base__ || Dynamic, ...elementProps } = props
      
      function classes() {
        return cx(css(Dynamic.__styles__, styles), elementProps.className)
      }

      return createElement(Element, {
          ref,
          ...elementProps,
          className: classes(),
      })
    })

    const name = getDisplayName(Dynamic)
    
    StyledComponent.displayName = `styled.${name}`
    StyledComponent.__styles__ = styles
    StyledComponent.__base__ = Dynamic
    
    return StyledComponent
  }
}

function createJsxFactory() {
  const cache = new Map()

  return new Proxy(createStyledFn, {
    apply(_, __, args) {
      return createStyledFn(...args)
    },
    get(_, el) {
      if (!cache.has(el)) {
        cache.set(el, createStyledFn(el))
      }
      return cache.get(el)
    },
  })
}

export const styled = /* @__PURE__ */ createJsxFactory()
