import React, { useEffect, useRef, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Grid,
  IconButton,
  useTheme,
  TableHead,
  Box,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import web3Theme from '../theme'
import { Asset } from '../../../btms-core/out/src'
import Button from './Button'
import { BORDER_RADIUS } from '../utils/constants'

const mockTokenDefaultImage = 'mock/tokenIcon-A1.png'

interface MyAssetsTableProps {
	dbg?: boolean
  isVisible?: boolean
  tokens: Asset[]
  mockTokenImages?: Record<string, string>
}

const MyAssetsTable: React.FC<MyAssetsTableProps> = ({
  dbg = false,
  isVisible=true,
  tokens=[],
  mockTokenImages={}
}) => {

  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <Grid
          container
          spacing={2}
          style={{
            paddingLeft: '16px',
            visibility: isVisible ? 'visible' : 'hidden',
            display: isVisible ? 'block' : 'none',
          }}
        >
          <Grid item xs={5} />
          <TableContainer
            style={{
              //height: '16em',
              overflowY: 'auto',
              borderRadius: BORDER_RADIUS,
              //border: '1px solid rgba(128, 128, 128, 0.77)',
            }}
          >
            <Table sx={{ minWidth: 250 }} aria-label='assets-table' size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: 'left', fontWeight: 'bold' }}>Token</TableCell>
                  <TableCell sx={{ textAlign: 'left' }}></TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>Balance</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>Send</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>Receive</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokens?.map((asset) => {
                  const iconURL = asset.name ? mockTokenImages[asset.name] || mockTokenDefaultImage : mockTokenDefaultImage
                  return (
                    <TableRow key={asset.assetId}>
                      <TableCell sx={{ textAlign: 'left' }}>{asset.name}</TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>
                        <img src={iconURL} alt={asset.name}
                        style={{ alignContent: 'start', width: '3em', height: '3em' }} 
                      />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>{asset.balance}</TableCell>
                      <TableCell align='right'>
                      <Button
                        isDisabled={false}
                        label='Send'
                        justifyContent='flex-end'
                        handleOnMouseEnter={() => {}}
                        handleOnMouseLeave={() => {}}
                        handleOnBlur={() => {}}
                        handleOnClick={() => {}}
                      />
                      </TableCell>
                      <TableCell align='right'>
                      <Button 
                        isDisabled={false}
                        label='Receive'
                        justifyContent='flex-end'
                        handleOnMouseEnter={() => {}}
                        handleOnMouseLeave={() => {}}
                        handleOnBlur={() => {}}
                        handleOnClick={() => {}}
                      />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default MyAssetsTable

