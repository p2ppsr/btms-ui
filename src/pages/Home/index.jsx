import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SDK from '@babbage/sdk'
import useStyles from './home-style'
import { ToastContainer, toast } from 'react-toastify'
import {
  Grid, Typography, Button, LinearProgress, TableContainer,
  Table, TableHead, TableBody, TableRow, TableCell, Container, Card, CardMedia,
  Dialog, DialogActions, DialogContent, Paper, DialogTitle, TextField, Divider, IconButton
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RefreshIcon from '@mui/icons-material/Refresh'

const Home = () => {
  const classes = useStyles()
  const [tokens, setTokens] = useState([{ tokenName: 'Test', balance: '100', tokenIcon: 'testing', tokenId: '0' }, { tokenName: 'test2', balance: '50', tokenIcon: 'testing2', tokenId: '1' }, { tokenName: '123', balance: '100', tokenIcon: 'testing', tokenId: '134134' }, { tokenName: 'Test', balance: '100', tokenIcon: 'testing', tokenId: '13423' }, { tokenName: 'Test', balance: '100', tokenIcon: 'testing', tokenId: '4353' }, { tokenName: 'Test', balance: '100', tokenIcon: 'testing', tokenId: '0' }])
  const [tokensLoading, setTokensLoading] = useState(false)
  const [openSend, setOpenSend] = useState(false)
  const [openReceive, setOpenReceive] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [recipient, setRecipient] = useState('')
  const [tokenKey, setTokenKey] = useState('')
  const [incomingTransactions, setIncomingTransactions] = useState(true)
  const [transactions, setTransactions] = useState([{ transactionName: 'Test', transactionQuantity: '10', counterparty: '654321', txid: '678' }])

  const refresh = () => {

  }

  const copyIdentity = () => {

  }

  const handleSendOpen = (event) => {
    event.stopPropagation()
    setOpenSend(true)
  }

  const handleReceiveOpen = (event) => {
    event.stopPropagation()
    setOpenReceive(true)
  }

  const handleSendCancel = () => {
    setQuantity('')
    setRecipient('')
    setOpenSend(false)
  }

  const handleReceiveCancel = () => {
    setQuantity('')
    setRecipient('')
    setOpenReceive(false)
  }

  const handleSend = () => {
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
        toast.success('Success!')
        setOpenSend(false)
        setTokensLoading(true)
      }
    } catch (error) {
      toast.error('Something went wrong!')
      setOpenSend(false)
    }
  }

  const handleReceive = () => {
    setOpenReceive(false)
    setTokensLoading(true)
  }

  const handleAccept = () => {
    setOpenReceive(false)
    setTokensLoading(true)
  }

  const handleRefund = () => {
    setOpenReceive(false)
    setTokensLoading(true)
  }

  return (
    <div>
      <Container>
        <Grid container>
          <Grid item container direction='column' align='center'>
            <Grid item>
              <ToastContainer />
            </Grid>
            <Grid item className={classes.title}>
              <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
                BTMS
              </Typography>
            </Grid>
            <Grid item className={classes.sub_title}>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                Basic Tokenization Management System
              </Typography>
            </Grid>
          </Grid>
          <Grid item container align='left' className={classes.table_title} direction='column'>
            <Grid item>
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                My Tokens
              </Typography>
            </Grid>
            <Grid item align='right'>
              {tokens.length >= 1 && (
                <Button component={Link} to='/mint' variant='outlined' color='secondary'>
                  + New Token
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid container align='left' direction='column'>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='left' sx={{ fontWeight: 'bold' }}>Token</TableCell>
                  <TableCell align='right' sx={{ fontWeight: 'bold' }}>Balance</TableCell>
                  <TableCell align='right' sx={{ fontWeight: 'bold' }}>Send</TableCell>
                  <TableCell align='right' sx={{ fontWeight: 'bold' }}>Receive</TableCell>
                </TableRow>
              </TableHead>
              {tokensLoading
                ? <TableBody><TableRow /></TableBody>
                : (
                  <TableBody>
                    {tokens.map((token, i) => {
                      const defineSendToken = (event) => {
                        setTokenKey(token)
                        handleSendOpen(event)
                      }
                      const defineReceiveToken = (event) => {
                        setTokenKey(token)
                        handleReceiveOpen(event)
                      }
                      return (
                        <TableRow
                          key={i} onClick={() => {
                            window.location.href = `/tokens/${token.tokenId}`
                          }} className={classes.link}
                        >
                          <TableCell align='left'>{token.tokenName}</TableCell>
                          <TableCell align='right'>{token.balance}</TableCell>
                          <TableCell align='right'>
                            <Button
                              onClick={defineSendToken}
                              variant='outlined' color='secondary'
                            >
                              Send <SendIcon className={classes.send_icon} />
                            </Button>
                          </TableCell>
                          <TableCell align='right'>
                            <Button
                              onClick={defineReceiveToken}
                              variant='outlined' color='secondary'
                            >
                              Receive
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                )}
            </Table>
          </TableContainer>
          <Grid item container align='center' direction='column'>
            <Grid item>
              <Dialog open={openSend} onClose={handleSendCancel} color='primary'>
                <DialogTitle variant='h4' sx={{ fontWeight: 'bold' }}>
                  Send {tokenKey.tokenName}
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
          </Grid>
          <Grid item container align='center' direction='column'>
            <Grid item>
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
                        <Paper elevation={8}>
                          <Typography>
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item sx={{ display: 'grid', justifyContent: 'right' }}>
                        <Button
                          onClick={copyIdentity}
                          color='secondary'
                        >
                          <ContentCopyIcon className={classes.button} />
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item container className={classes.row_container}>
                      <Grid item>
                        <Typography variant='h6' className={classes.sub_title}>
                          Incoming Transactions:
                        </Typography>
                      </Grid>
                      <Grid item sx={{ display: 'grid', justifyContent: 'right' }}>
                        <IconButton size='small' onClick={refresh}>
                          <RefreshIcon className={classes.button} />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Divider variant='middle' style={{ background: 'white' }} />
                    </Grid>
                    <Grid item container>
                      {incomingTransactions
                        ? (
                          <Table>
                            <TableBody>
                              {transactions.map((transaction, i) => {
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
                              })}
                            </TableBody>
                          </Table>)
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
          </Grid>
        </Grid>
        <Grid container align='center' direction='column' className={classes.no_tokens}>
          {tokensLoading
            ? <LinearProgress color='secondary' />
            : (
              <Grid item container align='center' justifyContent='center'>
                {tokens.length === 0 && (
                  <Grid item container direction='column' sx={{ width: '12em', paddingTop: '2em' }} rowSpacing={2}>
                    <Grid item align='center'>
                      <Card>
                        <CardMedia component='img' height='auto' image='/monkey.svg' />
                      </Card>
                    </Grid>
                    <Grid item align='center'>
                      <Typography variant='h8'>Y' got no tokens yet, m8!</Typography>
                    </Grid>
                    <Grid item align='center' sx={{ paddingTop: '0.5em' }}>
                      <Button component={Link} to='/mint' variant='outlined' color='secondary'>
                        + New Token
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}
        </Grid>
      </Container>
    </div>
  )
}

export default Home
