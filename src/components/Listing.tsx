import React from 'react'
import { Grid, Typography, Avatar, Box, IconButton, ThemeProvider } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { AssetOwned, Person, imageBadge } from '../utils/general'
import { Asset } from '../../../btms-core/out/src'
import { MOCK_TOKEN_IMAGES } from '../utils/constants'
import Button from './Button'
import web3Theme from '../theme'

export interface ListingProps {
  person: Person | null
  assets: Asset[]
  offeredAsset: AssetOwned
  buttonLabel: string
  buttonHandleOnClickAction: () => void
  deleteIconHandleOnClick?:  () => void
}

const Listing: React.FC<ListingProps> = ({ 
  person,
  assets,
  offeredAsset,
  buttonLabel,
  buttonHandleOnClickAction,
  deleteIconHandleOnClick = null
 }) => {
  
  const getAssetDetails = (assetId: string): Asset | undefined => {
    return assets.find((asset) => asset.assetId === assetId)
  }

  const offeredAssetDetails = getAssetDetails(offeredAsset?.assetId)

  return (
    <ThemeProvider theme={web3Theme}>
      <Box sx={{ padding: '2em', backgroundColor: '#1c1c1c' }}>
        <Grid item xs={12} paddingTop='0.1em' paddingBottom='2em'>
          <img src='/BTMS-logo.png' alt='BTMS Logo' width={'100px'} />
        </Grid>
        <Grid container spacing={2} alignItems='flex-start' style={{ paddingLeft: '0px' }}>
          {offeredAssetDetails && (
            <>
              <Grid item>
                {imageBadge(
                  MOCK_TOKEN_IMAGES[offeredAssetDetails.name || ''],
                  offeredAssetDetails.name,
                  '6em',
                  '0.5em'
                )}
              </Grid>
              <Grid item>
                <Typography variant='h3'>
                  {offeredAssetDetails.name}
                </Typography>
                <Typography variant='body1' gutterBottom>
                  Available: {offeredAsset.amount}
                </Typography>
              </Grid>
              <Grid item xs />
              <Grid item style={{ display: 'flex' }}>
                <Button
                  isDisabled={false}
                  label={buttonLabel}
                  handleOnClick={buttonHandleOnClickAction}
                />
                {deleteIconHandleOnClick !== null && <IconButton
                  aria-label='delete' 
                  sx={{ color: 'white', marginLeft: '1em' }}
                  onClick={deleteIconHandleOnClick}
                >
                  <DeleteIcon />
                </IconButton>}
              </Grid>
            </>
          )}
          <Grid item xs={12} />
          <Grid item sx={{ marginLeft: 'calc(6em + 1em + 16px)', marginTop: '-1em' }}>
            <Box>
              {person && <Typography variant='h6'>{person.firstName} {person.lastName}</Typography>}
              {person && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5em', marginBottom: '1em' }}>
                  <Avatar
                    src={person.iconURL}
                    alt={`${person.firstName} ${person.lastName}`}
                    sx={{ width: '3em', height: '3em' }}
                  />
                  <Typography variant='body2' color='textSecondary'>
                    Endorsed by
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'grey',
                      width: '2em',
                      height: '2em',
                      borderRadius: '50%',
                      marginRight: '0.2em',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src='mock/socialcert.png'
                      alt='SocialCert-badge'
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Box>
                  <img src='mock/socialcert.png' alt='SocialCert-badge' style={{ width: '2em', height: '2em' }} />
                </Box>
              )}
                <Typography variant='body2'>
                Lorem ipsum dolor sit amet consectetur. Duis diam posuere feugiat eleifend et arcu quisque amet. Sed iaculis suscipit ornare elit duis quisque ut. Aliquam morbi maecenas sit tristique varius pharetra. Volutpat sit orci integer tellus in tellus. At vitae velit platea tortor condimentum aliquam lacinia.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default Listing
