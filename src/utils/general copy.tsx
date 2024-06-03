import { Dispatch, SetStateAction } from 'react'
import bsv from 'bsv'
import { Asset, BTMS } from '../../../btms-core/out/src'
import { error } from 'console'
import { BORDER_RADIUS, MOCK_ASSET_NAMES, MOCK_PEOPLE, MOCK_PEOPLE_IMAGES, MOCK_TOKEN_DEFAULT_IMAGE, MOCK_TOKEN_IMAGES } from './constants'

export const imageBadge = (
	src: string | undefined = MOCK_TOKEN_DEFAULT_IMAGE,
	alt: string = '',
	side: string = '',
	margin: string = '',
	assets: Asset[] = []
) => {
	return (
		<div
			style={{
				width: side,
				minWidth: side,
				height: side,
				backgroundColor: '#4e4e4e',
				padding: '0.5em',
				borderRadius: BORDER_RADIUS,
				display: assets && assets.length % 2 === 0 && false ? 'none' : 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				margin: margin
			}}
		>
			<img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
		</div>
	)
}

export const fetchAssets = async (
	btms: BTMS,
	balanceTextToNameMap: {[key: string]: string},
	filteredNames: string[] = [],
	availableText: string = '',
	available: {[key: string]: number},
	label: string = '',
	setShowProgress: React.Dispatch<React.SetStateAction<boolean>>,
	setBalanceTextToNameMap: React.Dispatch<React.SetStateAction<{[key: string]: string}>>,
	setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
	setAvailable: React.Dispatch<React.SetStateAction<{[key: string]: number}>>
) => {
	//available[defaultAsset.assetId] = defaultAsset.balance
	try {
		setShowProgress(true)
		const fetchedAssets = await mockFetchAssets(btms, filteredNames)
		setShowProgress(false)
		const updatedBalanceTextToNameMap = { ...balanceTextToNameMap }
		fetchedAssets.forEach((asset) => {
			if (!updatedBalanceTextToNameMap[asset.assetId]) {
				updateStringRecord(asset.assetId, availableText, setBalanceTextToNameMap)
				//updatedBalanceTextToNameMap[asset.assetId] = availableText
				updateNumberRecord(asset.assetId, asset.balance, setAvailable)
			}
		})
		//setBalanceTextToNameMap(updatedBalanceTextToNameMap)
		setAssets((prevAssets) => [...prevAssets, ...fetchedAssets])
	} catch (error) {
		console.error(`Error fetching ${label} assets:`, error)
	}
}

// Utility function to copy an array of Asset objects
export const copyAssetArray = (originalArray: Asset[]): Asset[] => {
  // Create a new array to hold the copied Asset objects
  const copiedArray: Asset[] = []

  // Iterate over each Asset in the original array
  originalArray.forEach((asset) => {
    // Create a deep copy of the Asset object
    const copiedAsset: Asset = {
      ...asset, // Copy all properties of the original Asset
    }

    // Push the copied Asset object into the new array
    copiedArray.push(copiedAsset)
  })

  // Return the new array containing copied Asset objects
  return copiedArray
}

export const copyAsset = (asset: Asset): Asset => {
// Create a deep copy of the Asset object
	const copiedAsset: Asset = {
	...asset, // Copy all properties of the original Asset
	}
return copiedAsset
}

export const getAsset = (assets: Asset[], assetId: string) : Asset => {
	try {
		const index: number =  assets.findIndex(asset => asset.assetId === assetId)
		return assets[index] || undefined
	} catch {
		console.error('Problem finding asset with assetId:', assetId)
		throw error('Problem finding asset with assetId:', assetId)
	}
}

export const getAssetListIndexFromAsset = (assets: Asset[], selectedAsset: Asset) : number => {
	return assets.findIndex(asset => asset.assetId === selectedAsset.assetId)
}

export const getAssetListIndexFromAssetId = (assets: Asset[], assetId: string) : number => {
	return assets.findIndex(asset => asset.assetId === assetId)
}

export const updateNewAssetNumberProp = (assets: Asset[], assetId: string, value: number, prop: string) => {
	try {
		const selectedAsset = getAsset(assets, assetId)
		const newAsset: Asset = {
			...selectedAsset,
			[prop]: value,
		}
	return newAsset || undefined
	} catch (e){
		console.error(`asset with ${assetId} not found in assets`)

	}
}

export const updateExistingAssetNumberProp = (assets: Asset[], assetId: string, value: number, prop: string) => {
	try {
		const updatedAssets: Asset[] = assets.map(asset =>
			asset.assetId === assetId ? { ...asset, [prop]: value } : asset	
		)
		return updatedAssets
	} catch (e){
		console.error(`asset with ${assetId} not found in assets`)
		throw error(`asset with ${assetId} not found in assets`)
	}
}

export const updateAssetWithRemainderBalance = (
  dbg: boolean,
  assets: Asset[],
  assetId: string,
  balance: number,
  setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>
) => {

	// Create a new asset with the updated balance or update existing asset in list
  if (getAssetListIndexFromAssetId(assets, assetId) === -1) {
    const updatedAsset = updateNewAssetNumberProp(assets, assetId, balance, 'balance');
    if (updatedAsset) {
      setAssetsWithAmounts([...assets, updatedAsset]);
    } else {
      console.error('updateAssetWithRemainderBalance(): Failed to update new asset');
    }
  } else {
    const updatedAssets = updateExistingAssetNumberProp(assets, assetId, balance, 'balance');
    if (updatedAssets) {
      setAssetsWithAmounts(updatedAssets);
    } else {
      console.error('updateAssetWithRemainderBalance(): Failed to update existing asset');
    }
  }
}


export const updateAssetWithAmountBalance = (
  dbg: boolean,
  assets: Asset[],
  assetsWithAmounts: Asset[],
  assetId: string,
  balance: number,
  setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>
) => {

	// Create a new asset with the updated balance or update existing asset in list
  if (getAssetListIndexFromAssetId(assetsWithAmounts, assetId) === -1) {
    const updatedAsset = updateNewAssetNumberProp(assets, assetId, balance, 'balance');
    if (updatedAsset) {
      setAssetsWithAmounts([...assetsWithAmounts, updatedAsset]);
    } else {
      console.error('updateAssetWithAmountBalance(): Failed to update new asset');
    }
  } else {
    const updatedAssets = updateExistingAssetNumberProp(assetsWithAmounts, assetId, balance, 'balance');
    if (updatedAssets) {
      setAssetsWithAmounts(updatedAssets);
    } else {
      console.error('updateAssetWithAmountBalance(): Failed to update existing asset');
    }
  }
}

export const updateAssetWithOriginalBalance = (
	assets: Asset[],
	assetId: string,
	balance: number,
	setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>
) => {
	// Create a new asset with the updated balance or update existing asset in list
	if (getAssetListIndexFromAssetId(assets, assetId) === -1) {
		const updatedAssets = updateNewAssetNumberProp(assets , assetId, balance, 'balance')
		setAssetsWithAmounts([...assets, updatedAssets])
	} else {
		const updatedAssets = updateExistingAssetNumberProp(assets, assetId, balance, 'balance')
		setAssetsWithAmounts(updatedAssets)		
	}
}

export const updateBooleanRecord = (
	assetId: string,
	record: boolean,
	setRecords: React.Dispatch<React.SetStateAction<{ [assetId: string]: boolean }>>
) => {
	setRecords((prevRecords) => ({
		...prevRecords,
		[assetId]: record,
	}))
	return record
}

export const updateStringRecord = (
	assetId: string,
	record: string,
	setRecords: React.Dispatch<React.SetStateAction<{ [assetId: string]: string }>>
) => {
	setRecords((prevRecords) => ({
		...prevRecords,
		[assetId]: record,
	}))
	return record
}

export const updateNumberRecord = (
	assetId: string,
	record: number,
	setRecords: React.Dispatch<React.SetStateAction<{ [assetId: string]: number }>>
) => {
	setRecords((prevRecords) => ({
		...prevRecords,
		[assetId]: record,
	}))
	return record
}

export const updateAssetProp = (
	selectedAsset: Asset,
	prop: string,
	value: string | number,
	setAssetsWithAmounts: Dispatch<SetStateAction<Asset[]>>,
	assetsWithAmounts: Asset[],
	assetIndex: number
) => {
	//console.log('updateAssetProp():assetIndex=', assetIndex)
	if (assetIndex !== -1) {
		// Update the balance (or specified property) of the existing asset
		const updatedAssets: Asset[] = assetsWithAmounts.map(asset =>
			asset.assetId === selectedAsset.assetId ? { ...asset, [prop]: value } : asset
		)
		setAssetsWithAmounts(updatedAssets)
	} else {
		// Create a new asset with the updated balance (or specified property)
		const newAsset: Asset = {
			...selectedAsset,
			[prop]: value,
		}
		setAssetsWithAmounts([...assetsWithAmounts, newAsset])
		//console.log('updateAssetProp():newAsset=', newAsset)
		// Add the new asset to the existing array of assets
	}
	//console.log('updateAssetProp():assetsWithAmounts=', assetsWithAmounts)
}

export const removeNumberElementFromRecords = (
	records: { [assetId: string]: number },
	keyToRemove: string) => {
  // Use destructuring to create a copy of the current state object
  const updatedRecords = { ...records }

  // Check if the key to remove exists in the state object
  if (keyToRemove in updatedRecords) {
    // Use the 'delete' operator to remove the key from the copied object
    delete updatedRecords[keyToRemove]

    // Update the state with the modified object (without the removed key)
    return updatedRecords
  } else {
    console.error(`Key '${keyToRemove}' does not exist in 'remainders'.`)
  }
}

export const mockFetchAssets = async (btms: BTMS, filteredNames: string[] ): Promise<Asset[]> => {
	let fetchAssets = await btms.listAssets()
	//console.log('before fetchAssets=', fetchAssets)

	if (filteredNames) {
		fetchAssets = fetchAssets.filter((asset: Asset) => {
			// Check if asset name is not in FILTERED_NAMES
			return asset.name && filteredNames.indexOf(asset.name) === -1
		})
	}

	//console.log('after fetchAssets=', fetchAssets)
	return fetchAssets
}

export const removeAsset = (assets: Asset[], assetIdToRemove: string): Asset[] => {
	try {
	  // Find the index of the asset with the specified assetId
	  const indexToRemove = assets.findIndex(asset => asset.assetId === assetIdToRemove)
  	  //console.log('remove indexToRemove=', indexToRemove)

	  if (indexToRemove === -1) {
		throw new Error(`Asset with assetId ${assetIdToRemove} not found in assets while removing`)
	  }
  
	  // Create a new array by slicing the assets array to exclude the asset at indexToRemove
	  //console.log('...assets.slice(0, indexToRemove)=', ...assets.slice(0, indexToRemove))
	  //console.log('...assets.slice(indexToRemove + 1)=', ...assets.slice(indexToRemove + 1))

	  const updatedAssets = [
		...assets.slice(0, indexToRemove),
		...assets.slice(indexToRemove + 1)
	  ]
  
	  //console.log('updatedAssets=', updatedAssets)
	  return updatedAssets
	} catch (error) {
	  console.error(`Error removing asset with assetId ${assetIdToRemove}:`, error)
	  throw error // Rethrow the error to handle it outside the function if needed
	}
}

export const removeAssetWithAmount = (
	assets: Asset[],
	assetId: string,
	setAssetsWithAmounts: Dispatch<SetStateAction<Asset[]>>
) => {
	//console.log('remove assetId=', assetId)
	//console.log('remove assets before=', assets)
	const updatedAssets = removeAsset(assets, assetId)
	setAssetsWithAmounts(updatedAssets)
	//console.log('remove assets after=', assets)
}

export const isStringNumber = (str: string): boolean => {
	const num = parseInt(str, 10)
	return !isNaN(num)
}

const assetIdFromName = (assets: Asset[], name: string) => {
  const asset = assets.find(asset => asset.name === name)
  return asset ? asset.assetId : undefined
}

export const chars = (s: string, n: number) => {
  if (n <= 0) return ''
  return s.repeat(n)
}

export const int = (n: number) => {
  return Math.floor(n)
}

export const randomNumber = (max: number) => Math.floor(Math.random() * max)

export const isEven = (n: number) => n % 2 === 0

const MOCK_ASSET_OWNERS = [MOCK_PEOPLE[0], MOCK_PEOPLE[1], MOCK_PEOPLE[2], , MOCK_PEOPLE[3]]

export interface Person {
  identity: string
  firstName?: string
  lastName?: string
  isTrusted?: boolean
  iconURL?: string
}

export interface AssetOwned {
  assetId: string
  amount: number
}

export interface AssetOwner {
  readonly identity: string
}

export interface AssetPriceOrOffer {
  offeredAsset: OfferedAsset
  readonly isPrice: boolean
}

export interface OfferedAssets {
  readonly list: OfferedAsset[]
}

export interface OfferedAsset {
  readonly assetId: string
  amount: number
}

export interface AcceptedAssets {
  readonly list: AcceptedAsset[]
}

export interface AcceptedAsset {
  readonly assetId: string
  amount: number
}

const generateRandomHex = (): string => {
  let hex = '1'
  for (let i = 0; i < 31; i++) {
    hex += Math.floor(Math.random() * 16).toString(16)
  }
  return hex
}

export const mockFetchPeople = (): Person[] => {
  const people: Person[] = []
  MOCK_PEOPLE.forEach((person) => {
    const [firstName, lastName] = person.split(' ')
    people.push({
      identity: generateRandomHex(),
      firstName,
      lastName,
      iconURL: MOCK_PEOPLE_IMAGES[`${firstName} ${lastName}`],
    })
  })
  return people
}

export const identityFromName = (people: Person[], name: string): string | undefined => {
  const person = people.find((p) => `${p.firstName} ${p.lastName}` === name)
  return person ? person.identity : undefined
}

export const nameFromIdentity = (people: Person[], identity: string): string | undefined => {
  const person = people.find((p) => p.identity === identity)
  return person ? `${person.firstName} ${person.lastName}` : undefined
}

export const mockAssetOwnerMap = (
  people: Person[],
  assets: Asset[]
): {
  byIdentity: { [identity: string]: AssetOwned[] }
  byAssetId: { [assetId: string]: AssetOwner[] }
} => {
  const assetOwnerMapByIdentity: { [identity: string]: AssetOwned[] } = {}
  const assetOwnerMapByAssetId: { [assetId: string]: AssetOwner[] } = {}

  MOCK_ASSET_OWNERS.forEach((name) => {
    const identity = name ? identityFromName(people, name) : undefined
    if (identity) {
      assetOwnerMapByIdentity[identity] = []
      const assetsCount = randomNumber(assets.length) + 2
      for (let i = 0; i < assetsCount; i++) {
        let randomAssetId: string
        do {
          const randomAssetNumber = randomNumber(assets.length)
          randomAssetId = assets[randomAssetNumber].assetId
        } while (assetOwnerMapByIdentity[identity].some((asset) => asset.assetId === randomAssetId))

        const assetOwned = { assetId: randomAssetId, amount: 0 } // Default 0 required

        assetOwnerMapByIdentity[identity].push(assetOwned)
        if (!assetOwnerMapByAssetId[randomAssetId]) {
          assetOwnerMapByAssetId[randomAssetId] = []
        }
        assetOwnerMapByAssetId[randomAssetId].push({ identity })
      }
    }
  })

  //console.log('mockAssetOwnerMap():assetOwnerMapByIdentity=', assetOwnerMapByIdentity)
  //console.log('mockAssetOwnerMap():assetOwnerMapByAssetId=', assetOwnerMapByAssetId)
  return { byIdentity: assetOwnerMapByIdentity, byAssetId: assetOwnerMapByAssetId }
}

export const getAssetFromOwnerMap = (
  assetOwnerMapByAssetId: { [assetId: string]: AssetOwned },
  assetId: string
): AssetOwned | undefined => {
  return assetOwnerMapByAssetId[assetId]
}

export const getIdentityFromOwnerMap = (
  assetOwnerMapByAssetId: { [assetId: string]: AssetOwner[] },
  assetId: string
): string[] | undefined => {
  const owners = assetOwnerMapByAssetId[assetId]
  return owners ? owners.map(owner => owner.identity) : undefined
}

export const getNameFromAssetOwners = (
  assetOwnerMapByIdentity: { [identity: string]: AssetOwned[] },
  people: Person[],
  assetId: string
): string | undefined => {
  for (const [identity, assets] of Object.entries(assetOwnerMapByIdentity)) {
    if (assets.some((asset) => asset.assetId === assetId)) {
      const person = people.find(p => p.identity === identity)
      return person ? `${person.firstName} ${person.lastName}` : undefined
    }
  }
  return undefined
}

export const randomBoolean = () => Math.random() < 0.5

export const randomAsset = (assets: Asset[]): Asset => {
	return assets[randomNumber(assets.length - 1)]
}

export const randomAssetNotCurrentAsset = (assets: Asset[], currentAssetId: string): Asset => {
	let $randomAsset = randomAsset(assets)
	while ($randomAsset.assetId === currentAssetId) {
		$randomAsset = randomAsset(assets)
	}
	return $randomAsset
}

export const mockAssetPriceOrOfferMap = (assets: Asset[]): { [assetId: string]: AssetPriceOrOffer } => {
  const assetPriceOrOfferMap: { [assetId: string]: AssetPriceOrOffer } = {}

  assets.forEach((asset) => {
    assetPriceOrOfferMap[asset.assetId] = {
      offeredAsset: {
				assetId: asset.assetId,
	      amount: randomNumber(32) + 1
			},
			isPrice: randomBoolean()
    }
  })

  console.log('mockAssetPriceOrOfferMap():assetPriceOrOfferMap=', assetPriceOrOfferMap)
  return assetPriceOrOfferMap
}

/*
// Example usage within a function where person and asset are defined
const handleSellingDetails = (
  person: Person,
  asset: Asset,
  assetOwnerMapByIdentity: { [identity: string]: AssetOwned[] }
) => {
  if (assetOwnerMapByIdentity[person.identity] && assetOwnerMapByIdentity[person.identity].length > 0) {
    const sellerIdentity = assetOwnerMapByIdentity[person.identity][0].assetId
    const sellerName = nameFromIdentity(mockFetchPeople(), person.identity)
    sellingDetails(asset.assetId, sellerName || 'Unknown', sellerIdentity)
  } else {
    console.error('No assets found for this person.')
  }
}

// Example data
const people = mockFetchPeople()
const assets = MOCK_ASSET_NAMES.map(name => ({ assetId: generateRandomHex(), name }))
const { byIdentity: assetOwnerMapByIdentity } = mockAssetOwnerMap(people, assets)

// Example person and asset
const examplePerson = people[0]
const exampleAsset = assets[0]

// Call the function
handleSellingDetails(examplePerson, exampleAsset, assetOwnerMapByIdentity)

function sellingDetails(assetId: string, arg1: string, sellerIdentity: string) {
	throw new Error('Function not implemented.')
}
*/
