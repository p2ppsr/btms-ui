import React from 'react'
import { Box, Grid } from '@mui/material'
import { Asset, BTMS } from '../../../btms-core/out/src'
import { ThemeProvider } from '@mui/material/styles'
import web3Theme from '../theme'
import ExchangeActions from './ExchangeActions'
import { DEFAULT_ASSET } from '../utils/constants'

const INITIAL_SEARCH_BAR_TEXT = 'Choose assets you want'

interface ExchangeAcceptProps {
  btms: BTMS
	assetsWithAmounts: Asset[]
	setAreAssetsReady: React.Dispatch<React.SetStateAction<boolean>>
	setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>
}

const ExchangeAccept: React.FC<ExchangeAcceptProps> = ({ 
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
							label='asking'
							btms={btms}
							assetsWithAmounts={assetsWithAmounts}
							defaultAsset={DEFAULT_ASSET}
							setAreAssetsReady={setAreAssetsReady}
							setAssetsWithAmounts={setAssetsWithAmounts} 
						/>
					</Grid>
				</Grid>
			</Box>
		</ThemeProvider>
	)
}

export default ExchangeAccept