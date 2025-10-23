import {
  FunctionComponent, ReactElement,
} from 'react'
import {
  Text, Button, Box, useDisclosure,
} from '@chakra-ui/react'
import { DefaultLayout } from '@/layout'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
} from '@/components/ui/dialog'
import { Tooltip } from '@/components/ui/tooltip'

const Home: FunctionComponent = (): ReactElement => {
  const {
    open, onOpen, onClose,
  } = useDisclosure()
  return (
    <DefaultLayout>
      <Box>
        <Tooltip content="This will open a modal">
          <Button onClick={onOpen}>Click this button</Button>
        </Tooltip>

        <DialogRoot
          open={open}
          onOpenChange={(e: { open: boolean }) => e.open ? onOpen() : onClose()}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Example Modal</DialogTitle>
            </DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <Text>
                Here&apos;s a Chakra UI modal. You can close it by
                clicking &quot;Close&quot;
              </Text>
            </DialogBody>

            <DialogFooter>
              <Button
                colorPalette="blue"
                mr={3}
                onClick={onClose}
              >
                Close
              </Button>
              <Button variant="ghost">Secondary Action</Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Box>
    </DefaultLayout>
  )
}

export default Home
