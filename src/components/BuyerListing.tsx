import React from 'react'
import { AssetOwned, Person } from '../utils/general'
import { Asset } from '../../../btms-core/out/src'
import { useHistory } from 'react-router-dom'
import Listing from './Listing'
import { ThemeProvider } from '@emotion/react'
import web3Theme from '../theme'
import { Box } from '@mui/material'

export interface BuyerListingProps {
  person: Person | null
  assets: Asset[]
  offeredAsset: AssetOwned
}

const BuyerListing: React.FC<BuyerListingProps> = ({ person, assets, offeredAsset }) => {

  const history = useHistory()
  
  const handleOnClickReviewOffers = () => {
    //history.push('/incomingoffers', {
    //  assetId: offeredAsset.assetId,
    //})
  }

  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <Listing 
          person={person}
          assets={assets}
          offeredAsset={offeredAsset}
          buttonLabel='Offer submitted'
          buttonHandleOnClickAction={handleOnClickReviewOffers}
        />
      </Box>
    </ThemeProvider>
  )
}

export default BuyerListing
