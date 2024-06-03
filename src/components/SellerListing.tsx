import React from 'react'
import { AssetOwned, Person } from '../utils/general'
import { Asset } from '../../../btms-core/out/src'
import { useHistory } from 'react-router-dom'
import Listing from './Listing'
import { ThemeProvider } from '@emotion/react'
import web3Theme from '../theme'
import { Box } from '@mui/material'

export interface SellerListingProps {
  person: Person | null
  assets: Asset[]
  offeredAsset: AssetOwned
  tabsMap: { [link: string]: number }
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

const SellerListing: React.FC<SellerListingProps> = ({ person, assets, offeredAsset, tabsMap, setCurrentTab }) => {

  const history = useHistory()
  
  const handleOnClickViewOffers = () => {
    history.push('/incomingoffers', {
      assetId: offeredAsset.assetId,
    })
    setCurrentTab(tabsMap['incomingoffers'])
  }

  const handleDeleteOffer = () => {
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
          buttonLabel='View offers'
          buttonHandleOnClickAction={handleOnClickViewOffers}
          deleteIconHandleOnClick={handleDeleteOffer}
        />
      </Box>
    </ThemeProvider>
  )
}

export default SellerListing
