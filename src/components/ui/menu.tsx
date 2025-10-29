'use client'

import {
  AbsoluteCenter, Menu as ChakraMenu, Portal,
} from '@chakra-ui/react'
import * as React from 'react'
import {
  LuCheck, LuChevronRight,
} from 'react-icons/lu'

interface MenuContentProps extends ChakraMenu.ContentProps {
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement | null>
}

export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  function MenuContent(props, ref) {
    const {
      portalled = true, portalRef, ...rest
    } = props
    return (
      <Portal
        disabled={!portalled}
        container={portalRef}
      >
        <ChakraMenu.Positioner {...({} as any)}>
          <ChakraMenu.Content
            ref={ref}
            {...rest}
          />
        </ChakraMenu.Positioner>
      </Portal>
    )
  },
)

export const MenuArrow = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.ArrowProps
>(function MenuArrow(props, ref) {
  return (
    <ChakraMenu.Arrow
      ref={ref}
      {...props}
      {...({} as any)}
    >
      <ChakraMenu.ArrowTip />
    </ChakraMenu.Arrow>
  )
})

export const MenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.CheckboxItemProps & { children?: React.ReactNode }
>(function MenuCheckboxItem(props, ref) {
  const {
    children, ...rest
  } = props
  return (
    <ChakraMenu.CheckboxItem
      ps="8"
      ref={ref}
      {...rest}
      {...({} as any)}
    >
      <AbsoluteCenter
        axis="horizontal"
        insetStart="4"
        asChild
      >
        <ChakraMenu.ItemIndicator {...({} as any)}>
          <LuCheck />
        </ChakraMenu.ItemIndicator>
      </AbsoluteCenter>
      {children}
    </ChakraMenu.CheckboxItem>
  )
})

export const MenuRadioItem = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.RadioItemProps & { children?: React.ReactNode }
>(function MenuRadioItem(props, ref) {
  const {
    children, ...rest
  } = props
  return (
    <ChakraMenu.RadioItem
      ps="8"
      ref={ref}
      {...rest}
      {...({} as any)}
    >
      <AbsoluteCenter
        axis="horizontal"
        insetStart="4"
        asChild
      >
        <ChakraMenu.ItemIndicator {...({} as any)}>
          <LuCheck />
        </ChakraMenu.ItemIndicator>
      </AbsoluteCenter>
      <ChakraMenu.ItemText {...({} as any)}>{children}</ChakraMenu.ItemText>
    </ChakraMenu.RadioItem>
  )
})

export const MenuItemGroup = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.ItemGroupProps & { title?: React.ReactNode; children?: React.ReactNode }
>(function MenuItemGroup(props, ref) {
  const {
    title, children, ...rest
  } = props
  return (
    <ChakraMenu.ItemGroup
      ref={ref}
      {...rest}
      {...({} as any)}
    >
      {title && (
        <ChakraMenu.ItemGroupLabel
          userSelect="none"
          {...({} as any)}
        >
          {title}
        </ChakraMenu.ItemGroupLabel>
      )}
      {children}
    </ChakraMenu.ItemGroup>
  )
})

export interface MenuTriggerItemProps extends ChakraMenu.ItemProps {
  startIcon?: React.ReactNode
}

export const MenuTriggerItem = React.forwardRef<
  HTMLDivElement,
  MenuTriggerItemProps & { children?: React.ReactNode }
>(function MenuTriggerItem(props, ref) {
  const {
    startIcon, children, ...rest
  } = props
  return (
    <ChakraMenu.TriggerItem
      ref={ref}
      {...rest}
      {...({} as any)}
    >
      {startIcon}
      {children}
      <LuChevronRight />
    </ChakraMenu.TriggerItem>
  )
})

export const MenuRadioItemGroup = ChakraMenu.RadioItemGroup
export const MenuContextTrigger = ChakraMenu.ContextTrigger
export const MenuRoot = ChakraMenu.Root
export const MenuSeparator = ChakraMenu.Separator

export const MenuItem = ChakraMenu.Item
export const MenuItemText = ChakraMenu.ItemText
export const MenuItemCommand = ChakraMenu.ItemCommand
export const MenuTrigger = ChakraMenu.Trigger
