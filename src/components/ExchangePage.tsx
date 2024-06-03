import { useState, useEffect } from 'react'
import { Box, Grid, ThemeProvider, Typography } from '@mui/material'
import ExchangeOffer from './ExchangeOffer'
import ExchangeAccept from './ExchangeAccept'
import Button from './Button'
import { Asset } from '../../../btms-core/out/src'
import web3Theme from '../theme'

const ExchangePage = ({ btms }) => {
  const [assetsWithAmountsOffered, setAssetsWithAmountsOffered] = useState<Asset[]>([])
  const [assetsWithAmountsAccepted, setAssetsWithAmountsAccepted] = useState<Asset[]>([])
  const [assetAmountRecordsOffered, setAssetAmountRecordsOffered] = useState<Record<string, number>>({})
  const [assetAmountRecordsAccepted, setAssetAmountRecordsAccepted] = useState<Record<string, number>>({})
  const [isButtonDisabledConfirmListing, setIsButtonDisabledConfirmListing] = useState<boolean>(true)
  const [areAssetsOfferedReady, setAreAssetsOfferedReady] = useState<boolean>(false)
  const [areAssetsAcceptedReady, setAreAssetsAcceptedReady] = useState<boolean>(false)

  useEffect(() => {

    // Transform assetsWithAmountsOffered into assetAmountRecordsOffered
    const offeredRecords = assetsWithAmountsOffered.reduce((acc, asset) => {
      acc[asset.assetId] = asset.balance
      return acc
    }, {})
    setAssetAmountRecordsOffered(offeredRecords)

    // Transform assetsWithAmountsAccepted into assetAmountRecordsAccepted
    const acceptedRecords = assetsWithAmountsAccepted.reduce((acc, asset) => {
      acc[asset.assetId] = asset.balance
      return acc
    }, {})
    setAssetAmountRecordsAccepted(acceptedRecords)

    // Check if both offered and accepted assets are ready
    setIsButtonDisabledConfirmListing(!(areAssetsOfferedReady && areAssetsAcceptedReady))
  }, [assetsWithAmountsOffered, assetsWithAmountsAccepted, areAssetsOfferedReady, areAssetsAcceptedReady])

  const listAssetForSale = () => {
    const assetRecord = Object.entries(assetAmountRecordsOffered)[0] // Get the first (and only) entry
    const assetId: string = assetRecord[0]
    const assetAmount: number = assetRecord[1]
    const desiredAssets: Record<string, number> = assetAmountRecordsAccepted
    const description: string = 'test for exchange of assets'

    if (assetId && assetAmount && Object.keys(desiredAssets).length > 0) {

      // Check that required values are valid before calling btms.listAssetForSale
      btms.listAssetForSale(assetId, assetAmount, desiredAssets, description)
    } else {
      console.error('Error: Insufficient data to list asset for sale.')
    }
  }

  return (
		<ThemeProvider theme={web3Theme}>
      <Box sx={{ padding: '2em', backgroundColor: '#1c1c1c' }}>
        <Grid item xs={12} paddingTop='0.1em' paddingBottom='2em'>
          <img src='/BTMS-logo.png' alt='BTMS Logo' width={'100px'} />
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <Typography variant='h4' paddingTop='0.5em'>
              List an asset
            </Typography>
            <Typography variant='h5' paddingTop='1em' paddingBlock='0.5em'>
              Offered assets
            </Typography>     
            <ExchangeOffer
              btms={btms}
              assetsWithAmounts={assetsWithAmountsOffered}
              setAreAssetsReady={setAreAssetsOfferedReady}
              setAssetsWithAmounts={setAssetsWithAmountsOffered} 
            />
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={5}>
            <Typography variant='h4' paddingTop='0.5em' color='transparent'>
              .
            </Typography>
            <Typography variant='h5' paddingTop='1em' paddingBlock='0.5em'>
              Accepted assets
            </Typography>
            <ExchangeAccept
              btms={btms}
              assetsWithAmounts={assetsWithAmountsAccepted}
              setAreAssetsReady={setAreAssetsAcceptedReady}
              setAssetsWithAmounts={setAssetsWithAmountsAccepted} 
            />
          </Grid>
          <Grid item xs={12} paddingBottom='1em' paddingTop='1em'>
            <Button 
              isDisabled={isButtonDisabledConfirmListing}
              label='Confirm listing'
              justifyContent='flex-end'
              handleOnClick={listAssetForSale}
            />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default ExchangePage