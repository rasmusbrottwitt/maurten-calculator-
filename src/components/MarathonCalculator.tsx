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
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Spinner,
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { keyframes } from '@emotion/react'

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

const coffeeShops = [
  'Coffee Collective (Jægersborggade)',
  'Prolog Coffee Bar',
  'Democratic Coffee',
  'Andersen & Maillard',
  'Original Coffee (Illum Rooftop)',
  'La Cabra',
  'Kaffedepartementet',
  'Rist Kaffebar',
  'Sonny',
  'April Coffee',
]

// Animation keyframes for math symbols
const float = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-10px); opacity: 0.7; }
  100% { transform: translateY(0); opacity: 1; }
`

// Blue highlight box for coffee/party/travel recs
const BlueBox = ({ children }: { children: React.ReactNode }) => (
  <Box bg="blue.600" borderLeft="4px solid #3182ce" p={3} my={2} borderRadius="md" color="white">
    {children}
  </Box>
)

// Static city comparison data
const cityComparisons: Record<string, { elevation: string; humidity: string; temp: string; timezone: string; country: string }> = {
  'london': { elevation: 'lower', humidity: 'similar', temp: 'slightly warmer', timezone: 'Europe/London', country: 'UK' },
  'berlin': { elevation: 'similar', humidity: 'similar', temp: 'similar', timezone: 'Europe/Berlin', country: 'Germany' },
  'new york': { elevation: 'higher', humidity: 'more humid', temp: 'warmer', timezone: 'America/New_York', country: 'USA' },
  'oslo': { elevation: 'lower', humidity: 'less humid', temp: 'warmer', timezone: 'Europe/Oslo', country: 'Norway' },
  'stockholm': { elevation: 'lower', humidity: 'less humid', temp: 'warmer', timezone: 'Europe/Stockholm', country: 'Sweden' },
  'paris': { elevation: 'lower', humidity: 'similar', temp: 'slightly cooler', timezone: 'Europe/Paris', country: 'France' },
  'madrid': { elevation: 'lower', humidity: 'more humid', temp: 'cooler', timezone: 'Europe/Madrid', country: 'Spain' },
  'rome': { elevation: 'lower', humidity: 'more humid', temp: 'cooler', timezone: 'Europe/Rome', country: 'Italy' },
  'copenhagen': { elevation: 'same', humidity: 'same', temp: 'same', timezone: 'Europe/Copenhagen', country: 'Denmark' },
}

// Helper to get city comparison
function getCityComparison(city: string) {
  if (!city) return null;
  const key = city.trim().toLowerCase();
  return cityComparisons[key] || null;
}

// Helper to check if city is in Denmark
function isDenmark(city: string) {
  const key = city.trim().toLowerCase();
  return key.includes('copenhagen') || key.includes('denmark');
}

// Helper to check for jetlag (very basic, just checks for US/Europe difference)
function needsJetlagAdvice(city: string) {
  const key = city.trim().toLowerCase();
  return key.includes('new york') || key.includes('usa') || key.includes('america') || key.includes('canada') || key.includes('australia') || key.includes('asia');
}

const barList = [
  'Kødbyen',
  'Lidkoeb',
  'Ruby',
  'Curfew',
  'The Jane',
  'Balderdash',
];

const nbroAfterparty = {
  name: 'NBRO Unofficial Official Afterparty',
  time: 'Sunday 7:00 PM',
  place: 'Søpavillonen',
  url: 'https://nbro.run/',
};

// Top-of-results travel info for non-Denmark users
const TravelInfo = ({ city }: { city: string }) => {
  if (isDenmark(city)) return null;
  return (
    <BlueBox>
      <Text fontWeight="bold">Getting around in Copenhagen</Text>
      <Text>• <b>Metro:</b> <a href="https://m.dk/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>m.dk</a></Text>
      <Text>• <b>Donkey Republic bikes:</b> <a href="https://www.donkey.bike/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>donkey.bike</a></Text>
      {needsJetlagAdvice(city) && (
        <Text mt={2}><b>Jetlag tip:</b> Try to arrive a few days early, get sunlight in the morning, and avoid caffeine late in the day.</Text>
      )}
    </BlueBox>
  );
};

// City comparison info
const CityComparison = ({ city }: { city: string }) => {
  const comp = getCityComparison(city);
  if (!comp) return null;
  return (
    <BlueBox>
      <Text fontWeight="bold">How will Copenhagen feel compared to {city}?</Text>
      <Text>• <b>Elevation:</b> {comp.elevation}</Text>
      <Text>• <b>Humidity:</b> {comp.humidity}</Text>
      <Text>• <b>Temperature:</b> {comp.temp}</Text>
    </BlueBox>
  );
};

const MarathonCalculator = () => {
  const [targetTime, setTargetTime] = useState('')
  const [weight, setWeight] = useState('')
  const [brand, setBrand] = useState<'Maurten' | 'Powerbar'>('Maurten')
  const [coffeeLove, setCoffeeLove] = useState(3)
  const [partyLove, setPartyLove] = useState(1)
  const [weeklyMileage, setWeeklyMileage] = useState('')
  const [peakMileage, setPeakMileage] = useState('')
  const [homeCity, setHomeCity] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [showPartyTooltip, setShowPartyTooltip] = useState(false)
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
      const gelName = brand === 'Maurten' ? 'GEL 100' : 'PowerGel Original'
      const cafGelName = brand === 'Maurten' ? 'CAF 100' : 'PowerGel Hydro Caffeine'
      const timeline: string[] = []
      let currentMinute = 30
      const intervalMinutes = Math.floor(totalMinutes / totalGels)
      for (let i = 0; i < totalGels; i++) {
        const timeHours = Math.floor(currentMinute / 60)
        const timeMinutes = currentMinute % 60
        const gelType = i >= regularGels ? cafGelName : gelName
        timeline.push(`${timeHours}:${timeMinutes.toString().padStart(2, '0')} - Take ${brand} ${gelType}`)
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
    // Coffee and party recs
    const coffeeRecs = coffeeShops.slice(0, coffeeLove);
    const partyRecs = barList.slice(0, partyLove);
    const showAfterparty = partyLove > 1;
    const ExpoBox = ({ children }: { children: React.ReactNode }) => (
      <Box bg="red.50" borderLeft="4px solid #E53E3E" p={3} my={2} borderRadius="md" color="black">
        {children}
      </Box>
    );
    return (
      <Box mt={8} color="white">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          3-Day Race Week Overview
        </Text>
        <Stack spacing={6}>
          {/* Thursday */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2} color="white">Thursday (4 days out)</Text>
            <ExpoBox>
              <Text fontWeight="bold" color="red.700">LØBEREN EXPO OPENS: 14:00 – 19:00</Text>
              <Text color="red.700">Kick off the Expo! Be the first to see the world's biggest brands, their newest products, and meet running experts. Get the official race newspaper and limited-edition merchandise.</Text>
            </ExpoBox>
            <BlueBox>
              <Text fontWeight="bold">Coffee tip:</Text>
              <Text>{coffeeRecs[0]}</Text>
            </BlueBox>
            <Text mb={1}>• <b>Carb target:</b> {carbLoading.dailyCarbs}g ({carbLoading.dailyCalories} kcal) throughout the day</Text>
            <Text mb={1}>• <b>Good carb sources:</b> {carbSources.join(', ')}</Text>
            <Text mb={1}>• <b>Include Maurten:</b> Start sipping Maurten Drink Mix 160/320 with meals and snacks</Text>
            <Text mb={1}>• <b>Foods to avoid:</b> {foodsToAvoid.join(', ')}</Text>
            <Text mb={1}>• <b>Shakeout run:</b> Easy 20–40 min run in the morning or midday</Text>
            <Text mb={1}>• <b>Sleep:</b> Aim for 8+ hours, keep a regular bedtime</Text>
            {partyLove > 0 && (
              <BlueBox>
                <Text fontWeight="bold">Bar tip:</Text>
                <Text>{partyRecs[0]}</Text>
              </BlueBox>
            )}
          </Box>
          {/* Friday */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2} color="white">Friday (3 days out)</Text>
            <ExpoBox>
              <Text fontWeight="bold" color="red.700">LØBEREN EXPO OPENS: 12:00 – 19:00</Text>
              <Text color="red.700">Experience the huge running universe. Merch. Newspaper. The biggest and best brands. The party continues.</Text>
              <Text fontWeight="bold" mt={2} color="red.700">SHAKEOUT RUN & CPH MARATHON: 17:00–18:00</Text>
              <Text color="red.700">Everyone is welcome! Get a unique insight into the course, the thoughts behind it, and cool spots along the route. Different pace groups, organized with Sparta. After the run: alcohol-free beer from Erdinger, sausage rolls, and Red Bull. Free, but requires sign up in the Facebook event.</Text>
            </ExpoBox>
            {coffeeLove > 1 && (
              <BlueBox>
                <Text fontWeight="bold">Coffee tip:</Text>
                <Text>{coffeeRecs[1 % coffeeRecs.length]}</Text>
              </BlueBox>
            )}
            <Text mb={1}>• <b>Carb target:</b> {carbLoading.dailyCarbs}g ({carbLoading.dailyCalories} kcal) throughout the day</Text>
            <Text mb={1}>• <b>Good carb sources:</b> {carbSources.join(', ')}</Text>
            <Text mb={1}>• <b>Include Maurten:</b> Use Maurten Drink Mix with snacks, and consider a Maurten GEL 100 after your shakeout run</Text>
            <Text mb={1}>• <b>Foods to avoid:</b> {foodsToAvoid.join(', ')}</Text>
            <Text mb={1}>• <b>Shakeout run:</b> Easy 15–30 min run, ideally in the morning or join the Expo shakeout at 17:00</Text>
            <Text mb={1}>• <b>Sleep:</b> Prioritize 8+ hours, wind down early</Text>
            {partyLove > 1 && (
              <BlueBox>
                <Text fontWeight="bold">Bar tip:</Text>
                <Text>{partyRecs[1 % partyRecs.length]}</Text>
              </BlueBox>
            )}
          </Box>
          {/* Saturday */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2} color="white">Saturday (2 days out)</Text>
            <ExpoBox>
              <Text fontWeight="bold" color="red.700">LØBEREN EXPO OPENS: 10:00 – 19:00</Text>
              <Text color="red.700">Come and experience the huge running universe!</Text>
              <Text fontWeight="bold" mt={2} color="red.700">FINAL BIB PICK-UP: 17:00 – 19:00</Text>
              <Text color="red.700">The Expo closes at 19:00. If you haven't picked up your race bib, make sure to do so!</Text>
            </ExpoBox>
            {coffeeLove > 2 && (
              <BlueBox>
                <Text fontWeight="bold">Coffee tip:</Text>
                <Text>{coffeeRecs[2 % coffeeRecs.length]}</Text>
              </BlueBox>
            )}
            <Text mb={1}>• <b>Carb target:</b> {carbLoading.dailyCarbs}g ({carbLoading.dailyCalories} kcal) throughout the day</Text>
            <Text mb={1}>• <b>Good carb sources:</b> {carbSources.join(', ')}</Text>
            <Text mb={1}>• <b>Include Maurten:</b> Use Maurten Drink Mix and snacks, keep fueling up</Text>
            <Text mb={1}>• <b>Foods to avoid:</b> {foodsToAvoid.join(', ')}</Text>
            <Text mb={1}>• <b>Shakeout run:</b> Optional 10–20 min jog, keep it easy</Text>
            <Text mb={1}>• <b>Sleep:</b> Prioritize 8+ hours, get to bed early</Text>
            {partyLove > 2 && (
              <BlueBox>
                <Text fontWeight="bold">Bar tip:</Text>
                <Text>{partyRecs[2 % partyRecs.length]}</Text>
              </BlueBox>
            )}
          </Box>
          {/* Sunday */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2} color="white">Sunday (Race Day)</Text>
            <Text mb={1} color="white">• <b>Carb target (breakfast):</b> {carbLoading.breakfastCarbs}g ({carbLoading.breakfastCalories} kcal) 3–4 hours before start</Text>
            <Text mb={1} color="white">• <b>Good carb sources:</b> White bread with jam/honey, Frosties with milk, bananas, Maurten Drink Mix, sports drink</Text>
            <Text mb={1} color="white">• <b>Include Maurten:</b> Maurten Drink Mix or GEL 100 as part of breakfast and pre-race hydration</Text>
            <Text mb={1} color="white">• <b>Foods to avoid:</b> High-fiber, fatty, or spicy foods; dairy if sensitive</Text>
            <Text mb={1} color="white">• <b>Shakeout:</b> Optional 5–10 min jog and drills 2–3 hours before start</Text>
            <Text mb={1} color="white">• <b>Sleep:</b> Don't stress if you sleep less, but try to rest and stay off your feet</Text>
            {coffeeLove > 3 && (
              <BlueBox>
                <Text fontWeight="bold">Coffee tip:</Text>
                <Text>{coffeeRecs[3 % coffeeRecs.length]}</Text>
              </BlueBox>
            )}
            {partyLove > 3 && (
              <BlueBox>
                <Text fontWeight="bold">Bar tip:</Text>
                <Text>{partyRecs[3 % partyRecs.length]}</Text>
              </BlueBox>
            )}
            {showAfterparty && (
              <BlueBox>
                <Text fontWeight="bold">Afterparty:</Text>
                <Text>
                  {nbroAfterparty.name} at {nbroAfterparty.place}, {nbroAfterparty.time} (<a href="{nbroAfterparty.url}" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>details</a>)
                </Text>
              </BlueBox>
            )}
          </Box>
        </Stack>
      </Box>
    );
  };

  // New Race Day Breakfast Section
  const RaceDayBreakfastSection = () => (
    <Box mt={8} color="white">
      <Text fontSize="2xl" fontWeight="extrabold" mb={4} color="white">
        Race Day Breakfast: What to Eat & When
      </Text>
      <Table variant="simple" mb={6} maxW="400px">
        <Thead>
          <Tr>
            <Th color="white">Breakfast Target</Th>
            <Th isNumeric color="white">Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td color="white">Carbohydrates</Td>
            <Td isNumeric color="white">{result?.carbLoading.breakfastCarbs}g</Td>
          </Tr>
          <Tr>
            <Td color="white">Calories from Carbs</Td>
            <Td isNumeric color="white">{result?.carbLoading.breakfastCalories} kcal</Td>
          </Tr>
        </Tbody>
      </Table>
      <Text fontSize="lg" mb={3} color="white">
        Suggested Breakfast Options:
      </Text>
      <List spacing={2} color="white">
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
      <Text fontSize="md" mt={4} color="white">
        Eat breakfast 3–4 hours before the race. Sip Maurten Drink Mix or sports drink up to 30 minutes before the start.
      </Text>
      {/* Jetlag tip for travelers */}
      {needsJetlagAdvice(homeCity) && (
        <Box mt={4} bg="blue.600" borderLeft="4px solid #3182ce" p={3} borderRadius="md" color="white">
          <Text fontWeight="bold">Jetlag Tip:</Text>
          <Text>Arriving from far away? Try to arrive a few days early, get sunlight in the morning, and avoid caffeine late in the day. Consider adjusting your sleep schedule a few days before travel.</Text>
        </Box>
      )}
    </Box>
  )

  // Weather forecast card
  const WeatherForecast = () => (
    <Box mb={8} p={4} bg="blue.50" borderRadius="md" boxShadow="sm" border="1px solid" borderColor="blue.200" maxW="400px" mx="auto">
      <Text fontSize="lg" fontWeight="bold" mb={2} color="black">Weather Forecast for Race Day</Text>
      <Text color="black"><b>Date:</b> {weather.date}</Text>
      <Text color="black"><b>Conditions:</b> {weather.conditions}</Text>
      <Text color="black"><b>Temperature:</b> {weather.temperature}°C</Text>
      <Text color="black"><b>Humidity:</b> {weather.humidity}%</Text>
      <Text color="black"><b>Wind:</b> {weather.wind}</Text>
      <Text color="black"><b>UV Index:</b> {weather.uv} (Moderate)</Text>
      <Text color="black"><b>Sunrise:</b> {weather.sunrise} <b>Sunset:</b> {weather.sunset}</Text>
    </Box>
  )

  // Weather explanation box
  const WeatherExplanation = () => (
    <Box bg="gray.100" borderRadius="md" p={4} mb={4} fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" color="black">
      <Text fontWeight="bold" mb={2} fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" color="black">How weather is used in the calculation</Text>
      <Text fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" color="black">
        The calculator uses the latest weather forecast for race day in Copenhagen (temperature, humidity, wind, and UV) to adjust your gel and hydration needs. Higher temperature and humidity increase your recommended intake. The forecast is updated automatically for the correct date.
      </Text>
    </Box>
  )

  // Animated loading component
  const MathLoadingAnimation = () => (
    <Flex direction="column" align="center" justify="center" minH="300px" p={8}>
      <Text fontSize="5xl" mb={2}>
        💻
      </Text>
      <Flex mb={4} gap={2}>
        <Text fontSize="2xl" color="blue.500" fontWeight="bold" animation={`${float} 1.2s infinite`}>
          ∑
        </Text>
        <Text fontSize="2xl" color="green.500" fontWeight="bold" animation={`${float} 1.3s infinite 0.2s`}>
          π
        </Text>
        <Text fontSize="2xl" color="red.500" fontWeight="bold" animation={`${float} 1.1s infinite 0.4s`}>
          √
        </Text>
        <Text fontSize="2xl" color="orange.500" fontWeight="bold" animation={`${float} 1.4s infinite 0.6s`}>
          ∞
        </Text>
      </Flex>
      <Text fontSize="lg" mb={4} color="gray.600" fontWeight="bold">
        Crunching the numbers...
      </Text>
      <Spinner size="xl" color="blue.400" thickness="4px" speed="0.8s" />
    </Flex>
  )

  return (
    <Flex direction="column" align="center" justify="center" width="100%" minH="60vh" p={4} fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif">
      {/* Show animation while loading */}
      {loading && <MathLoadingAnimation />}
      {/* Show form only if not submitted and not loading */}
      {(!hasSubmitted && !loading) && (
        <Box bg="red.700" p={8} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="red.400" width="100%" maxW="520px" mx="auto" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif">
          <WeatherExplanation />
          <Stack spacing={8} width="100%">
            {/* Running Details Section */}
            <Box mb={2}>
              <Text fontSize="xl" fontWeight="bold" mb={2} color="white" fontFamily="'Fjalla One', Helvetica, Arial, sans-serif">Running Details</Text>
              <Grid templateColumns="1fr" gap={6} width="100%">
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif">Target Marathon Time (HH:MM)</FormLabel>
                    <Input
                      type="text"
                      placeholder="04:00"
                      value={targetTime}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetTime(e.target.value)}
                      pattern="[0-9]{2}:[0-9]{2}"
                      bg="white"
                      color="red.700"
                      borderColor="red.300"
                      _placeholder={{ color: 'red.300' }}
                      width="100%"
                      fontFamily="'Lato', Helvetica, Arial, sans-serif"
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif">Weight (kg)</FormLabel>
                    <NumberInput min={30} max={150} width="100%">
                      <NumberInputField
                        value={weight}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)}
                        placeholder="70"
                        bg="white"
                        color="red.700"
                        borderColor="red.300"
                        _placeholder={{ color: 'red.300' }}
                        width="100%"
                        fontFamily="'Lato', Helvetica, Arial, sans-serif"
                      />
                    </NumberInput>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif">Weekly average mileage (km)</FormLabel>
                    <NumberInput min={0} max={300} width="100%">
                      <NumberInputField
                        value={weeklyMileage}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setWeeklyMileage(e.target.value)}
                        placeholder="50"
                        bg="white"
                        color="red.700"
                        borderColor="red.300"
                        _placeholder={{ color: 'red.300' }}
                        width="100%"
                        fontFamily="'Lato', Helvetica, Arial, sans-serif"
                      />
                    </NumberInput>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif">Peak week mileage (km)</FormLabel>
                    <NumberInput min={0} max={400} width="100%">
                      <NumberInputField
                        value={peakMileage}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPeakMileage(e.target.value)}
                        placeholder="80"
                        bg="white"
                        color="red.700"
                        borderColor="red.300"
                        _placeholder={{ color: 'red.300' }}
                        width="100%"
                        fontFamily="'Lato', Helvetica, Arial, sans-serif"
                      />
                    </NumberInput>
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>
            {/* Social Details Section */}
            <Box mb={2}>
              <Text fontSize="xl" fontWeight="bold" mb={2} color="white" fontFamily="'Fjalla One', Helvetica, Arial, sans-serif">Social Details</Text>
              <Grid templateColumns="1fr" gap={6} width="100%">
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif">Home city</FormLabel>
                    <Input
                      type="text"
                      placeholder="e.g. London"
                      value={homeCity}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setHomeCity(e.target.value)}
                      bg="white"
                      color="red.700"
                      borderColor="red.300"
                      _placeholder={{ color: 'red.300' }}
                      width="100%"
                      fontFamily="'Lato', Helvetica, Arial, sans-serif"
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif">Love for coffee</FormLabel>
                    <Slider
                      id="coffeeLove"
                      defaultValue={3}
                      min={1}
                      max={5}
                      colorScheme="red"
                      value={coffeeLove}
                      onChange={setCoffeeLove}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <Tooltip
                        hasArrow
                        bg="red.400"
                        color="white"
                        placement="top"
                        isOpen={showTooltip}
                        label={coffeeLove}
                      >
                        <SliderThumb />
                      </Tooltip>
                    </Slider>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif">Love for party</FormLabel>
                    <Slider
                      id="partyLove"
                      defaultValue={1}
                      min={1}
                      max={5}
                      colorScheme="blue"
                      value={partyLove}
                      onChange={setPartyLove}
                      onMouseEnter={() => setShowPartyTooltip(true)}
                      onMouseLeave={() => setShowPartyTooltip(false)}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <Tooltip
                        hasArrow
                        bg="blue.400"
                        color="white"
                        placement="top"
                        isOpen={showPartyTooltip}
                        label={partyLove}
                      >
                        <SliderThumb />
                      </Tooltip>
                    </Slider>
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>
            {/* Nutrition Brand and Button */}
            <Grid templateColumns="1fr" gap={6} width="100%">
              <GridItem>
                <FormControl isRequired>
                  <FormLabel color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif">Nutrition Brand</FormLabel>
                  <Select value={brand} onChange={e => setBrand(e.target.value as 'Maurten' | 'Powerbar')} fontFamily="'Lato', Helvetica, Arial, sans-serif" bg="white" color="red.700" borderColor="red.300">
                    <option value="Maurten">Maurten</option>
                    <option value="Powerbar">Powerbar</option>
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>
            <Button colorScheme="whiteAlpha" size="lg" onClick={calculateGelStrategy} width="100%" alignSelf="center" isLoading={loading} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif" color="red.700" bg="white" _hover={{ bg: 'red.200' }}>
              Calculate Strategy
            </Button>
          </Stack>
        </Box>
      )}
      {/* Show results only after submit and not loading */}
      {hasSubmitted && !loading && result && (
        <Box bg="red.700" p={8} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="red.400" width="100%" maxW="700px" mx="auto" mt={8} fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" color="white">
          <Stack spacing={8} align="center" width="100%">
            <TravelInfo city={homeCity} />
            <CityComparison city={homeCity} />
            <WeatherForecast />
            <ThreeDayOverview />
            <RaceDayBreakfastSection />
            <Divider my={6} borderColor="gray.200" />
            {/* Gel strategy section now also Helvetica */}
            <Box width="100%" color="white">
              <Alert 
                status="success" 
                mb={4} 
                variant="subtle"
                borderRadius="md"
                color="white"
                bg="red.500"
              >
                <AlertIcon color="white" />
                <span style={{ color: 'white' }}>
                  You will need {result.totalGels} gels in total ({result.regularGels} regular {brand} {brand === 'Maurten' ? 'GEL 100' : 'PowerGel Original'} and {result.caffeineGels} {brand} {brand === 'Maurten' ? 'CAF 100' : 'PowerGel Hydro Caffeine'})
                </span>
              </Alert>
              <Text fontSize="lg" mb={2} color="white">
                Recommended hydration: {result.hydrationPerHour}ml per hour
              </Text>
              <Divider my={4} borderColor="gray.200" />
              <Text fontSize="lg" fontWeight="bold" mb={2} color="white">
                Gel Timeline:
              </Text>
              <Stack spacing={2}>
                {result.timeline.map((time, index) => (
                  <Text 
                    key={index} 
                    color="white" 
                    fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
                  >
                    {time}
                  </Text>
                ))}
              </Stack>
            </Box>
            {/* Coffee recommendations in Helvetica */}
            <Box width="100%" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif">
              <Divider my={6} borderColor="gray.200" />
              <Text fontSize="xl" fontWeight="bold" mb={2} color="black">
                Coffee Recommendations in Copenhagen
              </Text>
              <List spacing={2}>
                {coffeeShops.slice(0, coffeeLove).map((shop) => (
                  <ListItem key={shop}>
                    <ListIcon as={CheckCircleIcon} color="red.500" />
                    {shop}
                  </ListItem>
                ))}
              </List>
            </Box>
            <Button mt={6} colorScheme="gray" variant="outline" onClick={() => { setHasSubmitted(false); setResult(null); setLoading(false); }}>
              Recalculate
            </Button>
          </Stack>
        </Box>
      )}
    </Flex>
  )
}

export default MarathonCalculator 