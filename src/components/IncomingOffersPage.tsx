import React from 'react'
import { BTMS, Asset } from '../../../btms-core/out/src'
import IncomingOffersTable from './IncomingOffersTable'
import { AssetOwned, Person } from '../utils/general'
import { Box, Grid, ThemeProvider } from '@mui/material'
import web3Theme from '../theme'

export interface IncomingOffersPageState {
  btms?: BTMS
  assetId: string
  people: Person[]
  assets: Asset[]
  assetOwnerMapByIdentity: { [identity: string]: AssetOwned[] }
  offers: { [key: string]: { offeredAsset: AssetOwned; exchangeAsset: AssetOwned } }
  tabsMap: { [link: string]: number }
  setCurrentTab?: React.Dispatch<React.SetStateAction<number>>
}

interface IncomingOffersPageProps {
  btms?: BTMS
  assetId: string
  assetOwnerMapByIdentity: { [identity: string]: AssetOwned[] }
  offers: { [offerId: string]: any }
  people: Person[]
  assets: Asset[]
  tabsMap: { [link: string]: number }
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

const IncomingOffersPage: React.FC<IncomingOffersPageProps> = ({
  btms = null,
  assetId = '',
  people = [],
  assets = [],
  assetOwnerMapByIdentity = {},
  offers = {},
  tabsMap,
  setCurrentTab,
}) => {

  return (
		<ThemeProvider theme={web3Theme}>
      <Box sx={{ padding: '2em', backgroundColor: '#1c1c1c' }}>
        <Grid item xs={12} paddingTop='0.1em' paddingBottom='2em'>
          <img src='/BTMS-logo.png' alt='BTMS Logo' width={'100px'} />
        </Grid>
        <div>
          <IncomingOffersTable
            btms={btms || undefined}
            assets={assets}
            assetId={assetId}
            people={people}
            offers={offers}
            assetOwnerMapByIdentity={assetOwnerMapByIdentity}
            tabsMap={tabsMap}
            setCurrentTab={setCurrentTab}
          />
        </div>
      </Box>
    </ThemeProvider>
  )
}

export default IncomingOffersPage
