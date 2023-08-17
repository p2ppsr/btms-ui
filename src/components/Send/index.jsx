import React, { useState } from 'react'
import useStyles from './send-style'
import { toast } from 'react-toastify'
import {
  Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material'
import BTMS from '../../utils/BTMS'

const Send = ({ assetId, asset, onReloadNeeded = () => {} }) => {
  const classes = useStyles()
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
      } else if (quantity.trim() === '' || isNaN(quantity)) {
        toast.error('Enter a quantity of tokens to send!')
      } else if (quantity > asset.balance) {
        toast.error('Oops! That is too many tokens!')
      } else {
        await BTMS.send(asset.assetId, recipient, quantity)
        try {
          onReloadNeeded()
        } catch (e) {}
        toast.success(`You sent ${quantity} ${asset.name}!`)
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
          <Button disabled={loading} color='secondary' variant='outlined' onClick={handleSendCancel}>Cancel</Button>
          <Button disabled={loading} color='secondary' variant='outlined' onClick={handleSend}>Send Now</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Send