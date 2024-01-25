import React, { useState, useEffect } from 'react'
import useStyles from './tokens-style'
import { Link } from 'react-router-dom'
import {
  Grid, Typography, Button, TableContainer, Box, LinearProgress,
  Table, TableHead, TableBody, TableRow, TableCell, Container
} from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import Send from '../../components/Send'
import Receive from '../../components/Receive'
import BTMS from '../../utils/BTMS'

const Tokens = ({ match }) => {
  const classes = useStyles()
  let tokenID = match.params.tokenID
  if (tokenID) {
    tokenID = tokenID.replace('_', '.')
  }
  const [token, setToken] = useState({})
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refresh = async () => {
    const assets = await BTMS.listAssets()
    const found = assets.find(x => x.assetId = tokenID)
    if (!found) {
      setError(true)
      setLoading(false)
      toast.error('Asset not found!')
      return
    }
    setToken(found)
    const transactions = await BTMS.getTransactions(tokenID)
    setTransactions(transactions.transactions)
  }

  useEffect(() => {
    (async () => {
      await refresh()
      setLoading(false)
    })()
  }, [tokenID])

  if (error) {
    return (
      <div>
        <Container>
          <Grid container>
            <Grid item className={classes.back_button}>
              <Button component={Link} to='/' color='secondary'>
                <ArrowBackIosNewIcon className={classes.back_icon} /> My Tokens
              </Button>
            </Grid>
          </Grid>
          <Box>
            <br />
            <br />
            <Typography align='center'>
              Asset not found.
            </Typography>
          </Box>
        </Container>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <Container>
          <Grid container>
            <Grid item className={classes.back_button}>
              <Button component={Link} to='/' color='secondary'>
                <ArrowBackIosNewIcon className={classes.back_icon} /> My Tokens
              </Button>
            </Grid>
          </Grid>
          <Box>
            <br />
            <br />
            <LinearProgress color='secondary' />
          </Box>
        </Container>
      </div>
    )
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
              <img src={token.tokenIcon || '/BTMS-Icon.svg'} style={{ height: '10em' }} />
            </Grid>
            <Grid item className={classes.title}>
              <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
                {token.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ fontWeight: 'bold' }}>
                {token.balance}
              </Typography>
            </Grid>
            <Grid item className={classes.sub_title}>
              <Typography>
                Current balance
              </Typography>
            </Grid>
            <Grid item container justifyContent='center' direction='row'>
              <Grid item align='left' style={{ paddingRight: '2em' }}>
                <Receive asset={token} assetId={tokenID} badge={token.incoming} onReloadNeeded={refresh} />
              </Grid>
              <Grid item align='right'>
                <Send asset={token} assetId={tokenID} onReloadNeeded={refresh} />
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
              {loading
                ? <TableBody><TableRow /></TableBody>
                : (
                  <TableBody>
                    {transactions.map((tx, i) => {
                      return (
                        <TableRow
                          key={i}
                        >
                          <TableCell align='left' style={{ width: '0.1em' }}>
                            {tx.date}
                          </TableCell>
                          <TableCell align='left'>
                            {tx.amount}
                          </TableCell>
                          <TableCell align='right'>{tx.counterparty}</TableCell>
                          <TableCell align='right'>{tx.txid}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                )}
            </Table>
          </TableContainer>
        </Grid>
      </Container>
    </div>
  )
}

export default Tokens