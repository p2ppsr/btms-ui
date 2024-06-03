import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { Container, Typography, Grid, Tabs, Tab } from '@mui/material'
import ExchangePage from './components/ExchangePage'
import MyAssetsPage from './components/MyAssetsPage'
import Mint from './components/Mint'
import MarketplaceSearch from './components/MarketplaceSearch'
import ReviewOffer, { ReviewOfferState } from './components/ReviewOffer'
import SellerListing from './components/SellerListing'
import IncomingOffersPage, { IncomingOffersPageState } from './components/IncomingOffersPage'
import { Asset, BTMS } from '../../btms-core/out/src'
import { AssetOwned, AssetOwner, Person, mockAssetOwnerMap, mockFetchAssets, mockFetchPeople, randomBoolean } from './utils/general'
import ViewListing from './components/ViewListing'
import BuyerListing from './components/BuyerListing'

// Initialize tabsMap with tab indices
const tabsMap = {
  marketplacesearch: 0,
  reviewoffer: 1,
  incomingoffers: 2,
  myassets: 3,
  listassets: 4,
  mint: 5,
  viewlisting: 6,
  sellerlisting: 7,
  buyerlisting: 8,
}

const btms = new BTMS(
  'https://confederacy.babbage.systems',
  'https://peerserv.babbage.systems',
  'tokens-box',
  'tokens',
  'tokens',
  'tokens',
  1000
)

const mockPerson: Person = {
  identity: '1203f4a5c2ab087e00efaae6b04521db',
  firstName: 'John',
  lastName: 'Gunderson',
  iconURL: 'mock/jack-jones.jpg',
}

const App: React.FC = () => {

  const [people, setPeople] = useState<Person[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetOwnerMapByIdentity, setAssetOwnerMapByIdentity] = useState<{ [identity: string]: AssetOwned[] }>({})
  const [assetOwnerMapByAssetId, setAssetOwnerMapByAssetId] = useState<{ [assetId: string]: AssetOwner[] }>({})

  const [currentTab, setCurrentTab] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newAssets = await mockFetchAssets(btms, [])
        setAssets(newAssets)
        const newPeople = mockFetchPeople()
        setPeople(newPeople)
        const { byIdentity, byAssetId } = mockAssetOwnerMap(newPeople, newAssets)
        setAssetOwnerMapByIdentity(byIdentity)
        setAssetOwnerMapByAssetId(byAssetId)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const mockPropsValid = {
    person: mockPerson,
    assets,
    offeredAsset: {
      assetId: 'b189b8ccdd03755b9d875f9bc7f3eb715e6c92887d2b8f2a462a03e199ce59ec.0',
      amount: 1,
    },
    exchangeAsset: {
      assetId: 'd5e94032064e9568611e8071a0159b178ae2b35eb0dfa6a1d0cfdbd0591fb533.0',
      amount: 5,
    },
  }

  const mockPropsInvalid = {
    person: mockPerson,
    assets,
    offeredAsset: {
      assetId: '885de0fefc4d4c3d46056b4f912a0e0c1077e138b7663440f28d611814c71672.0',
      amount: 3,
    },
    exchangeAsset: {
      assetId: '95da0db6377469b46a8bb76c3ce287450599eb9e9e3c3fe6b5f69c0591c6dabe.0',
      amount: 1,
    },
  }

  return (
    <Router>
      <Container maxWidth='lg'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4' align='center' gutterBottom>
              Asset Management Platform
            </Typography>
            <Tabs
              value={currentTab}
              onChange={(event, newValue) => setCurrentTab(newValue)}
              indicatorColor='primary'
              textColor='primary'
              centered
            >
              <Tab label='Marketplace Search' to='/marketplacesearch' component={Link} />
              <Tab label='Review Offer' to='/reviewoffer' component={Link} />
              <Tab label='Incoming Offers' to='/incomingoffers' component={Link} />
              <Tab label='My Assets' to='/myassets' component={Link} />
              <Tab label='Assets Listing' to='/listassets' component={Link} />
              <Tab label='Mint Token' to='/mint' component={Link} />
              <Tab label='View Listing' to='/viewlisting' component={Link} />
              <Tab label='Seller Listing' to='/sellerlisting' component={Link} />
              <Tab label='Buyer Listing' to='/buyerlisting' component={Link} />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <Switch>
              <Route exact path='/marketplacesearch'>
                <MarketplaceSearch btms={btms} />
              </Route>
              <Route exact path='/reviewoffer'>
                {props => {
                  const state = (props.location.state as ReviewOfferState) || {}
                  const isValidAsset = randomBoolean()
                  const defaultProps = isValidAsset ? mockPropsValid : mockPropsInvalid
                  const mergedProps = {
                    btms: state.btms || btms,
                    person: state.person || defaultProps.person,
                    assets: state.assets || defaultProps.assets,
                    offeredAsset: state.offeredAsset || defaultProps.offeredAsset,
                    exchangeAsset: state.exchangeAsset || defaultProps.exchangeAsset,
                    assetOwnerMapByIdentity: state.assetOwnerMapByIdentity || {},
                    offers: state.offers || {},
                    people: state.people || [],
                    tabsMap: state.tabsMap || tabsMap,
                  }
                  return (
                    <ReviewOffer
                      {...props}
                      {...mergedProps}
                      setCurrentTab={setCurrentTab}
                      onAccept={() => {}}
                      onDecline={() => {}}
                    />
                  )
                }}
              </Route>
              <Route exact path='/incomingoffers'>
                {props => {
                  const state = (props.location.state as IncomingOffersPageState) || {}
                  return (
                    <IncomingOffersPage
                      btms={state.btms || btms}
                      assetId={state.assetId || ''}
                      assetOwnerMapByIdentity={state.assetOwnerMapByIdentity || assetOwnerMapByIdentity}
                      offers={state.offers || {}}
                      people={state.people || people}
                      assets={state.assets || assets}
                      tabsMap={state.tabsMap || tabsMap}
                      setCurrentTab={setCurrentTab}
                    />
                  )
                }}
              </Route>
              <Route exact path='/myassets'>
                <MyAssetsPage btms={btms} tabsMap={tabsMap} setCurrentTab={setCurrentTab}
              />
              </Route>
              <Route exact path='/listassets'>
                <ExchangePage btms={btms} />
              </Route>
              <Route exact path='/mint'>
                <Mint />
              </Route>
              <Route exact path='/viewlisting'>
                <ViewListing
                  person={mockPerson}
                  assets={assets}
                  offeredAsset={{ assetId: '6443c732851216409134c41c605a44b489e7b4a55914fe14019b1a0ba8279f9b.0', amount: 10 }}
                />
              </Route>
              <Route exact path='/sellerlisting'>
                <SellerListing
                  person={mockPerson}
                  assets={assets}
                  offeredAsset={{ assetId: '6443c732851216409134c41c605a44b489e7b4a55914fe14019b1a0ba8279f9b.0', amount: 10 }}
                  tabsMap={tabsMap}
                  setCurrentTab={setCurrentTab}
            />
              </Route>
              <Route exact path='/buyerlisting'>
                <BuyerListing
                  person={mockPerson}
                  assets={assets}
                  offeredAsset={{ assetId: '6443c732851216409134c41c605a44b489e7b4a55914fe14019b1a0ba8279f9b.0', amount: 10 }}
                />
              </Route>
            </Switch>
          </Grid>
        </Grid>
      </Container>
    </Router>
  )
}

export default App
