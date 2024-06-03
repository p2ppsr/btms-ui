import { Asset } from '../../../btms-core/out/src'

interface Constants {
  confederacyURL: string
  peerservURL: string
}

export const BORDER_RADIUS = '0.8em'
export const BORDER_RADIUS_DOUBLE = '1.0em'
export const OFFERED_TEXT = 'offer'
export const ACCEPTED_TEXT = 'accept'
export const AVAILABLE_TEXT = 'available'
export const REMAINDER_TEXT = 'remainder'

export const DEFAULT_ASSET: Asset = {assetId: 'usd', name: 'USD', balance: 0}

export const MOCK_TOKEN_DEFAULT_IMAGE = 'mock/tokenIcon-A1.png'

export const MOCK_TOKEN_IMAGES = {
	HODL: 'mock/hodl.jpg',
	DOTI: 'mock/doti.webp',
	OJBK: 'mock/ojbk.webp',
	BAMBOO: 'mock/bamboo.webp',
  BAB: 'mock/tokenIcon-A1.png',
  Finn: 'mock/tokenIcon-A1.png',
	'French Fries': 'mock/french-fries.png',
	'French Lessons': 'mock/french-lessons.png',
	Ketchup: 'mock/ketchup.jpg',
  Broccoli: 'mock/broccoli.png',
  'Piano Lesson': 'mock/piano-lesson.webp',
  'Microwaveable Burrito': 'mock/microwaveable-burrito.webp',
  'Snow shovels': 'mock/snow-shovels.webp',
  'Parkour Training': 'mock/parkour-training.webp',
  'Cheese puffs': 'mock/cheese-puffs.jpg'
}

export const MOCK_PEOPLE_IMAGES = {
  'Leslie Warren' : 'mock/leslie-warren.jpg',
  'Easher Howard': 'mock/esther-howard.jpg',
  'Guy Walkings' : 'mock/guy-walkings.jpg',
  'Jack Jones' : 'mock/jack-jones.jpg',
}

export const MOCK_PEOPLE = ['Leslie Warren', 'Easher Howard', 'Guy Walkings', 'Jack Jones', 'Bob Bob']
export const MOCK_ASSET_NAMES = ['HODL', 'DOTI', 'OJBK', 'BAMBOO', 'BAB', 'Finn', 'French Fries', 'French Lessons', 'Ketchup', 'Broccoli', 'Piano Lesson', 'Microwaveable Burrito', 'Snow shovels', 'Parkour Training']
export const FILTERED_NAMES_OFFER = ['DOTI', 'OJBK', 'BAMBOO', 'BAB', 'Ketchup', 'Microwaveable Burrito']
export const FILTERED_NAMES_ACCEPT = ['French Fries']

let constants: Constants

if (
  window.location.host.startsWith('localhost')
  || window.location.host.startsWith('staging')
  || process.env.NODE_ENV === 'development'
) {
  // local
  constants = {
    confederacyURL: 'https://staging-confederacy.babbage.systems',
    peerservURL: 'https://staging-peerserv.babbage.systems'
  }
} else {
  // production
  constants = {
    confederacyURL: 'https://confederacy.babbage.systems',
    peerservURL: 'https://peerserv.babbage.systems'
  }
}

export default constants
