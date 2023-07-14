import React, { useEffect, useState } from 'react'
import { getPublicKey } from '@babbage/sdk'
import useStyles from './receive-style'
import {
  Grid, Typography, Button, TableContainer,
  Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogContent, Paper, DialogTitle, Divider
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RefreshIcon from '@mui/icons-material/Refresh'

const Receive = (props) => {
  const classes = useStyles()
  const setTokens = props.setTokens
  const openReceive = props.openReceive
  const setOpenReceive = props.setOpenReceive
  const [quantity, setQuantity] = useState('')
  const [recipient, setRecipient] = useState('')
  const tokenKey = props.tokenKey
  const [userIdentityKey, setUserIdentityKey] = useState('')
  const incomingTransactions = props.incomingTransactions
  const setIncomingTransactions = props.setIncomingTransactions

  useEffect(async () => {
    const key = await getPublicKey({ identityKey: true })
    setUserIdentityKey(key)
  }, [])

  const refresh = () => {
    setOpenReceive(false)
    setTokens([])
  }

  const handleReceiveCancel = () => {
    setQuantity('')
    setRecipient('')
    setOpenReceive(false)
  }

  const handleAccept = () => {
    setIncomingTransactions(incomingTransactions.filter((item) => item.transactionName !== tokenKey.tokenName))
    setOpenReceive(false)
  }

  const handleRefund = () => {
    setIncomingTransactions(incomingTransactions.filter((item) => item.transactionName !== tokenKey.tokenName))
    setOpenReceive(false)
  }

  return (
    <Grid item container align='center' direction='column'>
      <Dialog open={openReceive} onClose={handleReceiveCancel} color='primary'>
        <DialogTitle variant='h4' sx={{ fontWeight: 'bold' }}>
          Receive {tokenKey.tokenName}
        </DialogTitle>
        <DialogContent>
          <Grid item container direction='column'>
            <Grid item>
              <Typography variant='h6'>
                Your Identity Key:
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='h8'>
                Give this to the person sending you the tokens
              </Typography>
            </Grid>
            <Grid item container className={classes.row_container}>
              <Grid item align='left'>
                <Paper elevation={8} style={{ overflow: 'scroll', width: '30rem' }}>
                  <Typography>
                    {userIdentityKey}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item sx={{ display: 'grid', justifyContent: 'right' }}>
                <Button
                  onClick={() => { navigator.clipboard.writeText(userIdentityKey) }}
                  color='secondary'
                >
                  <ContentCopyIcon />
                </Button>
              </Grid>
            </Grid>
            <Grid item container className={classes.row_container}>
              <Grid item>
                <Typography variant='h6' style={{ width: '30rem' }}>
                  Incoming Transactions:
                </Typography>
              </Grid>
              <Grid item sx={{ display: 'grid', justifyContent: 'right' }}>
                <Button color='secondary' onClick={refresh}>
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
                          <TableCell align='left'>Token</TableCell>
                          <TableCell align='right'>Accept</TableCell>
                          <TableCell align='right'>Refund</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {incomingTransactions.map((transaction, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell align='left'>{transaction.transactionQuantity}</TableCell>
                              <TableCell align='left'>{transaction.transactionName}</TableCell>
                              <TableCell align='right'>
                                <Button
                                  onClick={handleAccept}
                                  variant='outlined' color='secondary'
                                >
                                  Accept
                                </Button>
                              </TableCell>
                              <TableCell align='right'>
                                <Button
                                  onClick={handleRefund}
                                  variant='outlined' color='secondary'
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
                  <Grid item container align='center' justifyContent='center' className={classes.no_tokens}>
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
    </Grid>
  )
}

export default Receive
