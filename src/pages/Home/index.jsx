import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useStyles from './home-style'
import {
  Grid, Typography, Button, LinearProgress, TableContainer,
  Table, TableHead, TableBody, TableRow, TableCell, Container, Card, CardMedia
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

const Home = () => {
  const classes = useStyles()
  const [tokens, setTokens] = useState([{ 'assetName': 'Test', 'balance': '100', 'assetIcon': 'testing', 'assetId': '0' }, { 'assetName': 'test2', 'balance': '50', 'assetIcon': 'testing2', 'assetId': '1' }, { 'assetName': '123', 'balance': '100', 'assetIcon': 'testing', 'assetId': '134134' }, { 'assetName': 'Test', 'balance': '100', 'assetIcon': 'testing', 'assetId': '13423' }, { 'assetName': 'Test', 'balance': '100', 'assetIcon': 'testing', 'assetId': '4353' }, { 'assetName': 'Test', 'balance': '100', 'assetIcon': 'testing', 'assetId': '0' }])
  const [tokensLoading, setTokensLoading] = useState(false)

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
                My Assets
              </Typography>
            </Grid>
            <Grid item align='right'>
              {tokens.length >= 1 && (
                <Button component={Link} to='/mint' variant='outlined' color='secondary'>
                  + New Asset
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
              {tokensLoading ? <br />
                : (
                  <TableBody>
                    {tokens.map((token, i) => (
                      <TableRow key={i} component={Link} to={`/assets/${token.assetId}`} className={classes.link} >
                        <TableCell align='left'>{token.assetName}</TableCell>
                        <TableCell align='right'>{token.balance}</TableCell>
                        <TableCell align='right'>
                          <Button component={Link} to={`/assets/${token.assetId}/send`} variant='outlined' color='secondary'>
                            Send <SendIcon className={classes.send_icon} />
                          </Button>
                        </TableCell>
                        <TableCell align='right'>
                          <Button component={Link} to={`/assets/${token.assetId}/receive`} variant='outlined' color='secondary'>
                            Receive
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
            </Table>
          </TableContainer>
        </Grid>
        <Grid container align='center' direction='column' className={classes.no_tokens}>
          {tokensLoading ? <LinearProgress color='secondary' />
            : (
              <Grid item continer align='center'>
                {tokens.length === 0 && (
                  <Grid item container direction='column' sx={{ width: '12em', paddingTop: '2em' }} rowSpacing={2}>
                    <Grid item align='center'>
                      <Card>
                        <CardMedia component='img' height='auto' image='/monkey.svg' />
                      </Card>
                    </Grid>
                    <Grid item align='center'>
                      <Typography variant='h8'>Y' got no assets yet, m8!</Typography>
                    </Grid>
                    <Grid item align='center' sx={{ paddingTop: '0.5em' }}>
                      <Button component={Link} to='/mint' variant='outlined' color='secondary'>
                        + New Asset
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

export default Home
