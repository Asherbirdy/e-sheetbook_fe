import {
  FunctionComponent, ReactElement,
} from 'react'
import { Text } from '@chakra-ui/react'
import { DefaultLayout } from '@/layout'

const NotFound: FunctionComponent = (): ReactElement => {
  return (
    <DefaultLayout>
      <>
        <Text fontSize={'2xl'}>404</Text>
        <Text>Page not found.</Text>
      </>
    </DefaultLayout>
  )
}

export default NotFound
