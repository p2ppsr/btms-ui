import React, { useState } from 'react'
import useStyles from './send-style'
import { toast } from 'react-toastify'
import {
  Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
} from '@mui/material'
import BTMS from '../../utils/BTMS'

const Send = ({ openSend, setOpenSend, tokenKey, setTokensLoading }) => {
  const classes = useStyles()
  const [recipient, setRecipient] = useState('')
  const [quantity, setQuantity] = useState('')

  const handleSendCancel = () => {
    setQuantity('')
    setRecipient('')
    setOpenSend(false)
  }

  const handleSend = async () => {
    try {
      if (recipient.trim() === '') {
        toast.error('Enter recipient identity key!')
      } else if (recipient.length < 66) {
        toast.error('The recipient identity key must be at least 66 character long!')
      } else if (quantity.trim() === '' || isNaN(quantity)) {
        toast.error('Enter a quantity of tokens to send!')
      } else if (quantity > tokenKey.balance) {
        toast.error('Oops! That is too many tokens!')
      } else {
        await BTMS.send(tokenKey.assetId, recipient, quantity)
        toast.success('Success!')
        setOpenSend(false)
        setTokensLoading(true)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Something went wrong!')
      setOpenSend(false)
    }
  }

  return (
    <Grid item container align='center' direction='column'>
      <Dialog open={openSend} onClose={handleSendCancel} color='primary'>
        <DialogTitle variant='h4' sx={{ fontWeight: 'bold' }}>
          Send {tokenKey.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant='h6'>
            Recipient Identity Key:
          </Typography>
          <Typography variant='h8'>
            Get this from the person who will receive the token
          </Typography>
          <TextField
            className={classes.form} value={recipient}
            variant='outlined' color='secondary' fullWidth
            helperText={'Required'}
            onChange={(e) => setRecipient(e.target.value.replace(/[^0-9a-f]/gi, ''))}
          />
          <Typography variant='h6' className={classes.sub_title}>
            Quantity:
          </Typography>
          <TextField
            className={classes.form} value={quantity}
            variant='outlined' color='secondary' fullWidth
            helperText={'Required'}
            onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ''))}
          />
        </DialogContent>
        <DialogActions className={classes.button}>
          <Button color='secondary' variant='outlined' onClick={handleSendCancel}>Cancel</Button>
          <Button color='secondary' variant='outlined' onClick={handleSend}>Send Now</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default Send