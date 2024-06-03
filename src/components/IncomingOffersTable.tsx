import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableRow, Grid, Avatar, TableHead, Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import web3Theme from '../theme'
import Button from './Button'
import { BORDER_RADIUS, MOCK_TOKEN_IMAGES } from '../utils/constants'
import { Asset, BTMS } from '../../../btms-core/out/src'
import { randomNumber, AssetOwned, Person, getAsset, randomAssetNotCurrentAsset } from '../utils/general'

const mockTokenDefaultImage = 'mock/tokenIcon-A1.png'

interface IncomingOffersTableProps {
  btms?: BTMS
  assetId?: string
  dbg?: boolean
  isVisible?: boolean
  people: Person[]
  assets: Asset[]
  assetOwnerMapByIdentity: { [identity: string]: AssetOwned[] }
  offers?: { [key: string]: { offeredAsset: AssetOwned; exchangeAsset: AssetOwned } }
  tabsMap: { [link: string]: number }
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

const IncomingOffersTable: React.FC<IncomingOffersTableProps> = ({
  btms = null,
  assetId = '',
  dbg = false,
  isVisible = true,
  people,
  assets,
  assetOwnerMapByIdentity,
  offers = {},
  tabsMap,
  setCurrentTab,
}) => {
  const [$people, setPeople] = useState<Person[]>(people)
  const [$assets, setAssets] = useState<Asset[]>(assets)
  const [$btms, setBTMS] = useState(btms) // State to store btms instance
  const [$assetOwnerMapByIdentity, setAssetOwnerMapByIdentity] = useState<{ [identity: string]: AssetOwned[] }>(assetOwnerMapByIdentity)
  const [$offers, setOffers] = useState<{ [key: string]: { offeredAsset: AssetOwned; exchangeAsset: AssetOwned } }>({})
  const [isBackButtonReturned, setIsBackButtonReturned] = useState<boolean>(false)

  const history = useHistory()

  useEffect(() => {
    if (offers && Object.keys(offers).length > 0 && assetOwnerMapByIdentity && Object.keys(assetOwnerMapByIdentity).length > 0) {
      setPeople(people)
      setAssets(assets)
      setAssetOwnerMapByIdentity(assetOwnerMapByIdentity)
      setOffers(offers)
      setIsBackButtonReturned(true)
    }
  }, [offers, assetOwnerMapByIdentity, people, assets])

  useEffect(() => {
    if (btms && people.length > 0 && assets.length > 0 && assetOwnerMapByIdentity) {
      const initialOffers: { [key: string]: { offeredAsset: AssetOwned; exchangeAsset: AssetOwned } } = {}

      people.forEach((person) => {
        if (assetOwnerMapByIdentity[person.identity]) {
          assetOwnerMapByIdentity[person.identity].forEach((assetOwned) => {
            const offeredAsset: AssetOwned = { ...assetOwned, amount: randomNumber(40) + 10 }
            const randomAsset: Asset = randomAssetNotCurrentAsset(assets, assetOwned.assetId)
            const exchangeAsset: AssetOwned = { assetId: randomAsset.assetId, amount: randomNumber(50) + 3 }
            initialOffers[`${person.identity}_${assetOwned.assetId}`] = { offeredAsset, exchangeAsset }
          })
        }
      })
      setPeople(people)
      setAssets(assets)
      setOffers(initialOffers)
      setAssetOwnerMapByIdentity(assetOwnerMapByIdentity)
    }
  }, [btms, people, assets, assetOwnerMapByIdentity])

  const priceDetails = (asset: Asset, amount: number) => {
    const iconURL = asset?.name ? MOCK_TOKEN_IMAGES[asset.name] : mockTokenDefaultImage

    const circleStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      width: '2.5em',
      height: '2.5em',
      borderRadius: '50%',
      marginRight: '0.3em',
      overflow: 'hidden',
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'monospace' }}>
        <span style={{ color: '#fff', marginRight: '0.5em' }}>{amount}</span>
        <div style={circleStyle}>
          {amount < 10 ? (
            <span style={{ color: '#000' }}>$</span>
          ) : (
            <img src={iconURL} alt='' style={{ width: '100%', height: '100%', backgroundColor: '#0a0a0a' }} />
          )}
        </div>
      </div>
    )
  }

  const handleReviewOffer = (person: Person, offeredAsset: AssetOwned, exchangeAsset: AssetOwned) => {

    // Pass current objects so that random values are not used when back button is clicked
    history.push('/reviewoffer', {
      person,
      offeredAsset,
      exchangeAsset,
      assets: $assets,
      assetOwnerMapByIdentity: $assetOwnerMapByIdentity,
      offers: $offers,
      people: $people,
      tabsMap
    })
    setCurrentTab(tabsMap['reviewoffer'])
  }

  const jsx = (people_, assets_, offers_, assetOwnerMapByIdentity_) => {
    // Check if there are no matched assets for the given assetId
    const hasNoMatchedAssets = !people_.some((person) =>
      assetOwnerMapByIdentity_[person.identity]?.some((asset) => asset.assetId === assetId)
    )

    if (assetId !== '' && hasNoMatchedAssets) {
      return <div>No matched assets, please try again.</div>
    }

    return (
      <ThemeProvider theme={web3Theme}>
        <Box>
          <Grid
            container
            spacing={2}
            style={{
              paddingLeft: '16px',
              visibility: isVisible ? 'visible' : 'hidden',
              display: isVisible ? 'block' : 'none',
            }}
          >
            <Grid item xs={5} />
            <TableContainer
              style={{
                overflowY: 'auto',
                borderRadius: BORDER_RADIUS,
              }}
            >
              <Table sx={{ minWidth: 250 }} aria-label='assets-table' size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left' }}>Buyer</TableCell>
                    <TableCell sx={{ textAlign: 'left' }}>Offer</TableCell>
                    <TableCell sx={{ textAlign: 'left' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {people_.map((person) =>
                    person &&
                    assetOwnerMapByIdentity_ &&
                    assetOwnerMapByIdentity_[person.identity]?.map((assetOwned) => {
                      const key = `${person.identity}_${assetOwned.assetId}`
                      const offer = $offers[key]
                      if (
                        assetId === '' ||
                        (assetOwned?.assetId === assetId && offer)
                      ) {
                        return (
                          <TableRow key={key}>
                            <TableCell sx={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={person.iconURL}
                                alt={`${person.firstName} ${person.lastName}`}
                                style={{ width: '3em', height: '3em', marginRight: '0.5em' }}
                              />
                              {person.firstName} {person.lastName}
                            </TableCell>
                            <TableCell>
                              <div style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                {offer && priceDetails(getAsset(assets_, assetOwned.assetId), offer.offeredAsset.amount)}{' '}
                                for your{' '}
                                {offer && priceDetails(getAsset(assets_, offer.exchangeAsset.assetId), offer.exchangeAsset.amount)}
                              </div>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'left' }}>
                              <div style={{ display: 'inline-flex' }}>
                                <Button
                                  label='Review offer'
                                  isDisabled={false}
                                  handleOnClick={() => {
                                    if (offer) {
                                      handleReviewOffer(person, offer.offeredAsset, offer.exchangeAsset)
                                    }
                                  }}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      } else {
                        return null
                      }
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Box>
      </ThemeProvider>
    )
  }

  return jsx($people, $assets, $offers, $assetOwnerMapByIdentity)
}

export default IncomingOffersTable
