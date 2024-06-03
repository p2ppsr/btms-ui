import React, { useState } from 'react'
//import useStyles from './send-style'
import { toast } from 'react-toastify'
import {
  Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  ThemeProvider,
  Box
} from '@mui/material'
import BTMS from '../utils/BTMS'
import web3Theme from '../theme'

const Send = ({ assetId, asset, onReloadNeeded = () => {} }) => {
  //const classes = useStyles()
  const [recipient, setRecipient] = useState('')
  const [quantity, setQuantity] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSendCancel = () => {
    setQuantity('')
    setRecipient('')
    setOpen(false)
  }

  const handleSend = async () => {
    try {
      setLoading(true)
      if (recipient.trim() === '') {
        toast.error('Enter recipient identity key!')
      } else if (recipient.length < 66) {
        toast.error('The recipient identity key must be at least 66 character long!')
      } else if (quantity.trim() === '' || isNaN(Number(quantity))) {
        toast.error('Enter a quantity of tokens to send!')
      } else if (quantity > asset.balance) {
        toast.error('Oops! That is too many tokens!')
      } else {
        await BTMS.send(asset.assetId, recipient, Number(quantity))
        try {
          onReloadNeeded()
        } catch (e) {}
        toast.success(`You sent ${quantity} ${asset.name}!`)
        setOpen(false)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <Button
          onClick={() => setOpen(true)}
          variant='outlined' color='secondary'
        >
          Send
        </Button>
        <Dialog open={open} onClose={handleSendCancel} color='primary'>
          <DialogTitle variant='h4' sx={{ fontWeight: 'bold' }}>
            Send {asset.name}
          </DialogTitle>
          <DialogContent>
            <Typography variant='h5'>
              Recipient Identity Key:
            </Typography>
            <Typography variant='h6'>
              Get this from the person who will receive the token
            </Typography>
            <TextField
              value={recipient}
              variant='outlined' color='secondary' fullWidth
              helperText={'Required'}
              onChange={(e) => setRecipient(e.target.value.replace(/[^0-9a-f]/gi, ''))}
            />
            <Typography variant='h6'>
              Quantity:
            </Typography>
            <TextField
              value={quantity}
              variant='outlined' color='secondary' fullWidth
              helperText={'Required'}
              onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ''))}
            />
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} color='secondary' variant='outlined' onClick={handleSendCancel}>Cancel</Button>
            <Button disabled={loading} color='secondary' variant='outlined' onClick={handleSend}>Send Now</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}

export default Send