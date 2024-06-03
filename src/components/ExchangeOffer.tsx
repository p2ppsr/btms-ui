import React from 'react'
import { Box, Grid } from '@mui/material'
import { Asset, BTMS } from '../../../btms-core/out/src'
import { ThemeProvider } from '@mui/material/styles'
import web3Theme from '../theme'
import ExchangeActions from './ExchangeActions'
import { FILTERED_NAMES_OFFER } from '../utils/constants'

const INITIAL_SEARCH_BAR_TEXT = 'Choose from your assets'

interface ExchangeOfferProps {
  btms: BTMS
	assetsWithAmounts: Asset[]
	setAreAssetsReady: React.Dispatch<React.SetStateAction<boolean>>
	setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>
}

const ExchangeOffer: React.FC<ExchangeOfferProps> = ({ 
	btms,
	assetsWithAmounts,
	setAreAssetsReady,
	setAssetsWithAmounts
}) => {

	return (
		<ThemeProvider theme={web3Theme}>
			<Box>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<ExchangeActions
							initialSearchBarText={INITIAL_SEARCH_BAR_TEXT}
							filteredNames={FILTERED_NAMES_OFFER}
							label='offering'
							btms={btms}
							assetsWithAmounts={assetsWithAmounts}
							setAreAssetsReady={setAreAssetsReady}
							setAssetsWithAmounts={setAssetsWithAmounts} 
							/>
					</Grid>
				</Grid>
			</Box>
		</ThemeProvider>
	)
}

export default ExchangeOffer