import React from 'react'
import { Grid, Typography, Avatar, Button as MUIButton, Box, IconButton, ThemeProvider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AssetOwned, Person, imageBadge } from '../utils/general'
import { Asset, BTMS } from '../../../btms-core/out/src'
import { MOCK_TOKEN_IMAGES } from '../utils/constants'
import { useHistory } from 'react-router-dom'
import web3Theme from '../theme'

export interface ReviewOfferState {
  btms: BTMS
  person: Person
  assets: Asset[]
  offeredAsset: AssetOwned
  exchangeAsset: AssetOwned
  assetOwnerMapByIdentity: { [identity: string]: AssetOwned[] }
  offers: { [key: string]: { offeredAsset: AssetOwned; exchangeAsset: AssetOwned } }
  people: Person[]
  tabsMap: { [link: string]: number }
}

interface ReviewOfferProps {
  person: Person | null
  assets: Asset[]
  offeredAsset: AssetOwned
  exchangeAsset: AssetOwned
  assetOwnerMapByIdentity?: { [identity: string]: AssetOwned[] }
  offers: { [key: string]: { offeredAsset: AssetOwned; exchangeAsset: AssetOwned } }
  people: Person[]
  tabsMap: { [link: string]: number }
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>
  onAccept: () => void
  onDecline: () => void
}

const ReviewOffer: React.FC<ReviewOfferProps> = ({
  person,
  assets,
  offeredAsset,
  exchangeAsset,
  assetOwnerMapByIdentity = {},
  offers = {},
  people = [],
  tabsMap,
  setCurrentTab,
  onAccept,
  onDecline,
}) => {
  const history = useHistory()

  const handleGoBack = () => {
    history.push('/incomingoffers', {
      btms: null,
      person,
      assets,
      offeredAsset,
      exchangeAsset,
      assetOwnerMapByIdentity,
      offers,
      people,
    })
    setCurrentTab(tabsMap['incomingoffers'])
  }

  const getAssetDetails = (assetId: string): Asset | undefined => {
    return assets.find((asset) => asset.assetId === assetId)
  }

  const offeredAssetDetails = getAssetDetails(offeredAsset?.assetId)
  const exchangeAssetDetails = getAssetDetails(exchangeAsset?.assetId)

  return (
    <ThemeProvider theme={web3Theme}>
      <Box sx={{ padding: '4em', backgroundColor: '#1c1c1c' }}>
        <Grid item xs={12} paddingTop='0.1em'>
          <IconButton onClick={handleGoBack}>
            <ArrowBackIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} paddingTop='0.1em' paddingBottom='2em'>
          <img src='/BTMS-logo.png' alt='BTMS Logo' width={'100px'} />
        </Grid>
        <Grid item xs={12} paddingTop='0.1em' paddingBottom='2em'>
          <Typography variant='h3' paddingBottom='0.5em'>
            Review Offer
          </Typography>
          <Typography variant='h4' paddingBottom='-0.5em'>
            Buyer information
          </Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {person && (
              <>
                <Avatar
                  src={person.iconURL}
                  alt={`${person.firstName} ${person.lastName}`}
                  sx={{ width: '4em', height: '4em', marginRight: '0.5em' }}
                />
                <Typography variant='h6'>
                  {person.firstName} {person.lastName}
                </Typography>
                <Typography variant='body2' color='textSecondary' paddingLeft='1em' paddingRight='2em'>
                  Endorsed by
                </Typography>
                <Grid container alignItems='center'>
                  <Grid
                    item
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'grey',
                      width: '2.5em',
                      height: '2.5em',
                      borderRadius: '50%',
                      //marginRight: '0.2em',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Box
                      component="img"
                      src='mock/socialcert.png'
                      alt='SocialCert-badge'
                      sx={{
                        width: '3em',
                        height: '3em',
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Avatar alt='SocialCert' src='mock/socialcert.png' sx={{width: '2.5em', height: '2.5em'}} />
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={1} />
          <Grid item xs={4}
            sx={{
              paddingLeft: '2em',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'stretch',
            }}
          >
            <Box sx={{ paddingTop: '2em' }}>
              <Typography variant='h6' align='left' sx={{ whiteSpace: 'nowrap' }}>
                Offered assets
              </Typography>
              <Box sx={{ display: 'flex', gap: '1em' }}>
                {offeredAssetDetails && (
                  <>
                    {imageBadge(
                      MOCK_TOKEN_IMAGES[offeredAssetDetails.name || ''],
                      offeredAssetDetails.name,
                      '6em',
                      '0.5em'
                    )}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        height: '5em',
                      }}
                    >
                      <Typography variant='body2' align='left'>
                        {offeredAssetDetails.name}
                      </Typography>
                      <Typography
                        variant='body1'
                        align='left'
                        sx={{
                          color:
                            exchangeAssetDetails?.assetId ===
                            '95da0db6377469b46a8bb76c3ce287450599eb9e9e3c3fe6b5f69c0591c6dabe.0'
                              ? 'red'
                              : '#fff',
                        }}
                      >
                        {offeredAsset.amount}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box
              sx={{
                borderLeft: '2px dashed rgb(255, 255, 255)',
                height: '55%',
                position: 'absolute',
                left: '47%',
                transform: 'translateX(-50%)',
                top: '10%',
              }}
            ></Box>
          </Grid>
          <Grid item xs={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
            }}
          >
            <Box sx={{ paddingTop: '2em' }}>
              <Typography variant='h6' align='left' sx={{ whiteSpace: 'nowrap' }}>
                In exchange for
              </Typography>
              <Box sx={{ display: 'flex', gap: '1em' }}>
                {exchangeAssetDetails && (
                  <>
                    {imageBadge(
                      MOCK_TOKEN_IMAGES[exchangeAssetDetails.name || ''],
                      exchangeAssetDetails.name,
                      '6em',
                      '0.5em'
                    )}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        height: '5em',
                      }}
                    >
                      <Typography variant='body1' align='left'>
                        {exchangeAssetDetails.name}
                      </Typography>
                      <Typography
                        variant='body1'
                        align='left'
                        sx={{
                          color:
                            exchangeAssetDetails?.assetId ===
                            '95da0db6377469b46a8bb76c3ce287450599eb9e9e3c3fe6b5f69c0591c6dabe.0'
                              ? 'red'
                              : '#fff',
                        }}
                      >
                        {exchangeAsset.amount}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '2em',
                marginTop: '-2em',
                minWidth: '8em',
                maxWidth: '10em',
                height:
                  exchangeAssetDetails?.assetId ===
                  '95da0db6377469b46a8bb76c3ce287450599eb9e9e3c3fe6b5f69c0591c6dabe.0'
                    ? '10em'
                    : 'none',
              }}
            >
              {exchangeAssetDetails?.assetId ===
              '95da0db6377469b46a8bb76c3ce287450599eb9e9e3c3fe6b5f69c0591c6dabe.0' ? (
                <Typography variant='h6' align='left' color='#ff0000'>
                  This offer does not fulfill your original request
                </Typography>
              ) : (
                <Typography variant='h6' align='left'>
                  Accept this offer
                </Typography>
              )}
              <MUIButton
                variant='outlined'
                color='error'
                onClick={onDecline}
                sx={{ borderColor: '#ff1744', color: '#ff1744' }}
              >
                Decline
              </MUIButton>
              <MUIButton
                variant='outlined'
                color='success'
                onClick={onAccept}
                sx={{ borderColor: '#00e676', color: '#00e676' }}
              >
                Accept
              </MUIButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default ReviewOffer
