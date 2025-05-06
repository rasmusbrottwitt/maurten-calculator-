import { ChakraProvider, Heading, Stack, extendTheme, Image, Box, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import MarathonCalculator from './components/MarathonCalculator'
import { motion, AnimatePresence } from 'framer-motion'

// Create a custom theme with Helvetica and red background, white text
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'red.600',
        color: 'white',
        minHeight: '100vh',
        margin: 0,
        fontFamily: "'Lato', Helvetica, Arial, sans-serif",
      }
    }
  },
  fonts: {
    heading: "Futura, Helvetica, Arial, sans-serif",
    body: "'Lato', Helvetica, Arial, sans-serif",
  },
})

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Show splash for 1 second, then animate logo
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1400)
    return () => clearTimeout(timer)
  }, [])

  // Responsive logo sizes
  const logoSizes = {
    splash: { width: '80vw', maxWidth: 480, minWidth: 180 },
    header: { width: '100%', maxWidth: 340, minWidth: 120 },
  }

  return (
    <ChakraProvider theme={theme}>
      <Flex
        minH="100vh"
        direction="column"
        align="center"
        justify="flex-start"
        width="100vw"
        maxWidth="100vw"
        px={{ base: 0, md: 0 }}
        pt={{ base: 4, md: '10mm' }}
        pb={{ base: 4, md: '10mm' }}
        bg="red.600"
        color="white"
        position="relative"
        overflow="hidden"
      >
        {/* Animated logo splash and header */}
        <AnimatePresence>
          {showSplash && (
            <motion.div
              key="splash"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(220,38,38,1)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.img
                src="/images/loberencalc.PNG"
                alt="Løberen Calculator Logo"
                initial={{ scale: 1, y: 0 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.4, y: -180, transition: { type: 'spring', stiffness: 80, damping: 18 } }}
                style={{
                  width: logoSizes.splash.width,
                  maxWidth: logoSizes.splash.maxWidth,
                  minWidth: logoSizes.splash.minWidth,
                  height: 'auto',
                  filter: 'drop-shadow(0 0 32px #fff)',
                  borderRadius: 24,
                  background: 'rgba(255,255,255,0.01)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Animated logo header after splash */}
        <motion.div
          key="header-logo"
          initial={showSplash ? { scale: 1.5, y: 120, opacity: 0 } : { scale: 1, y: 0, opacity: 1 }}
          animate={showSplash ? { scale: 1.5, y: 120, opacity: 0 } : { scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          style={{
            width: logoSizes.header.width,
            maxWidth: logoSizes.header.maxWidth,
            minWidth: logoSizes.header.minWidth,
            margin: '0 auto',
            paddingTop: 0,
            paddingBottom: 0,
            zIndex: 10,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/images/loberencalc.PNG"
            alt="Løberen Calculator Logo"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }}
          />
        </motion.div>
        <Stack spacing={4} textAlign="center" width="100vw" maxWidth="100vw" px={{ base: 2, md: 0 }}>
          <Heading
            as="h1"
            size="xl"
            color="white"
            fontFamily="Futura, Helvetica, Arial, sans-serif"
            fontWeight="extrabold"
            letterSpacing="tight"
            mt={{ base: 2, md: 4 }}
            mb={{ base: 2, md: 4 }}
          >
            Raceweek Calculator
          </Heading>
        </Stack>
        {/* Only show the calculator after splash is gone */}
        {!showSplash && (
          <Box width="100vw" maxWidth="100vw" px={{ base: 2, md: 0 }}>
            <MarathonCalculator />
          </Box>
        )}
      </Flex>
    </ChakraProvider>
  )
}

export default App
