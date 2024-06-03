import React, { useState, useEffect } from 'react'
import { Grid, Typography, LinearProgress, IconButton, Box } from '@mui/material'
import ViewListIcon from '@mui/icons-material/ViewListRounded'
import ViewGridIcon from '@mui/icons-material/ViewModuleRounded'
import { BTMS, Asset } from '../../../btms-core/out/src'
import { ThemeProvider } from '@mui/material/styles'
import web3Theme from '../theme'
import SearchBar from './SearchBar'
import MarketplaceListingsTable from './MarketplaceListingsTable'
import Button from './Button'
import {
  AVAILABLE_TEXT,
  MOCK_TOKEN_IMAGES,
} from '../utils/constants'

import {
  fetchAssets,
  mockFetchAssets,
  mockAssetPriceOrOfferMap,
  mockAssetOwnerMap,
  AssetPriceOrOffer,
  AssetOwned,
  getAsset,
  updateStringRecord,
  mockFetchPeople,
  Person,
  AssetOwner,
} from '../utils/general'
import { useHistory } from 'react-router-dom'
import ButtonPair from './ButtonPair'
import PeopleAndAssetsTable from './PeopleAndAssetsTable'
import PersonCreateOfferPopup from './PersonCreateOfferPopup'
//import { IdentityCard } from 'metanet-identity-react' // TBD

const SEARCH_USE_FILTERS_TEXT = 'Select filter (People/Assets) ->'
const SEARCH_ASSETS_TEXT = 'Search for assets'
const SEARCH_PEOPLE_TEXT = 'Search for people'
const SEARCH_PEOPLE_AND_ASSETS_TEXT = 'search for people & assets'
const DEFAULT_LABEL = 'listing'

interface MarketplaceSearchProps {
  btms: BTMS
}

const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({ btms }) => {
  const [showProgress, setShowProgress] = useState<boolean>(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [assetsListing, setAssetsListing] = useState<Asset[]>([])
  const [assetsLabelMap, setAssetsLabelMap] = useState<{ [key: string]: string }>({})
  const [assetsLisitingLabelMap, setAssetsLisitingLabelMap] = useState<{ [key: string]: string }>({})
  const [isFocusedSearchBar, setIsFocusedSearchBar] = useState<boolean>(false)
  const [available, setAvailable] = useState<{ [key: string]: number }>({})
  const [valueSearchBar, setValueSearchBar] = useState<string>(SEARCH_USE_FILTERS_TEXT)
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>('')
  const [rowSelectedAssetId, setRowSelectedAssetId] = useState<{ assetId: string; balance: number } | null>(null)
  const [doLeaveRowSelected, setDoLeaveRowSelected] = useState<boolean>(false)
  const [isAssetNotDefined, setIsAssetNotDefined] = useState<boolean>(false)
  const [isList, setIsList] = useState<boolean>(true)
  const [assetPriceOrOfferMap, setAssetPriceOrOfferMap] = useState<{ [assetId: string]: AssetPriceOrOffer }>({})
  const [assetOwnerMapByIdentity, setAssetOwnerMapByIdentity] = useState<{ [identity: string]: AssetOwned[] }>({})
  const [assetOwnerMapByAssetId, setAssetOwnerMapByAssetId] = useState<{ [assetId: string]: AssetOwner[] }>({})
  const [isFilterPeopleOn, setIsFilterPeopleOn] = useState<boolean>(true)
  const [isFilterAssetsOn, setIsFilterAssetsOn] = useState<boolean>(true)
  const [isPersonCreateOfferPopupOpen, setIsPersonCreateOfferPopupOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const history = useHistory()

  const handleRowAssetClick = (assetId: string, balance: number) => {}

  useEffect(() => {
    const loadAssets = async () => {
      setShowProgress(true)
      try {
        const newAssets = await mockFetchAssets(btms, [])
        const newPeople = mockFetchPeople()
        setAssets(newAssets)
        setPeople(newPeople)
        setAssetPriceOrOfferMap(mockAssetPriceOrOfferMap(newAssets))
        const { byIdentity, byAssetId } = mockAssetOwnerMap(newPeople, newAssets)
        setAssetOwnerMapByIdentity(byIdentity)
        setAssetOwnerMapByAssetId(byAssetId)
        const updatedBalanceTextTo = { ...assetsLabelMap }
        newAssets.forEach((asset) => {
          updatedBalanceTextTo[asset.assetId] = AVAILABLE_TEXT
        })
        setAssetsLabelMap(updatedBalanceTextTo)
      } catch (error) {
        console.error('Error fetching assets:', error)
      } finally {
        setShowProgress(false)
      }
    }

    loadAssets()
  }, [btms])

  const handleOnChangeSearchBar = async (text: string) => {
    try {
      setValueSearchBar(text)
      setShowProgress(true)
      let fetchedAssets = await mockFetchAssets(btms, [])
      setShowProgress(false)

      fetchedAssets.forEach((asset) => {
        available[asset.assetId] = asset.balance
      })

      if (text !== '*') {
        fetchedAssets = fetchedAssets.filter((asset) =>
          asset.name?.toLowerCase().includes(text.toLowerCase())
        )
      }

      const updatedBalanceTextTo = { ...assetsLabelMap }
      fetchedAssets.forEach((asset) => {
        updatedBalanceTextTo[asset.assetId] = AVAILABLE_TEXT
      })
      setAssetsLabelMap(updatedBalanceTextTo)
      setAssets(fetchedAssets)
      setAssetPriceOrOfferMap(mockAssetPriceOrOfferMap(fetchedAssets))
      let fetchedPeople = mockFetchPeople()
      if (text !== '*') {
        fetchedPeople = fetchedPeople.filter((person) =>
          `${person.firstName} ${person.lastName}`.toLowerCase().includes(text.toLowerCase())
        )
      }
      setPeople(fetchedPeople)
      const { byIdentity, byAssetId } = mockAssetOwnerMap(fetchedPeople, fetchedAssets)
      setAssetOwnerMapByIdentity(byIdentity)
      setAssetOwnerMapByAssetId(byAssetId)
    } catch (error) {
      console.error('Error fetching assets:', error)
    }
  }

  const handleClearSearchBar = () => {
    setAssets([])
  }

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person)
    handlePersonCreateOfferPopup()
  }

  const handleSelectedAsset = (assetId: string) => {
    setSelectedAssetId(assetId)
    setAssetsListing([...assetsListing, getAsset(assets, assetId)])
    updateStringRecord(assetId, AVAILABLE_TEXT, setAssetsLisitingLabelMap)
  }

  const handleOnClickListAssets = () => {
    history.push('/listassets')
  }

  const iconButtonStyle = {
    padding: '0',
    cursor: 'pointer',
    color: isList ? '#4e4e4e' : '#fff',
    fontSize: '3em',
    marginTop: '-0.2em',
    backgroundColor: isList ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
  }

  const selectedIconButtonStyle = {
    ...iconButtonStyle,
    color: isList ? '#fff' : '#4e4e4e',
    backgroundColor: isList ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
  }

  const handleOnClickFilterPeople = (): void => {
    if (valueSearchBar === SEARCH_USE_FILTERS_TEXT && !isFilterPeopleOn && !isFilterAssetsOn) {setValueSearchBar(SEARCH_PEOPLE_TEXT)}
    else if (valueSearchBar === SEARCH_PEOPLE_TEXT && isFilterPeopleOn && !isFilterAssetsOn) {setValueSearchBar(SEARCH_USE_FILTERS_TEXT)}
    else if (valueSearchBar === SEARCH_ASSETS_TEXT && !isFilterPeopleOn && isFilterAssetsOn) {setValueSearchBar(SEARCH_PEOPLE_AND_ASSETS_TEXT)}
    else if (valueSearchBar === SEARCH_PEOPLE_AND_ASSETS_TEXT && isFilterPeopleOn && isFilterAssetsOn) {setValueSearchBar(SEARCH_ASSETS_TEXT)}
    setIsFilterPeopleOn(!isFilterPeopleOn)
  }

  const handleOnClickFilterAssets = (): void => {
     if (valueSearchBar === SEARCH_USE_FILTERS_TEXT && !isFilterPeopleOn && !isFilterAssetsOn) {setValueSearchBar(SEARCH_ASSETS_TEXT)}
    else if (valueSearchBar === SEARCH_ASSETS_TEXT && !isFilterPeopleOn && isFilterAssetsOn) {setValueSearchBar(SEARCH_USE_FILTERS_TEXT)}
    else if (valueSearchBar === SEARCH_PEOPLE_TEXT && isFilterPeopleOn && !isFilterAssetsOn) {setValueSearchBar(SEARCH_PEOPLE_AND_ASSETS_TEXT)}
    else if (valueSearchBar === SEARCH_PEOPLE_AND_ASSETS_TEXT && isFilterPeopleOn && isFilterAssetsOn) {setValueSearchBar(SEARCH_PEOPLE_TEXT)}
    setIsFilterAssetsOn(!isFilterAssetsOn)
  }

  const handlePersonCreateOfferPopup = () => {
    setIsPersonCreateOfferPopupOpen(true)
  }

  const handleClosePersonCreateOfferPopup = () => {
    setIsPersonCreateOfferPopupOpen(false)
  }

  
  return (
    <ThemeProvider theme={web3Theme}>
      <Box sx={{ padding: '2em', backgroundColor: '#1c1c1c' }}>
        <Grid container spacing={1} style={{ opacity: isPersonCreateOfferPopupOpen ? 0.4 : 1 }}>
          <Grid item xs={12} paddingTop='0.1em' paddingBottom='2em'>
            <img src='/BTMS-logo.png' alt='BTMS Logo' width={'100px'} />
          </Grid>
          <Grid item xs={5}>
            <SearchBar
              value={valueSearchBar}
              showProgress={showProgress}
              initialText={valueSearchBar}
              handleOnChange={handleOnChangeSearchBar}
              handleClear={handleClearSearchBar}
              setValue={setValueSearchBar}
              setIsFocused={setIsFocusedSearchBar}
            />
          </Grid>
          <Grid item xs={3}>
            <ButtonPair
              isDisabled={false}
              isOneOn={isFilterPeopleOn}
              isTwoOn={isFilterAssetsOn}
              labelOne='People'
              labelTwo='Assets'
              //justifyContent='center'
              handleOnClickOne={handleOnClickFilterPeople}
              handleOnClickTwo={handleOnClickFilterAssets}
              //border='1px solid #fff'
              padding='0.2em'
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              isDisabled={false}
              label='+ New Asset'
              justifyContent='flex-end'
              handleOnClick={handleOnClickListAssets}
            />
          </Grid>
          <Grid item xs={5}>
            {(isFilterAssetsOn && assets.length > 0
              || isFilterPeopleOn && people.length > 0)
              && <PeopleAndAssetsTable
                isAssetFilter={isFilterAssetsOn}
                isPeopleFilter={isFilterPeopleOn}
                doLeaveRowSelected={doLeaveRowSelected}
                isAssetNotDefined={isAssetNotDefined}
                label={DEFAULT_LABEL}
                assets={assets}
                people={people}
                balanceTextToNameMap={assetsLabelMap}
                rowSelectedAssetId={rowSelectedAssetId}
                selectedElementId={selectedAssetId ? selectedAssetId : ''}
                mockTokenImages={MOCK_TOKEN_IMAGES}
                handleSelectedAsset={handleSelectedAsset}
                handleSelectedPerson={handleSelectedPerson}
                setRowSelectedAssetId={setRowSelectedAssetId}
                onRowAssetClick={handleRowAssetClick}
                setDoLeaveRowSelected={setDoLeaveRowSelected}
              />
            }
          </Grid>
          <Grid item xs={7} />
          <Grid item xs={5}>
            <Typography variant='h3' paddingTop='0.1em'>
              Marketplace
            </Typography>
          </Grid>
          <Grid container item xs={7} justifyContent='flex-end'>
            <IconButton
              onClick={() => setIsList(true)}
              style={selectedIconButtonStyle}
            >
              <ViewListIcon style={{ fontSize: '1.5em' }} />
            </IconButton>
            <IconButton
              onClick={() => setIsList(false)}
              style={iconButtonStyle}
            >
              <ViewGridIcon style={{ fontSize: '1.5em' }} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {assetsListing.length > 0 && (
            <MarketplaceListingsTable
              isList={isList}
              assets={assetsListing}
              people={people}
              assetPriceOrOfferMap={assetPriceOrOfferMap}
              assetOwnerMapByIdentity={assetOwnerMapByIdentity}
              assetOwnerMapByAssetId={assetOwnerMapByAssetId}
              balanceTextToNameMap={assetsLisitingLabelMap}
              mockTokenImages={MOCK_TOKEN_IMAGES}
              onRowAssetClick={handleRowAssetClick}
            />
          )}
        </Grid>
        <PersonCreateOfferPopup 
          person={selectedPerson}
          open={isPersonCreateOfferPopupOpen}
          assets={assets}
          assetOwnerMapByIdentity={assetOwnerMapByIdentity}
          onClose={handleClosePersonCreateOfferPopup} />
      </Box>
    </ThemeProvider>
  )
}

export default MarketplaceSearch
