import { ChakraProvider, Heading, Stack, extendTheme, Image, Box, Flex } from '@chakra-ui/react'
import MarathonCalculator from './components/MarathonCalculator'

// Create a custom theme with typewriter font
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'black',
        minHeight: '100vh',
        margin: 0,
      }
    }
  },
  fonts: {
    heading: "'Courier Prime', 'Courier New', monospace",
    body: "'Courier Prime', 'Courier New', monospace",
  },
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Flex 
        minH="100vh" 
        direction="column" 
        align="center" 
        justify="flex-start"
        width="100vw"
        maxWidth="100vw"
        px={0}
        py={0}
        pt="10mm"
        pb="10mm"
      >
        <Stack spacing={8} alignItems="center" width="100vw" maxWidth="100vw">
          <Box maxW="250px" width="100%" pt="10mm" pb="10mm">
            <Image
              src="/images/nbro-logo.png"
              alt="NBRO Running Logo"
              width="100%"
              height="auto"
              objectFit="contain"
              maxH="15vh"
              display="block"
              mx="auto"
            />
          </Box>
          <Stack spacing={4} textAlign="center" width="100vw" maxWidth="100vw">
            <Heading 
              as="h1" 
              size="xl" 
              color="black" 
              fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
            >
              Raceweek Calculator
            </Heading>
          </Stack>
          <Box width="100vw" maxWidth="100vw">
            <MarathonCalculator />
          </Box>
        </Stack>
      </Flex>
    </ChakraProvider>
  )
}

export default App
