import { useState, ChangeEvent } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  Divider,
  NumberInput,
  NumberInputField,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  List,
  ListItem,
  ListIcon,
  Flex,
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

interface CalculationResult {
  totalGels: number
  regularGels: number
  caffeineGels: number
  timeline: string[]
  hydrationPerHour: number
  carbLoading: {
    dailyCarbs: number
    dailyCalories: number
    breakfastCarbs: number
    breakfastCalories: number
  }
}

// Weather forecast for Copenhagen, Sunday May 11, 2025
const weather = {
  date: 'Sunday, May 11, 2025',
  temperature: 14, // °C
  humidity: 59, // %
  wind: 'ESE 8 mph (13 km/h)',
  conditions: 'Partly cloudy',
  uv: 4,
  sunrise: '5:05 am',
  sunset: '9:07 pm',
};

const MarathonCalculator = () => {
  const [targetTime, setTargetTime] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const calculateGelStrategy = () => {
    setLoading(true)
    setHasSubmitted(true)
    setTimeout(() => {
      if (!targetTime || !weight) {
        alert('Please fill in all fields')
        setLoading(false)
        return
      }
      const [hours, minutes] = targetTime.split(':').map(Number)
      if (isNaN(hours) || isNaN(minutes)) {
        alert('Please enter time in HH:MM format (e.g., 04:00)')
        setLoading(false)
        return
      }
      const totalMinutes = (hours * 60) + minutes
      const tempC = weather.temperature
      const humidityPercent = weather.humidity
      const weightKg = parseFloat(weight)
      if (isNaN(weightKg)) {
        alert('Please enter a valid number for weight')
        setLoading(false)
        return
      }
      const baseGelsPerHour = 2
      const totalHours = totalMinutes / 60
      let gelMultiplier = 1.0
      if (tempC > 20) {
        gelMultiplier += (tempC - 20) * 0.05
      }
      if (humidityPercent > 60) {
        gelMultiplier += (humidityPercent - 60) * 0.005
      }
      const totalGels = Math.max(2, Math.ceil(totalHours * baseGelsPerHour * gelMultiplier))
      const caffeineGels = Math.min(Math.floor(totalHours - 1), Math.floor(totalGels / 3))
      const regularGels = totalGels - caffeineGels
      let baseHydration = weightKg * 4
      baseHydration *= (1 + (tempC > 20 ? (tempC - 20) * 0.05 : 0))
      baseHydration *= (1 + (humidityPercent > 60 ? (humidityPercent - 60) * 0.01 : 0))
      const timeline: string[] = []
      let currentMinute = 30
      const intervalMinutes = Math.floor(totalMinutes / totalGels)
      for (let i = 0; i < totalGels; i++) {
        const timeHours = Math.floor(currentMinute / 60)
        const timeMinutes = currentMinute % 60
        const gelType = i >= regularGels ? 'CAF 100' : 'GEL 100'
        timeline.push(`${timeHours}:${timeMinutes.toString().padStart(2, '0')} - Take MAURTEN ${gelType}`)
        currentMinute += intervalMinutes
      }
      const dailyCarbs = Math.round(weightKg * 8)
      const dailyCalories = Math.round(dailyCarbs * 4)
      const breakfastCarbs = Math.round(weightKg * 2)
      const breakfastCalories = Math.round(breakfastCarbs * 4)
      const result = {
        totalGels,
        regularGels,
        caffeineGels,
        timeline,
        hydrationPerHour: Math.round(baseHydration),
        carbLoading: {
          dailyCarbs,
          dailyCalories,
          breakfastCarbs,
          breakfastCalories
        }
      }
      setResult(result)
      setLoading(false)
    }, 900)
  }

  const ThreeDayOverview = () => {
    if (!result) return null;
    const { carbLoading } = result;
    const carbSources = [
      'White rice',
      'Pasta',
      'White bread',
      'Potatoes',
      'Bananas',
      'Low-fiber cereals (e.g., Frosties)',
      'Sports drinks (e.g., Maurten Drink Mix)',
      'Fruit juice',
      'Jam/honey',
    ];
    const foodsToAvoid = [
      'High-fiber foods (brown bread, beans, lentils)',
      'Fatty foods (fried, creamy sauces)',
      'Spicy foods',
      'Alcohol',
      'Large amounts of raw vegetables',
    ];
    const ExpoBox = ({ children }: { children: React.ReactNode }) => (
      <Box bg="red.50" borderLeft="4px solid #E53E3E" p={3} my={2} borderRadius="md">
        {children}
      </Box>
    );
    return (
      <Box mt={8} color="black">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          3-Day Race Week Overview
        </Text>
        <Stack spacing={6}>
          {/* Thursday */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2}>Thursday (4 days out)</Text>
            <ExpoBox>
              <Text fontWeight="bold">LØBEREN EXPO OPENS: 14:00 – 19:00</Text>
              <Text>Kick off the Expo! Be the first to see the world's biggest brands, their newest products, and meet running experts. Get the official race newspaper and limited-edition merchandise.</Text>
            </ExpoBox>
            <Text mb={1}>• <b>Carb target:</b> {carbLoading.dailyCarbs}g ({carbLoading.dailyCalories} kcal) throughout the day</Text>
            <Text mb={1}>• <b>Good carb sources:</b> {carbSources.join(', ')}</Text>
            <Text mb={1}>• <b>Include Maurten:</b> Start sipping Maurten Drink Mix 160/320 with meals and snacks</Text>
            <Text mb={1}>• <b>Foods to avoid:</b> {foodsToAvoid.join(', ')}</Text>
            <Text mb={1}>• <b>Shakeout run:</b> Easy 20–40 min run in the morning or midday</Text>
            <Text mb={1}>• <b>Sleep:</b> Aim for 8+ hours, keep a regular bedtime</Text>
          </Box>
          {/* Friday */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2}>Friday (3 days out)</Text>
            <ExpoBox>
              <Text fontWeight="bold">LØBEREN EXPO OPENS: 12:00 – 19:00</Text>
              <Text>Experience the huge running universe. Merch. Newspaper. The biggest and best brands. The party continues.</Text>
              <Text fontWeight="bold" mt={2}>SHAKEOUT RUN & CPH MARATHON: 17:00–18:00</Text>
              <Text>Everyone is welcome! Get a unique insight into the course, the thoughts behind it, and cool spots along the route. Different pace groups, organized with Sparta. After the run: alcohol-free beer from Erdinger, sausage rolls, and Red Bull. Free, but requires sign up in the Facebook event.</Text>
            </ExpoBox>
            <Text mb={1}>• <b>Carb target:</b> {carbLoading.dailyCarbs}g ({carbLoading.dailyCalories} kcal) throughout the day</Text>
            <Text mb={1}>• <b>Good carb sources:</b> {carbSources.join(', ')}</Text>
            <Text mb={1}>• <b>Include Maurten:</b> Use Maurten Drink Mix with snacks, and consider a Maurten GEL 100 after your shakeout run</Text>
            <Text mb={1}>• <b>Foods to avoid:</b> {foodsToAvoid.join(', ')}</Text>
            <Text mb={1}>• <b>Shakeout run:</b> Easy 15–30 min run, ideally in the morning or join the Expo shakeout at 17:00</Text>
            <Text mb={1}>• <b>Sleep:</b> Prioritize 8+ hours, wind down early</Text>
          </Box>
          {/* Saturday */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2}>Saturday (2 days out)</Text>
            <ExpoBox>
              <Text fontWeight="bold">LØBEREN EXPO OPENS: 10:00 – 19:00</Text>
              <Text>Come and experience the huge running universe!</Text>
              <Text fontWeight="bold" mt={2}>FINAL BIB PICK-UP: 17:00 – 19:00</Text>
              <Text>The Expo closes at 19:00. If you haven't picked up your race bib, make sure to do so!</Text>
            </ExpoBox>
            <Text mb={1}>• <b>Carb target:</b> {carbLoading.dailyCarbs}g ({carbLoading.dailyCalories} kcal) throughout the day</Text>
            <Text mb={1}>• <b>Good carb sources:</b> {carbSources.join(', ')}</Text>
            <Text mb={1}>• <b>Include Maurten:</b> Use Maurten Drink Mix and snacks, keep fueling up</Text>
            <Text mb={1}>• <b>Foods to avoid:</b> {foodsToAvoid.join(', ')}</Text>
            <Text mb={1}>• <b>Shakeout run:</b> Optional 10–20 min jog, keep it easy</Text>
            <Text mb={1}>• <b>Sleep:</b> Prioritize 8+ hours, get to bed early</Text>
          </Box>
          {/* Sunday */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2}>Sunday (Race Day)</Text>
            <Text mb={1}>• <b>Carb target (breakfast):</b> {carbLoading.breakfastCarbs}g ({carbLoading.breakfastCalories} kcal) 3–4 hours before start</Text>
            <Text mb={1}>• <b>Good carb sources:</b> White bread with jam/honey, Frosties with milk, bananas, Maurten Drink Mix, sports drink</Text>
            <Text mb={1}>• <b>Include Maurten:</b> Maurten Drink Mix or GEL 100 as part of breakfast and pre-race hydration</Text>
            <Text mb={1}>• <b>Foods to avoid:</b> High-fiber, fatty, or spicy foods; dairy if sensitive</Text>
            <Text mb={1}>• <b>Shakeout:</b> Optional 5–10 min jog and drills 2–3 hours before start</Text>
            <Text mb={1}>• <b>Sleep:</b> Don't stress if you sleep less, but try to rest and stay off your feet</Text>
          </Box>
        </Stack>
      </Box>
    );
  };

  // New Race Day Breakfast Section
  const RaceDayBreakfastSection = () => (
    <Box mt={8} color="black">
      <Text fontSize="2xl" fontWeight="extrabold" mb={4}>
        Race Day Breakfast: What to Eat & When
      </Text>
      <Table variant="simple" mb={6} maxW="400px">
        <Thead>
          <Tr>
            <Th>Breakfast Target</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Carbohydrates</Td>
            <Td isNumeric>{result?.carbLoading.breakfastCarbs}g</Td>
          </Tr>
          <Tr>
            <Td>Calories from Carbs</Td>
            <Td isNumeric>{result?.carbLoading.breakfastCalories} kcal</Td>
          </Tr>
        </Tbody>
      </Table>
      <Text fontSize="lg" mb={3}>
        Suggested Breakfast Options:
      </Text>
      <List spacing={2}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Frosties with milk (28g carbs per 30g serving)
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          White bread with honey/jam (15g carbs per slice)
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Banana (23g carbs)
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Sports drink (15g carbs per 250ml)
        </ListItem>
      </List>
      <Text fontSize="md" mt={4} color="gray.600">
        Eat breakfast 3–4 hours before the race. Sip Maurten Drink Mix or sports drink up to 30 minutes before the start.
      </Text>
    </Box>
  )

  // Weather forecast card
  const WeatherForecast = () => (
    <Box mb={8} p={4} bg="blue.50" borderRadius="md" boxShadow="sm" border="1px solid" borderColor="blue.200" maxW="400px" mx="auto">
      <Text fontSize="lg" fontWeight="bold" mb={2}>Weather Forecast for Race Day</Text>
      <Text><b>Date:</b> {weather.date}</Text>
      <Text><b>Conditions:</b> {weather.conditions}</Text>
      <Text><b>Temperature:</b> {weather.temperature}°C</Text>
      <Text><b>Humidity:</b> {weather.humidity}%</Text>
      <Text><b>Wind:</b> {weather.wind}</Text>
      <Text><b>UV Index:</b> {weather.uv} (Moderate)</Text>
      <Text><b>Sunrise:</b> {weather.sunrise} <b>Sunset:</b> {weather.sunset}</Text>
    </Box>
  )

  return (
    <Flex direction="column" align="center" justify="center" width="100%" minH="60vh" p={4}>
      {/* Show form only if not submitted or loading */}
      {(!hasSubmitted || loading) && (
        <Box bg="gray.50" p={8} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200" width="100%" maxW="420px" mx="auto">
          <Stack spacing={6} width="100%">
            <Grid templateColumns="1fr" gap={6} width="100%">
              <GridItem>
                <FormControl isRequired>
                  <FormLabel color="black">Target Marathon Time (HH:MM)</FormLabel>
                  <Input
                    type="text"
                    placeholder="04:00"
                    value={targetTime}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetTime(e.target.value)}
                    pattern="[0-9]{2}:[0-9]{2}"
                    bg="white"
                    color="black"
                    borderColor="gray.300"
                    _placeholder={{ color: 'gray.500' }}
                    width="100%"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel color="black">Weight (kg)</FormLabel>
                  <NumberInput min={30} max={150} width="100%">
                    <NumberInputField
                      value={weight}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)}
                      placeholder="70"
                      bg="white"
                      color="black"
                      borderColor="gray.300"
                      _placeholder={{ color: 'gray.500' }}
                      width="100%"
                    />
                  </NumberInput>
                </FormControl>
              </GridItem>
            </Grid>
            <Button colorScheme="blue" size="lg" onClick={calculateGelStrategy} width="100%" alignSelf="center" isLoading={loading}>
              Calculate Strategy
            </Button>
          </Stack>
        </Box>
      )}
      {/* Show results only after submit and not loading */}
      {hasSubmitted && !loading && result && (
        <Box bg="gray.50" p={8} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="gray.200" width="100%" maxW="700px" mx="auto" mt={8}>
          <Stack spacing={8} align="center" width="100%">
            <WeatherForecast />
            <ThreeDayOverview />
            <RaceDayBreakfastSection />
            <Divider my={6} borderColor="gray.200" />
            <Alert 
              status="success" 
              mb={4} 
              variant="subtle"
              borderRadius="md"
            >
              <AlertIcon />
              You will need {result.totalGels} gels in total ({result.regularGels} regular GEL 100 and{' '}
              {result.caffeineGels} CAF 100)
            </Alert>
            <Text fontSize="lg" mb={2} color="black">
              Recommended hydration: {result.hydrationPerHour}ml per hour
            </Text>
            <Divider my={4} borderColor="gray.200" />
            <Text fontSize="lg" fontWeight="bold" mb={2} color="black">
              Gel Timeline:
            </Text>
            <Stack spacing={2}>
              {result.timeline.map((time, index) => (
                <Text 
                  key={index} 
                  color="black" 
                  fontFamily="'Courier Prime', 'Courier New', monospace"
                >
                  {time}
                </Text>
              ))}
            </Stack>
          </Stack>
        </Box>
      )}
    </Flex>
  )
}

export default MarathonCalculator 