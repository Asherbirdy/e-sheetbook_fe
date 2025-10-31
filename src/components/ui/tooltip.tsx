import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react'
import * as React from 'react'

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement | null>
  content: React.ReactNode
  contentProps?: ChakraTooltip.ContentProps
  disabled?: boolean
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props

    if (disabled) return children

    return (
      <ChakraTooltip.Root {...rest}>
        <ChakraTooltip.Trigger
          asChild
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({} as any)}
        >
          {children}
        </ChakraTooltip.Trigger>
        <Portal
          disabled={!portalled}
          container={portalRef}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ChakraTooltip.Positioner {...({} as any)}>
            <ChakraTooltip.Content
              ref={ref}
              {...contentProps}
            >
              {showArrow && (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <ChakraTooltip.Arrow {...({} as any)}>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    )
  },
)
