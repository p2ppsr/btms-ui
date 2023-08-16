import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useStyles from './home-style'
import { ToastContainer } from 'react-toastify'
import {
  Grid, Typography, Button, LinearProgress, TableContainer,
  Table, TableHead, TableBody, TableRow, TableCell, Container, Card, CardMedia, Badge
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import Send from '../../components/Send'
import Receive from '../../components/Receive'
import BTMS from '../../utils/BTMS'

const Home = () => {
  const classes = useStyles()
  // { tokenName: 'Test', balance: '100', tokenIcon: '/favicon.svg', tokenId: '0' }, { tokenName: 'test2', balance: '50', tokenIcon: '/favicon.svg', tokenId: '1' }, { tokenName: '123', balance: '100', tokenIcon: '/favicon.svg', tokenId: '134134' }, { tokenName: 'Test3', balance: '100', tokenIcon: '/favicon.svg', tokenId: '13423' }, { tokenName: 'Test4', balance: '100', tokenIcon: '/favicon.svg', tokenId: '4353' }, { tokenName: 'Test', balance: '100', tokenIcon: '/favicon.svg', tokenId: '0' }
  const [tokens, setTokens] = useState([])
  const [tokensLoading, setTokensLoading] = useState(false)
  const [openSend, setOpenSend] = useState(false)
  const [openReceive, setOpenReceive] = useState(false)
  const [tokenKey, setTokenKey] = useState('')
  const [incomingTransactions, setIncomingTransactions] = useState([])

  const handleSendOpen = (event) => {
    event.stopPropagation()
    setOpenSend(true)
  }

  const handleReceiveOpen = (event) => {
    event.stopPropagation()
    setOpenReceive(true)
  }

  useEffect(() => {
    (async () => {
      const assets = await BTMS.listAssets()
      console.log(assets)
      setTokens(assets)
    })()
  }, [])

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
                  <TableCell align='left' sx={{ fontWeight: 'bold' }} colSpan={2}>Token</TableCell>
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
                          key={i} className={classes.link}
                        >
                          <TableCell align='left' style={{ width: '0.1em' }}>
                            <img src={token.tokenIcon} style={{ height: '2em' }} />
                          </TableCell>
                          <TableCell align='left'>
                            {token.name}
                          </TableCell>
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
                            <Receive assetId={token.assetId} asset={token} badge={token.incoming} />
                          </TableCell>
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
