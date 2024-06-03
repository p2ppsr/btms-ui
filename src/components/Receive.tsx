import React, { useEffect, useState } from 'react'
import { getPublicKey } from '@babbage/sdk'
//import useStyles from './receive-style'
import {
  Grid, Typography, Button, TableContainer,
  Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogContent, Paper, DialogTitle, Divider, Badge,
  ThemeProvider,
  Box
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RefreshIcon from '@mui/icons-material/Refresh'
import BTMS from '../utils/BTMS'
import { toast } from 'react-toastify'
import { IncomingPayment } from '../../../btms-core/out/src'
import web3Theme, { darkTheme } from '../theme'


const Receive = ({ assetId, asset, badge, onReloadNeeded = () => {} }) => {
  //const classes = useStyles()
  const [userIdentityKey, setUserIdentityKey] = useState('')
  const [incomingTransactions, setIncomingTransactions] = useState<IncomingPayment[]>([]);
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      const key = await getPublicKey({ identityKey: true })
      setUserIdentityKey(key)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (assetId) {
        const incoming: IncomingPayment[] = await BTMS.listIncomingPayments(assetId)
        setIncomingTransactions(incoming)
      }
    })()
  }, [assetId])

  const refresh = async () => {
    try {
      setLoading(true)
      const incoming = await BTMS.listIncomingPayments(assetId)
      setIncomingTransactions(incoming)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (payment) => {
    try {
      setLoading(true)
      await BTMS.acceptIncomingPayment(assetId, payment)
      try {
        refresh()
        onReloadNeeded()
        } catch (e) {}
      toast.success(`${payment.amount} ${asset.name} successfully received!`)
      setOpen(false)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async (payment) => {
    try {
      setLoading(true)
      await BTMS.refundIncomingTransaction(assetId, payment)
      try {
        refresh()
          onReloadNeeded()
        } catch (e) {}
      toast.success(`You refunded ${payment.amount} ${asset.name}.`)
      setOpen(false)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <Badge color='error' variant='dot' invisible={!badge}>
          <Button
            onClick={e => {
              e.stopPropagation()
              setOpen(true)
            }}
            variant='outlined' color='secondary'
          >
            Receive
          </Button>
        </Badge>
        <Dialog open={open} onClose={() => setOpen(false)} color='primary' fullWidth maxWidth='lg'>
          <DialogTitle variant='h4' sx={{ fontWeight: 'bold' }}>
            Receive {asset ? asset.name : 'Asset'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              <Grid item>
                <Typography variant='h5'>
                  Your Identity Key:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='h6'>
                  Give this to the person sending you the tokens
                </Typography>
              </Grid>
              <Grid
                //className={classes.row_container}
              >
                <Grid>
                  <Paper elevation={8} style={{ overflow: 'scroll', width: '30rem' }}>
                    <Typography style={{ userSelect: 'all' }}>
                      {userIdentityKey}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item sx={{ display: 'grid', justifyContent: 'right' }}>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(userIdentityKey)
                      toast.success('Identity key copied!')
                    }}
                    color='secondary'
                  >
                    <ContentCopyIcon />
                  </Button>
                </Grid>
              </Grid>
              <Grid 
                //className={classes.row_container}
              >
                <Grid item>
                  <Typography variant='h6' style={{ width: '30rem' }}>
                    Incoming Transactions:
                  </Typography>
                </Grid>
                <Grid item sx={{ display: 'grid', justifyContent: 'right' }}>
                  <Button disabled={loading} color='secondary' onClick={refresh}>
                    <RefreshIcon />
                  </Button>
                </Grid>
              </Grid>
              <Grid item>
                <Divider variant='middle' style={{ background: 'white' }} />
              </Grid>
              <Grid item container>
                {incomingTransactions.length >= 1
                  ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align='left'>Quantity</TableCell>
                            <TableCell align='left'>Sender</TableCell>
                            <TableCell align='right'>Accept</TableCell>
                            <TableCell align='right'>Refund</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {incomingTransactions.map((transaction, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell align='left'>{transaction.amount}</TableCell>
                                <TableCell align='left'>{transaction.sender}</TableCell>
                                <TableCell align='right'>
                                  <Button
                                    onClick={() => handleAccept(transaction)}
                                    variant='outlined' color='secondary'
                                    disabled={loading}
                                  >
                                    Accept
                                  </Button>
                                </TableCell>
                                <TableCell align='right'>
                                  <Button
                                    onClick={() => handleRefund(transaction)}
                                    variant='outlined' color='secondary'
                                    disabled={loading}
                                  >
                                    Refund
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>)
                  : (
                    <Grid>
                      <Grid item>
                        <Typography color='grey'>
                          Incoming transactions will appear here...
                        </Typography>
                      </Grid>
                    </Grid>)}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}

export default Receive
