import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Avatar,
  Box,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { SelectChangeEvent } from '@mui/material/Select'
import { useHistory } from 'react-router-dom' // Import useHistory
import { AssetOwned, OfferedAssets, Person } from '../utils/general'
import Button from './Button' // Custom Button component
import { Asset } from '../../../btms-core/out/src'
import { BORDER_RADIUS, MOCK_TOKEN_IMAGES } from '../utils/constants'
import web3Theme from '../theme'

interface PersonCreateOfferPopupProps {
  person: Person | null
  open: boolean
  assets: Asset[]
  assetOwnerMapByIdentity: { [identity: string]: AssetOwned[] }
  onClose: () => void
}

const PersonCreateOfferPopup: React.FC<PersonCreateOfferPopupProps> = ({
  person,
  open,
  assets,
  assetOwnerMapByIdentity,
  onClose,
}) => {
  const [offeredAssets, setOfferedAssets] = useState<OfferedAssets>({ list: [] })
  const [offerAmount, setOfferAmount] = useState<string>('')
  const [isInit, setIsInit] = useState<boolean>(true)
  const history = useHistory() // Use useHistory hook

  const fieldRef = useRef<HTMLDivElement | null>(null)

  const personOwnedAssetIds = person ? assetOwnerMapByIdentity[person.identity]?.map(asset => asset.assetId) : []
  const personOwnedAssets = personOwnedAssetIds.map(assetId => assets.find(asset => asset.assetId === assetId)).filter(Boolean)

  useEffect(() => {
    if (open && personOwnedAssets.length > 0) {
      setOfferedAssets({
        list: [{
          assetId: personOwnedAssets[0]?.assetId || '',
          amount: 0
        }]
      })
    }
  }, [open, person, assetOwnerMapByIdentity, assets])

  const handleOnChangeAsset = (event: SelectChangeEvent<string>) => {
    setOfferedAssets({
      list: [{
        assetId: event.target.value,
        amount: 0
      }]
    })
    setIsInit(false)
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOfferAmount(event.target.value)
    setOfferedAssets(prev => ({
      list: prev.list.map(asset => ({
        ...asset,
        amount: parseFloat(event.target.value) || 0
      }))
    }))
  }

  const handleOnClickSubmitOffer = () => {
    onClose()
  }

  const handleOnClickReviewOffer = () => {
    history.push({
      pathname: '/marketplacereviewoffer',
      state: {
        person,
        assets,
        offeredAsset: offeredAssets.list[0],
        exchangeAsset: { assetId: assets[1].assetId, amount: assets[1].balance },
      }
    })
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setIsInit(true)
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const circleStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '4em',
    height: '4em',
    borderRadius: '50%',
    marginRight: '0.2em',
    overflow: 'hidden',
  }

  const smallCircleStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    width: '2em',
    height: '2em',
    borderRadius: '50%',
    marginRight: '0.2em',
    overflow: 'hidden',
  }

  const squareStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3em',
  }

  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth='sm'
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: '#0c0d0f',
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: '#0c0d0f',
              color: '#fff',
            }}
          >
            Create Offer
            <IconButton
              aria-label='close'
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: '#0c0d0f',
              color: '#fff',
            }}
          >
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                {person && (
                  <div style={circleStyle}>
                    <img
                      src={person.iconURL}
                      alt={`${person.firstName} ${person.lastName}`}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                )}
              </Grid>
              <Grid item>
                {person && (
                  <>
                    <Typography variant='h6'>
                      {person.firstName} {person.lastName}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      Endorsed by
                    </Typography>
                    <Grid container spacing={1} alignItems='center'>
                      <Grid item>
                        <div style={smallCircleStyle}>
                          <img
                            src='mock/socialcert.png'
                            alt='SocialCert-badge'
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      </Grid>
                      <Grid item>
                        <Avatar alt='SocialCert' src='mock/socialcert.png' />
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
            <FormControl
              fullWidth
              margin='normal'
              variant='outlined'
              onClick={() => setIsInit(false)}
            >
              <InputLabel
                shrink={isInit ? true : false}
                htmlFor='asset-select'
                style={{ color: '#b0b0b0' }}
                focused={false}
              >
                {isInit ? 'Select an asset' : ''}
              </InputLabel>
              <Select
                value={offeredAssets.list[0]?.assetId || ''}
                onChange={handleOnChangeAsset}
                onClick={() => setIsInit(false)}
                labelId='asset-select'
                label={isInit ? 'Select an asset' : ''}
                size='small'
                variant='outlined'
                style={{
                  display: 'flex',
                  borderRadius: BORDER_RADIUS,
                  color: '#fff',
                  border: isInit ? undefined : '1px solid #fff',
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    display: isInit ? 'block' : 'none',
                  },
                }}
              >
                {personOwnedAssets.map((asset) => (
                  <MenuItem
                    style={{ width: '100%', display: 'flex', alignItems: 'center' }}
                    key={asset?.assetId}
                    value={asset?.assetId}
                  >
                    <div style={squareStyle}>
                      <img
                        src={asset?.name ? MOCK_TOKEN_IMAGES[asset.name] : ''}
                        style={{ width: '2em', height: '2em' }}
                        alt={asset?.name}
                      />
                      {asset?.name}
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              ref={fieldRef}
              fullWidth
              size='small'
              margin='normal'
              label='Offer amount'
              variant='outlined'
              value={offerAmount}
              onChange={handleAmountChange}
              InputProps={{
                style: { color: 'white', borderRadius: BORDER_RADIUS },
              }}
              InputLabelProps={{
                style: { color: '#b0b0b0' },
              }}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fff !important',
                },
              }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: '#0c0d0f',
            }}
          >
            <Button
              isDisabled={false}
              label='Review offer'
              justifyContent='flex-end'
              handleOnClick={handleOnClickReviewOffer}
            />
            <Button
              isDisabled={false}
              label='Submit offer'
              justifyContent='flex-end'
              handleOnClick={handleOnClickSubmitOffer}
            />
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}

export default PersonCreateOfferPopup
