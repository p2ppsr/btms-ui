import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useStyles from './home-style'
import {
  Grid, Typography, Button, LinearProgress, TableContainer,
  Table, TableHead, TableBody, TableRow, TableCell, Container, Card, CardMedia, Box
} from '@mui/material'
import Send from '../../components/Send'
import Receive from '../../components/Receive'
import BTMS from '../../utils/BTMS'
import { toast } from 'react-toastify'
import { requestGroupPermission } from '@babbage/sdk'

const Home = ({ history }) => {
  const classes = useStyles()
  const [tokens, setTokens] = useState([])
  const [tokensLoading, setTokensLoading] = useState(true)

  const refresh = async () => {
    const assets = await BTMS.listAssets()
    setTokens(assets)
  }

  useEffect(() => {
    (async () => {
      if (!window.localStorage.hasRequestedGroupPermission) {
        await requestGroupPermission()
        window.localStorage.hasRequestedGroupPermission = true
      }
      try {
        const assets = await BTMS.listAssets()
        setTokens(assets)
      } catch (error) {
        console.error(error)
        toast.error(error.message || 'Something went wrong!')
      } finally {
        setTokensLoading(false)
      }
      interval = setInterval(() => {
        refresh()
      }, 5000)
    })()
    let interval
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  return (
    <div>
      <Container>
        <Grid container>
          <Grid item container direction='column' align='center'>
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
                      return (
                        <TableRow
                          key={i}
                          className={classes.link}
                        >
                          <TableCell
                            align='left'
                            style={{
                              width: '0.1em',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              history.push(`/tokens/${token.assetId.replace('.', '_')}`)
                            }}
                          >
                            <img src={token.tokenIcon || '/favicon.svg'} style={{ height: '2em' }} />
                          </TableCell>
                          <TableCell
                            align='left'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              history.push(`/tokens/${token.assetId.replace('.', '_')}`)
                            }}
                          >
                            {token.name}
                          </TableCell>
                          <TableCell align='right'>{token.balance}</TableCell>
                          <TableCell align='right'>
                            <Send assetId={token.assetId} asset={token} onReloadNeeded={refresh} />
                          </TableCell>
                          <TableCell align='right'>
                            <Receive assetId={token.assetId} asset={token} badge={token.incoming} onReloadNeeded={refresh} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                )}
            </Table>
          </TableContainer>
        </Grid>
        <Grid container align='center' direction='column' className={classes.no_tokens}>
          {tokensLoading
            ? <Box>
              <br />
              <br />
              <Typography variant='body' sx={{ paddingBottom: '2em' }}>Loading tokens...</Typography>
              <br />
              <br />
              <LinearProgress color='secondary' />
            </Box>
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
                      <Typography variant='h8'>No tokens yet.</Typography>
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
