import React, { useState } from 'react'
import useStyles from './tokens-style'
import { Link, useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {
  Grid, Typography, Button, TableContainer, Card, CardMedia,
  Table, TableHead, TableBody, TableRow, TableCell, Container
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import Send from '../../components/Send'
import Receive from '../../components/Receive'

const Tokens = () => {
  const classes = useStyles()
  const tokenID = useParams()
  const [tokens, setTokens] = useState([{ tokenName: 'Test', balance: '100', tokenIcon: '/favicon.svg', tokenId: '0' }, { tokenName: 'test2', balance: '50', tokenIcon: '/favicon.svg', tokenId: '1' }, { tokenName: '123', balance: '100', tokenIcon: '/favicon.svg', tokenId: '134134' }, { tokenName: 'Test3', balance: '100', tokenIcon: '/favicon.svg', tokenId: '13423' }, { tokenName: 'Test4', balance: '100', tokenIcon: '/favicon.svg', tokenId: '4353' }, { tokenName: 'Test', balance: '100', tokenIcon: '/favicon.svg', tokenId: '0' }])
  const transactions = [{ tokenName: 'Test', balance: '100', tokenIcon: '/favicon.svg', counterparty: '654321', tokenId: '0', transactionDate: '6/12/22', transactionID: '0349810948' }, { tokenName: 'test2', balance: '50', tokenIcon: '/favicon.svg', counterparty: '123', tokenId: '1', transactionDate: '3/2/22', transactionID: '0349810948' }, { tokenName: '123', balance: '100', tokenIcon: '/favicon.svg', counterparty: '654321', tokenId: '134134', transactionDate: '7/2/22', transactionID: '0349810948' }, { tokenName: 'Test3', balance: '100', tokenIcon: '/favicon.svg', counterparty: '432', tokenId: '3', transactionDate: '7/2/22', transactionID: '0349810948' }, { tokenName: 'Test4', balance: '100', tokenIcon: '/favicon.svg', counterparty: '123', tokenId: '6', transactionDate: '3/2/23', transactionID: '0349810948' }, { tokenName: 'Test', balance: '80', tokenIcon: '/favicon.svg', counterparty: '23', tokenId: '0', transactionDate: '10/9/23', transactionID: '0349810948' }]
  const [tokensLoading, setTokensLoading] = useState(false)
  const [openSend, setOpenSend] = useState(false)
  const [openReceive, setOpenReceive] = useState(false)
  let tokenKey = transactions.filter(item => item.tokenId === tokenID.tokenID)
  const [incomingTransactions, setIncomingTransactions] = useState([{ transactionName: 'Test', transactionQuantity: '10', txid: '678', transactionDate: '6/12/22' }, { transactionName: '123', transactionQuantity: '80', txid: '2', transactionDate: '3/2/22' }, { transactionName: 'Test', transactionQuantity: '3', txid: '5', transactionDate: '7/2/22' }])

  const handleSendOpen = (event) => {
    event.stopPropagation()
    setOpenSend(true)
  }

  const handleReceiveOpen = (event) => {
    event.stopPropagation()
    setOpenReceive(true)
  }

  return (
    <div>
      <Container>
        <Grid container>
          <Grid item className={classes.back_button}>
            <Button component={Link} to='/' color='secondary'>
              <ArrowBackIosNewIcon className={classes.back_icon} /> My Tokens
            </Button>
          </Grid>
          <Grid item container direction='column' align='center'>
            <Grid item>
              <ToastContainer />
            </Grid>
            <Grid item>
              <img src={tokenKey.length ? tokenKey.map(i => i.tokenIcon).at(0) : '/BTMS-Icon.svg'} style={{ height: '10em' }} />
            </Grid>
            <Grid item className={classes.title}>
              <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
                {tokenKey.map(i => i.tokenName).at(0)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ fontWeight: 'bold' }}>
                {tokenKey.map(i => i.balance).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)}
              </Typography>
            </Grid>
            <Grid item className={classes.sub_title}>
              <Typography>
                Current balance
              </Typography>
            </Grid>
            <Grid item container justifyContent='center' direction='row'>
              <Grid item align='left' style={{ paddingRight: '2em' }}>
                <Button
                  onClick={handleReceiveOpen}
                  variant='outlined' color='secondary'
                >
                  Receive
                </Button>
              </Grid>
              <Grid item align='right'>
                <Button
                  onClick={handleSendOpen}
                  variant='outlined' color='secondary'
                >
                  Send <SendIcon className={classes.send_icon} />
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container align='left' className={classes.table_title} direction='column'>
            <Grid item>
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                Transactions
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container align='left' direction='column'>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='left' sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell align='left' sx={{ fontWeight: 'bold' }}>Transaction Amount</TableCell>
                  <TableCell align='right' sx={{ fontWeight: 'bold' }}>Counterparty</TableCell>
                  <TableCell align='right' sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                </TableRow>
              </TableHead>
              {tokensLoading
                ? <TableBody><TableRow /></TableBody>
                : (
                  <TableBody>
                    {tokenKey.map((token, i) => {
                      return (
                        <TableRow
                          key={i}
                        >
                          <TableCell align='left' style={{ width: '0.1em' }}>
                            {token.transactionDate}
                          </TableCell>
                          <TableCell align='left'>
                            {token.balance}
                          </TableCell>
                          <TableCell align='right'>{token.counterparty}</TableCell>
                          <TableCell align='right'>{token.transactionID}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                )}
            </Table>
          </TableContainer>
          <Send
            openSend={openSend}
            setOpenSend={setOpenSend}
            tokenKey={tokenKey}
            setTokensLoading={setTokensLoading}
          />
          <Receive
            setTokens={setTokens}
            openReceive={openReceive}
            setOpenReceive={setOpenReceive}
            tokenKey={tokenKey}
            incomingTransactions={incomingTransactions}
            setIncomingTransactions={setIncomingTransactions}
          />
        </Grid>
        <Grid container align='center' direction='column' className={classes.no_tokens}>
          {tokensLoading
            ? <LinearProgress color='secondary' />
            : (
              <Grid item container align='center' justifyContent='center'>
                {tokenKey.length === 0 && (
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
    </div >
  )
}

export default Tokens