import { useColorModeValue } from '@/components/ui/color-mode'

export const useColorMode = () => {
  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.800')
  const sheetBg = useColorModeValue('gray.50', 'gray.800')
  const sheetHoverBg = useColorModeValue('gray.100', 'gray.700')
  const sheetTextColor = useColorModeValue('gray.700', 'gray.200')

  const palette = {
    bgColor,
    borderColor,
    hoverBg,
    sheetBg,
    sheetHoverBg,
    sheetTextColor,
  }

  const styles = {}
  const colorScheme = {}
  const tokens = {}

  return {
    palette, styles, colorScheme, tokens,
  }
}