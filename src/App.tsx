import { ChakraProvider, Heading, Stack, extendTheme, Image, Box, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import MarathonCalculator from './components/MarathonCalculator'

// Create a custom theme with Helvetica and red background, white text
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'red.600',
        color: 'white',
        minHeight: '100vh',
        margin: 0,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }
    }
  },
  fonts: {
    heading: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
})

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [logoAnimated, setLogoAnimated] = useState(false)

  useEffect(() => {
    // Show splash for 1 second, then animate logo
    const timer = setTimeout(() => {
      setLogoAnimated(true)
      setTimeout(() => setShowSplash(false), 600) // allow slide animation to finish
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

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
        pt="10mm"
        pb="10mm"
        bg="red.600"
        color="white"
        position="relative"
        overflow="hidden"
      >
        {/* Splash screen overlay */}
        {showSplash && (
          <Flex
            position="fixed"
            top={0}
            left={0}
            width="100vw"
            height="100vh"
            bg="red.600"
            zIndex={1000}
            align="center"
            justify="center"
            transition="opacity 0.5s"
          >
            <Image
              src="/images/loberencalc.PNG"
              alt="Løberen Calculator Logo"
              width="80vw"
              maxWidth="800px"
              maxHeight="80vh"
              height="auto"
              objectFit="contain"
              style={{ filter: 'drop-shadow(0 0 32px #fff)' }}
              display="block"
              mx="auto"
            />
          </Flex>
        )}
        {/* Animated logo */}
        <Box
          width="100%"
          maxWidth="520px"
          pt="10mm"
          pb="10mm"
          position="relative"
          zIndex={10}
          mx="auto"
          style={{
            transition: 'transform 0.6s cubic-bezier(.77,0,.18,1)',
            transform: showSplash && !logoAnimated
              ? 'translateY(40vh) scale(2)' // start large and centered
              : logoAnimated && showSplash
                ? 'translateY(0) scale(1)' // animate to normal
                : 'translateY(0) scale(1)', // normal
            opacity: showSplash && !logoAnimated ? 1 : 1,
          }}
        >
          <Image
            src="/images/loberencalc.PNG"
            alt="Løberen Calculator Logo"
            width="100%"
            maxWidth="520px"
            height="auto"
            objectFit="contain"
            display="block"
            mx="auto"
          />
        </Box>
        <Stack spacing={4} textAlign="center" width="100vw" maxWidth="100vw">
          <Heading 
            as="h1" 
            size="xl" 
            color="white" 
            fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
          >
            Raceweek Calculator
          </Heading>
        </Stack>
        {/* Only show the calculator after splash is gone */}
        {!showSplash && (
          <Box width="100vw" maxWidth="100vw">
            <MarathonCalculator />
          </Box>
        )}
      </Flex>
    </ChakraProvider>
  )
}

export default App
