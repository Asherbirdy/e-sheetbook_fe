import {
  Field as ChakraField,
  type HTMLChakraProps,
} from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface FieldProps extends HTMLChakraProps<'div'> {
  label?: string
  helperText?: string
  errorText?: string
  invalid?: boolean
  required?: boolean
  children: React.ReactNode
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const {
      label,
      children,
      helperText,
      errorText,
      invalid,
      required,
      ...rest
    } = props
    return (
      <ChakraField.Root
        ref={ref}
        invalid={invalid}
        {...rest}
      >
        {label && (
          <ChakraField.Label>
            {label}
            {required && (
              <ChakraField.RequiredIndicator />
            )}
          </ChakraField.Label>
        )}
        {children}
        {helperText && (
          <ChakraField.HelperText>
            {helperText}
          </ChakraField.HelperText>
        )}
        {errorText && (
          <ChakraField.ErrorText>
            {errorText}
          </ChakraField.ErrorText>
        )}
      </ChakraField.Root>
    )
  },
)
