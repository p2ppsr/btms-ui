import React, { useEffect, useState } from 'react'
import { Box, Grid, ThemeProvider, Typography } from '@mui/material'
import { Asset, BTMS } from '../../../btms-core/out/src'
import { useHistory } from 'react-router-dom'
import Button from './Button'
import MyAssetsTable from './MyAssetsTable'
import { MOCK_TOKEN_IMAGES, FILTERED_NAMES_OFFER } from '../utils/constants'
import { mockFetchAssets } from '../utils/general'
import web3Theme from '../theme'

interface MyAssetsPageProps {
  btms: BTMS
  tabsMap: { [link: string]: number }
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

const MyAssetsPage: React.FC<MyAssetsPageProps> = ({ btms, tabsMap, setCurrentTab }) => {
  const [showProgress, setShowProgress] = useState<boolean>(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const history = useHistory()
  
  const fetchAssets = async () => {
    try {
      setShowProgress(true)
      const fetchedAssets = await mockFetchAssets(btms, FILTERED_NAMES_OFFER)
      setShowProgress(false)
      setAssets(fetchedAssets)
    } catch (error) {
      console.error('Error fetching offer assets:', error)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [btms])

  const handleOnClickAddNewAssetButton = () => {
    history.push('/mint') // Navigate to the minting page when adding a new asset
    setCurrentTab(tabsMap['mint'])
  }

  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <Grid container spacing={1}>
          <Grid item xs={12} style={{ paddingBottom: '2em', paddingTop: '0.1em' }}>
            <img src='/BTMS-logo.png' alt='BTMS Logo' width={'100px'} />
          </Grid>
          <Grid item xs={12} style={{ paddingBottom: '1em', paddingTop: '1em' }}>
            <Typography variant='h5' textAlign='center'>
              Basic Tokenization Management System
            </Typography>
            <Typography variant='h4' textAlign='left' paddingTop='1em' paddingBottom='1em' fontWeight='bold'>
              My Assets
            </Typography>
            <MyAssetsTable tokens={assets} mockTokenImages={MOCK_TOKEN_IMAGES} />
          </Grid>
          <Grid item xs={12} paddingBottom='1em' paddingTop='1em'>
            <Button
              isDisabled={false}
              label='+ New Asset'
              justifyContent='center'
              handleOnClick={handleOnClickAddNewAssetButton}
            />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default MyAssetsPage
