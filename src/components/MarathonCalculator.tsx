import { useState, ChangeEvent, useEffect } from 'react'
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
import Confetti from 'react-confetti'

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

// Helper: Suggest a Copenhagen running route based on distance
function getCopenhagenRoute(distanceKm: number) {
  if (distanceKm < 5) return "The Lakes (Søerne) – flat, scenic, central";
  if (distanceKm < 8) return "Fælledparken – big park, soft paths, good for 5-8km";
  if (distanceKm < 12) return "Amager Fælled – nature, gravel, 8-12km loops";
  if (distanceKm < 18) return "Utterslev Mose – lakes, nature, 12-18km";
  return "Vestvolden or Sydhavnstippen – long, uninterrupted paths for 18km+";
}

// Helper: Suggest distance/intensity based on weekly mileage
function getWorkoutSuggestion(day: string) {
  let distance = 5, intensity = "easy";

  if (day === "Saturday") {
    // Shakeout run logic
    distance = 4;
    intensity = "very easy";
  } else {
    // Other days: short workout
    distance = 6;
    intensity = "easy or strides";
  }
  return { distance, intensity };
}

const MarathonCalculator = () => {
  const [targetTime, setTargetTime] = useState('')
  const [weight, setWeight] = useState('')
  const [brand, setBrand] = useState<'Maurten' | 'Powerbar'>('Maurten')
  const [coffeeLove, setCoffeeLove] = useState(3)
  const [partyLove, setPartyLove] = useState(1)
  const [homeCity, setHomeCity] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [showPartyTooltip, setShowPartyTooltip] = useState(false)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [resultsPage, setResultsPage] = useState(0)
  const [favoriteArtist, setFavoriteArtist] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [name, setName] = useState('')

  // Helper function to check if user should get special recommendations
  const getSpecialRecommendations = () => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('tim rossi') || lowerName.includes('tigertonito')) {
      return 'white-monster';
    }
    if (lowerName.includes('kallebumbum')) {
      return 'gin';
    }
    return null;
  }

  const specialType = getSpecialRecommendations();

  const calculateGelStrategy = () => {
    setLoading(true)
    setHasSubmitted(true)
    setTimeout(() => {
      if (!targetTime || !weight || !homeCity) {
        alert('Please fill in all fields')
        setLoading(false)
        setHasSubmitted(false)
        setResultsPage(0)
        return
      }
      const [hours, minutes] = targetTime.split(':').map(Number)
      if (isNaN(hours) || isNaN(minutes)) {
        alert('Please enter time in HH:MM format (e.g., 04:00)')
        setLoading(false)
        setHasSubmitted(false)
        setResultsPage(0)
        return
      }
      const totalMinutes = (hours * 60) + minutes
      const tempC = weather.temperature
      const humidityPercent = weather.humidity
      const weightKg = parseFloat(weight)
      if (isNaN(weightKg)) {
        alert('Please enter a valid number for weight')
        setLoading(false)
        setHasSubmitted(false)
        setResultsPage(0)
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
      if (isUngSchlippoFavorite(favoriteArtist)) {
        setShowConfetti(true)
      } else {
        setShowConfetti(false)
      }
    }, 900)
  }

  // Helper: Suggest a classic Danish artist based on favoriteArtist
  function getDanishArtistSuggestion(fav: string) {
    const randomFallbacks = [
      {
        name: 'Kim Larsen',
        albums: [
          { title: 'Midt Om Natten', url: 'https://music.apple.com/dk/album/midt-om-natten/1440838762' },
          { title: 'Værsgo', url: 'https://music.apple.com/dk/album/v%C3%A6rsgo/1440838761' },
          { title: "Gasolin' 3", url: 'https://music.apple.com/dk/album/gasolin-3/1440838757' },
        ]
      },
      {
        name: 'Anne Linnet',
        albums: [
          { title: 'Barndommens Gade', url: 'https://music.apple.com/dk/album/barndommens-gade/1440838780' },
          { title: 'Jeg Er Jo Lige Her', url: 'https://music.apple.com/dk/album/jeg-er-jo-lige-her/1440838781' },
          { title: 'Min Sang', url: 'https://music.apple.com/dk/album/min-sang/1440838782' },
        ]
      },
      {
        name: 'TV-2',
        albums: [
          { title: 'Nærmest Lykkelig', url: 'https://music.apple.com/dk/album/n%C3%A6rmest-lykkelig/1440838776' },
          { title: 'Fantastiske Toyota', url: 'https://music.apple.com/dk/album/fantastiske-toyota/1440838777' },
          { title: 'Verden Er Vidunderlig', url: 'https://music.apple.com/dk/album/verden-er-vidunderlig/1440838778' },
        ]
      },
      {
        name: "Gasolin'",
        albums: [
          { title: "Gasolin' 3", url: 'https://music.apple.com/dk/album/gasolin-3/1440838757' },
          { title: 'Live i Skandinavien', url: 'https://music.apple.com/dk/album/live-i-skandinavien/1440838759' },
          { title: 'Efter Endnu En Dag', url: 'https://music.apple.com/dk/album/efter-endnu-en-dag/1440838758' },
        ]
      },
    ];
    if (!fav) return randomFallbacks[0];
    const lower = fav.toLowerCase();
    // Direct artist swaps
    if (lower.includes('gili')) {
      return {
        name: 'L.O.C.',
        albums: [
          { title: 'Inkarneret', url: 'https://music.apple.com/dk/album/inkarneret/1440838783' },
          { title: 'Melankolia / XXX Couture', url: 'https://music.apple.com/dk/album/melankolia-xxx-couture/1440838784' },
          { title: 'Prestige, Paranoia, Persona Vol. 1', url: 'https://music.apple.com/dk/album/prestige-paranoia-persona-vol-1/1440838785' },
        ]
      }
    }
    if (lower.includes('mø') || lower.includes('mo') || lower.includes('moe')) {
      return {
        name: 'Anne Linnet',
        albums: [
          { title: 'Barndommens Gade', url: 'https://music.apple.com/dk/album/barndommens-gade/1440838780' },
          { title: 'Jeg Er Jo Lige Her', url: 'https://music.apple.com/dk/album/jeg-er-jo-lige-her/1440838781' },
          { title: 'Min Sang', url: 'https://music.apple.com/dk/album/min-sang/1440838782' },
        ]
      }
    }
    if (lower.includes('ung schlippo')) {
      return {
        name: 'Johnson',
        albums: [
          { title: 'Det Passer', url: 'https://music.apple.com/dk/album/det-passer/1440838786' },
          { title: 'Alt Mit Shit', url: 'https://music.apple.com/dk/album/alt-mit-shit/1440838787' },
          { title: 'Bawler Hele Dagen', url: 'https://music.apple.com/dk/album/bawler-hele-dagen/1440838788' },
        ]
      }
    }
    if (lower.includes('suspekt')) {
      return {
        name: 'Gili',
        albums: [
          { title: 'Carnival', url: 'https://music.apple.com/dk/album/carnival/1440838789' },
          { title: 'Vors', url: 'https://music.apple.com/dk/album/vors/1440838790' },
          { title: 'Euro Connection', url: 'https://music.apple.com/dk/album/euro-connection/1440838791' },
        ]
      }
    }
    if (lower.includes('aqua')) {
      return {
        name: 'MØ',
        albums: [
          { title: 'No Mythologies to Follow', url: 'https://music.apple.com/dk/album/no-mythologies-to-follow/1440838792' },
          { title: 'Forever Neverland', url: 'https://music.apple.com/dk/album/forever-neverland/1436075652' },
          { title: 'Motordrome', url: 'https://music.apple.com/dk/album/motordrome/1590035697' },
        ]
      }
    }
    if (lower.includes('loc')) {
      return {
        name: 'Gili',
        albums: [
          { title: 'Carnival', url: 'https://music.apple.com/dk/album/carnival/1440838789' },
          { title: 'Vors', url: 'https://music.apple.com/dk/album/vors/1440838790' },
          { title: 'Euro Connection', url: 'https://music.apple.com/dk/album/euro-connection/1440838791' },
        ]
      }
    }
    if (lower.includes('johnson')) {
      return {
        name: 'Ung Schlippo',
        albums: [
          { title: 'Schlippo Tape Vol. 1', url: 'https://music.apple.com/dk/album/schlippo-tape-vol-1/1701234567' },
          { title: 'Schlippo Tape Vol. 2', url: 'https://music.apple.com/dk/album/schlippo-tape-vol-2/1701234568' },
          { title: 'Schlippo Tape Vol. 3', url: 'https://music.apple.com/dk/album/schlippo-tape-vol-3/1701234569' },
        ]
      }
    }
    // Genre/keyword logic
    if (lower.includes('pop') || lower.includes('dance')) {
      return {
        name: 'Aqua',
        albums: [
          { title: 'Aquarium', url: 'https://music.apple.com/dk/album/aquarium/1440838765' },
          { title: 'Aquarius', url: 'https://music.apple.com/dk/album/aquarius/1440838766' },
          { title: 'Megalomania', url: 'https://music.apple.com/dk/album/megalomania/1440838767' },
        ]
      }
    }
    if (lower.includes('rock') || lower.includes('guitar')) {
      return randomFallbacks[3]; // Gasolin'
    }
    if (lower.includes('jazz')) {
      return {
        name: 'Niels-Henning Ørsted Pedersen',
        albums: [
          { title: 'Jaywalkin', url: 'https://music.apple.com/dk/album/jaywalkin/1440838770' },
          { title: 'Duo', url: 'https://music.apple.com/dk/album/duo/1440838771' },
          { title: 'The Eternal Traveller', url: 'https://music.apple.com/dk/album/the-eternal-traveller/1440838772' },
        ]
      }
    }
    if (lower.includes('electronic') || lower.includes('techno')) {
      return {
        name: 'Trentemøller',
        albums: [
          { title: 'The Last Resort', url: 'https://music.apple.com/dk/album/the-last-resort/1440838773' },
          { title: 'Into the Great Wide Yonder', url: 'https://music.apple.com/dk/album/into-the-great-wide-yonder/1440838774' },
          { title: 'Fixion', url: 'https://music.apple.com/dk/album/fixion/1440838775' },
        ]
      }
    }
    if (lower.includes('indie') || lower.includes('alternative')) {
      return randomFallbacks[2]; // TV-2
    }
    // Fallback: random classic
    return randomFallbacks[Math.floor(Math.random() * randomFallbacks.length)];
  }

  // Helper: is Ung Schlippo favorite
  function isUngSchlippoFavorite(fav: string) {
    return fav.trim().toLowerCase().replace(/\s+/g, '') === 'ungschlippo';
  }

  // Extract day content from ThreeDayOverview
  const ThursdayOverview = () => {
    if (!result) return null;
    const { carbLoading } = result;
    const workout = getWorkoutSuggestion("Thursday");
    const route = getCopenhagenRoute(workout.distance);
    const coffeeRecs = coffeeShops.slice(0, coffeeLove);
    const partyRecs = barList.slice(0, partyLove);
    return (
      <Box mt={8} color="white">
        <Text fontSize="xl" fontWeight="bold" mb={4} fontFamily="Futura, Helvetica, Arial, sans-serif">Thursday (4 days out)</Text>
        <Box bg="red.50" borderLeft="4px solid #E53E3E" p={3} my={2} borderRadius="md" color="black">
          <Text fontWeight="bold" color="red.700">LØBEREN EXPO OPENS: 14:00 – 19:00</Text>
          <Text color="red.700">Kick off the Expo! Be the first to see the world's biggest brands, their newest products, and meet running experts. Get the official race newspaper and limited-edition merchandise.</Text>
        </Box>
        {specialType === 'white-monster' ? (
          <BlueBox>
            <Text fontWeight="bold">Hey {name}, your special recommendation:</Text>
            <Text>• White Monster Energy Drink (2-3 cans)</Text>
          </BlueBox>
        ) : specialType === 'gin' ? (
          <BlueBox>
            <Text fontWeight="bold">Hey {name}, your special recommendation:</Text>
            <Text>• Hendrick's Gin (1 bottle)</Text>
            <Text>• Tanqueray Gin (1 bottle)</Text>
          </BlueBox>
        ) : (
          <BlueBox>
            <Text fontWeight="bold">Coffee tip for {name}:</Text>
            <Text>{coffeeRecs[0]}</Text>
          </BlueBox>
        )}
        <Text mb={1}>• <b>Carb target:</b> {carbLoading.dailyCarbs}g ({carbLoading.dailyCalories} kcal) throughout the day</Text>
        <Text mb={1}>• <b>Workout:</b> {workout.distance}km {workout.intensity} run. Suggested route: {route}</Text>
        <Text mb={1}>• <b>Sleep:</b> Aim for 8+ hours, keep a regular bedtime</Text>
        {partyLove > 0 && (
          <BlueBox>
            <Text fontWeight="bold">Bar tip for {name}:</Text>
            <Text>{partyRecs[0]}</Text>
          </BlueBox>
        )}
      </Box>
    );
  };
  const FridayOverview = () => {
    if (!result) return null;
    const { carbLoading } = result;
    const workout = getWorkoutSuggestion("Friday");
    const route = getCopenhagenRoute(workout.distance);
    const coffeeRecs = coffeeShops.slice(0, coffeeLove);
    const partyRecs = barList.slice(0, partyLove);
    return (
      <Box mt={8} color="white">
        <Text fontSize="xl" fontWeight="bold" mb={4} fontFamily="Futura, Helvetica, Arial, sans-serif">Friday (3 days out)</Text>
        <Box bg="red.50" borderLeft="4px solid #E53E3E" p={3} my={2} borderRadius="md" color="black">
          <Text fontWeight="bold" color="red.700">LØBEREN EXPO OPENS: 12:00 – 19:00</Text>
          <Text color="red.700">Experience the huge running universe. Merch. Newspaper. The biggest and best brands. The party continues.</Text>
          <Text fontWeight="bold" mt={2} color="red.700">SHAKEOUT RUN & CPH MARATHON: 17:00–18:00</Text>
          <Text color="red.700">Everyone is welcome! Get a unique insight into the course, the thoughts behind it, and cool spots along the route. Different pace groups, organized with Sparta. After the run: alcohol-free beer from Erdinger, sausage rolls, and Red Bull. Free, but requires sign up in the Facebook event.</Text>
        </Box>
        {coffeeLove > 1 && (
          <BlueBox>
            <Text fontWeight="bold">Coffee tip:</Text>
            <Text>{coffeeRecs[1 % coffeeRecs.length]}</Text>
          </BlueBox>
        )}
        <Text mb={1}>• <b>Carb target:</b> {carbLoading.dailyCarbs}g ({carbLoading.dailyCalories} kcal) throughout the day</Text>
        <Text mb={1}>• <b>Workout:</b> {workout.distance}km {workout.intensity} run. Suggested route: {route}</Text>
        <Text mb={1}>• <b>Sleep:</b> Prioritize 8+ hours, wind down early</Text>
        {partyLove > 1 && (
          <BlueBox>
            <Text fontWeight="bold">Bar tip:</Text>
            <Text>{partyRecs[1 % partyRecs.length]}</Text>
          </BlueBox>
        )}
      </Box>
    );
  };
  const SaturdayOverview = () => {
    if (!result) return null;
    const { carbLoading } = result;
    const workout = getWorkoutSuggestion("Saturday");
    const route = getCopenhagenRoute(workout.distance);
    const coffeeRecs = coffeeShops.slice(0, coffeeLove);
    const partyRecs = barList.slice(0, partyLove);
    return (
      <Box mt={8} color="white">
        <Text fontSize="xl" fontWeight="bold" mb={4} fontFamily="Futura, Helvetica, Arial, sans-serif">Saturday (2 days out)</Text>
        <Box bg="red.50" borderLeft="4px solid #E53E3E" p={3} my={2} borderRadius="md" color="black">
          <Text fontWeight="bold" color="red.700">LØBEREN EXPO OPENS: 10:00 – 19:00</Text>
          <Text color="red.700">Come and experience the huge running universe!</Text>
          <Text fontWeight="bold" mt={2} color="red.700">FINAL BIB PICK-UP: 17:00 – 19:00</Text>
          <Text color="red.700">The Expo closes at 19:00. If you haven't picked up your race bib, make sure to do so!</Text>
        </Box>
        {coffeeLove > 2 && (
          <BlueBox>
            <Text fontWeight="bold">Coffee tip:</Text>
            <Text>{coffeeRecs[2 % coffeeRecs.length]}</Text>
          </BlueBox>
        )}
        <Text mb={1}>• <b>Carb target:</b> {carbLoading.dailyCarbs}g ({carbLoading.dailyCalories} kcal) throughout the day</Text>
        <Text mb={1}>• <b>Workout:</b> {workout.distance}km {workout.intensity} run. Suggested route: {route}</Text>
        <Text mb={1}>• <b>Sleep:</b> Prioritize 8+ hours, get to bed early</Text>
        {partyLove > 2 && (
          <BlueBox>
            <Text fontWeight="bold">Bar tip:</Text>
            <Text>{partyRecs[2 % partyRecs.length]}</Text>
          </BlueBox>
        )}
      </Box>
    );
  };
  const SundayOverview = () => {
    if (!result) return null;
    const { carbLoading } = result;
    const workout = getWorkoutSuggestion("Sunday");
    const route = getCopenhagenRoute(workout.distance);
    const coffeeRecs = coffeeShops.slice(0, coffeeLove);
    const partyRecs = barList.slice(0, partyLove);
    const showAfterparty = partyLove > 1;
    return (
      <Box mt={8} color="white">
        <Text fontSize="xl" fontWeight="bold" mb={4} fontFamily="Futura, Helvetica, Arial, sans-serif">Sunday (Race Day)</Text>
        <Text mb={1} color="white">• <b>Carb target (breakfast):</b> {carbLoading.breakfastCarbs}g ({carbLoading.breakfastCalories} kcal) 3–4 hours before start</Text>
        <Text mb={1} color="white">• <b>Good carb sources:</b> White bread with jam/honey, Frosties with milk, bananas, Maurten Drink Mix, sports drink</Text>
        <Text mb={1} color="white">• <b>Include Maurten:</b> Maurten Drink Mix or GEL 100 as part of breakfast and pre-race hydration</Text>
        <Text mb={1} color="white">• <b>Workout:</b> {workout.distance}km {workout.intensity} run. Suggested route: {route}</Text>
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

  // On first results page, hide confetti after render
  useEffect(() => {
    if (resultsPage > 0 && showConfetti) {
      setShowConfetti(false)
    }
  }, [resultsPage, showConfetti])

  return (
    <Flex direction="column" align="center" justify="center" width="100%" minH="60vh" p={4} fontFamily="'Lato', Helvetica, Arial, sans-serif" bg={isUngSchlippoFavorite(favoriteArtist) ? '#FFD700' : 'red.700'}>
      {showConfetti && <Confetti />}
      {/* Show animation while loading */}
      {loading && <MathLoadingAnimation />}
      {/* Show form only if not submitted and not loading */}
      {(!hasSubmitted && !loading) && (
        <Box bg={isUngSchlippoFavorite(favoriteArtist) ? '#FFD700' : 'red.700'} p={8} borderRadius="lg" boxShadow="md" border="1px solid" borderColor={isUngSchlippoFavorite(favoriteArtist) ? '#FFD700' : 'red.400'} width="100%" maxW="520px" mx="auto" fontFamily="'Lato', Helvetica, Arial, sans-serif">
          {/* Inspiration disclaimer */}
          <Box mb={6}>
            <Text color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif" fontSize="md" textAlign="center">
              This calculator is just for inspiration – there are many different philosophies on marathon prep and nutrition.
            </Text>
          </Box>
          <WeatherExplanation />
          <Stack spacing={8} width="100%">
            {/* Running Details Section */}
            <Box mb={2}>
              <Text fontSize="xl" fontWeight="bold" mb={2} color="white" fontFamily="Futura, Helvetica, Arial, sans-serif">Running Details</Text>
              <Grid templateColumns="1fr" gap={6} width="100%">
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif">Your Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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
              </Grid>
            </Box>
            {/* Social Details Section */}
            <Box mb={2}>
              <Text fontSize="xl" fontWeight="bold" mb={2} color="white" fontFamily="Futura, Helvetica, Arial, sans-serif">Social Details</Text>
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
                <GridItem>
                  <FormControl>
                    <FormLabel color="white" fontFamily="'Lato', Helvetica, Arial, sans-serif">Your favorite artist</FormLabel>
                    <Input
                      type="text"
                      placeholder="e.g. Beyoncé"
                      value={favoriteArtist}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFavoriteArtist(e.target.value)}
                      bg="white"
                      color="red.700"
                      borderColor="red.300"
                      _placeholder={{ color: 'red.300' }}
                      width="100%"
                      fontFamily="'Lato', Helvetica, Arial, sans-serif"
                    />
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
        <Box bg={isUngSchlippoFavorite(favoriteArtist) ? '#FFD700' : 'red.700'} p={8} borderRadius="lg" boxShadow="md" border="1px solid" borderColor={isUngSchlippoFavorite(favoriteArtist) ? '#FFD700' : 'red.400'} width="100%" maxW="700px" mx="auto" mt={8} fontFamily="'Lato', Helvetica, Arial, sans-serif" color="white">
          <Stack spacing={8} align="center" width="100%">
            {/* Multi-page results */}
            {resultsPage === 0 && (
              <>
                <TravelInfo city={homeCity} />
                <CityComparison city={homeCity} />
                <WeatherForecast />
                {/* Danish artist suggestion */}
                <BlueBox>
                  {(() => {
                    const suggestion = getDanishArtistSuggestion(favoriteArtist);
                    return (
                      <>
                        <Text fontFamily="Futura, Helvetica, Arial, sans-serif" fontWeight="bold" fontSize="lg" mb={1} color="white">
                          If you like <b>{favoriteArtist || 'many artists'}</b>, check out <b>{suggestion.name}</b>!
                        </Text>
                        <Text fontFamily="'Lato', Helvetica, Arial, sans-serif" color="white" mb={1}>
                          Here are three great albums to try on Apple Music:
                        </Text>
                        <Stack spacing={1}>
                          {suggestion.albums.map(album => (
                            <a key={album.url} href={album.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline', fontFamily: 'Lato, Helvetica, Arial, sans-serif' }}>{album.title}</a>
                          ))}
                        </Stack>
                      </>
                    );
                  })()}
                </BlueBox>
                <Button mt={8} colorScheme="whiteAlpha" variant="solid" onClick={() => setResultsPage(1)} fontFamily="Futura, Helvetica, Arial, sans-serif" color="red.700" bg="white" _hover={{ bg: 'red.200' }}>
                  Next: Thursday
                </Button>
              </>
            )}
            {resultsPage === 1 && (
              <>
                <ThursdayOverview />
                <Flex mt={8} width="100%" justify="space-between">
                  <Button colorScheme="whiteAlpha" variant="outline" onClick={() => setResultsPage(0)} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif" color="white" borderColor="white" _hover={{ bg: 'red.600' }}>
                    Back
                  </Button>
                  <Button colorScheme="whiteAlpha" variant="solid" onClick={() => setResultsPage(2)} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif" color="red.700" bg="white" _hover={{ bg: 'red.200' }}>
                    Next: Friday
                  </Button>
                </Flex>
              </>
            )}
            {resultsPage === 2 && (
              <>
                <FridayOverview />
                <Flex mt={8} width="100%" justify="space-between">
                  <Button colorScheme="whiteAlpha" variant="outline" onClick={() => setResultsPage(1)} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif" color="white" borderColor="white" _hover={{ bg: 'red.600' }}>
                    Back
                  </Button>
                  <Button colorScheme="whiteAlpha" variant="solid" onClick={() => setResultsPage(3)} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif" color="red.700" bg="white" _hover={{ bg: 'red.200' }}>
                    Next: Saturday
                  </Button>
                </Flex>
              </>
            )}
            {resultsPage === 3 && (
              <>
                <SaturdayOverview />
                <Flex mt={8} width="100%" justify="space-between">
                  <Button colorScheme="whiteAlpha" variant="outline" onClick={() => setResultsPage(2)} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif" color="white" borderColor="white" _hover={{ bg: 'red.600' }}>
                    Back
                  </Button>
                  <Button colorScheme="whiteAlpha" variant="solid" onClick={() => setResultsPage(4)} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif" color="red.700" bg="white" _hover={{ bg: 'red.200' }}>
                    Next: Sunday
                  </Button>
                </Flex>
              </>
            )}
            {resultsPage === 4 && (
              <>
                <SundayOverview />
                <Flex mt={8} width="100%" justify="space-between">
                  <Button colorScheme="whiteAlpha" variant="outline" onClick={() => setResultsPage(3)} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif" color="white" borderColor="white" _hover={{ bg: 'red.600' }}>
                    Back
                  </Button>
                  <Button colorScheme="whiteAlpha" variant="solid" onClick={() => setResultsPage(5)} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif" color="red.700" bg="white" _hover={{ bg: 'red.200' }}>
                    Next: Race Day Details
                  </Button>
                </Flex>
              </>
            )}
            {resultsPage === 5 && (
              <>
                <RaceDayBreakfastSection />
                <Divider my={6} borderColor="gray.200" />
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
                      {specialType === 'white-monster' ? (
                        `Hey ${name}, you'll need ${result.totalGels} White Monsters in total`
                      ) : specialType === 'gin' ? (
                        `Hey ${name}, you'll need ${result.totalGels} bottles of Gin in total (${result.regularGels} Hendrick's and ${result.caffeineGels} Tanqueray)`
                      ) : (
                        `You will need ${result.totalGels} gels in total (${result.regularGels} regular ${brand} ${brand === 'Maurten' ? 'GEL 100' : 'PowerGel Original'} and ${result.caffeineGels} ${brand} ${brand === 'Maurten' ? 'CAF 100' : 'PowerGel Hydro Caffeine'})`
                      )}
                    </span>
                  </Alert>
                  <Text fontSize="lg" mb={2} color="white">
                    Recommended hydration: {result.hydrationPerHour}ml per hour
                  </Text>
                  <Divider my={4} borderColor="gray.200" />
                  <Text fontSize="lg" fontWeight="bold" mb={2} color="white" fontFamily="Futura, Helvetica, Arial, sans-serif">
                    {specialType === 'white-monster' ? 'White Monster Timeline:' : specialType === 'gin' ? 'Gin Timeline:' : 'Gel Timeline:'}
                  </Text>
                  <Stack spacing={2}>
                    {result.timeline.map((time, index) => {
                      const [timeStr, action] = time.split(' - ');
                      const newAction = specialType === 'white-monster' 
                        ? `Drink White Monster #${index + 1}`
                        : specialType === 'gin'
                        ? `Drink ${index < result.regularGels ? 'Hendrick\'s' : 'Tanqueray'} Gin #${index + 1}`
                        : action;
                      return (
                        <Text 
                          key={index} 
                          color="white" 
                          fontFamily="'Lato', Helvetica, Arial, sans-serif"
                        >
                          {`${timeStr} - ${newAction}`}
                        </Text>
                      );
                    })}
                  </Stack>
                </Box>
                {/* Coffee recommendations in Lato */}
                <Box width="100%" fontFamily="'Lato', Helvetica, Arial, sans-serif">
                  <Divider my={6} borderColor="gray.200" />
                  <Text fontSize="xl" fontWeight="bold" mb={2} color="white" fontFamily="Futura, Helvetica, Arial, sans-serif">
                    Coffee Recommendations in Copenhagen
                  </Text>
                  <List spacing={2} color="white">
                    {coffeeShops.slice(0, coffeeLove).map((shop) => (
                      <ListItem key={shop}>
                        <ListIcon as={CheckCircleIcon} color="red.500" />
                        {shop}
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Flex mt={8} width="100%" justify="space-between">
                  <Button colorScheme="whiteAlpha" variant="outline" onClick={() => setResultsPage(4)} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif" color="white" borderColor="white" _hover={{ bg: 'red.600' }}>
                    Back
                  </Button>
                  <Button colorScheme="gray" variant="outline" onClick={() => { setHasSubmitted(false); setResult(null); setLoading(false); setResultsPage(0); }} fontFamily="'Fjalla One', Helvetica, Arial, sans-serif">
                    Recalculate
                  </Button>
                </Flex>
              </>
            )}
          </Stack>
        </Box>
      )}
    </Flex>
  )
}

export default MarathonCalculator 