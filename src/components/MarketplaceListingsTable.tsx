import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableRow, Grid, Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import web3Theme from '../theme'
import { Asset } from '../../../btms-core/out/src'
import { BORDER_RADIUS_DOUBLE, MOCK_PEOPLE_IMAGES, MOCK_TOKEN_IMAGES } from '../utils/constants'
import { AssetOwned, AssetOwner, AssetPriceOrOffer, Person, getAsset, imageBadge, nameFromIdentity } from '../utils/general'

interface MarketplaceListingsTableProps {
  dbg?: boolean
  doLeaveRowSelected?: boolean
  isAssetNotDefined?: boolean
  isSellerInfo?: boolean
  isList?: boolean
  assets: Asset[]
  people: Person[]
  balanceTextToNameMap?: Record<string, string>
  assetPriceOrOfferMap?: { [assetId: string]: AssetPriceOrOffer }  
  assetOwnerMapByIdentity?: { [identity: string]: AssetOwned[] }
  assetOwnerMapByAssetId?: { [assetId: string]: AssetOwner[] }
  rowSelectedAssetId?: { assetId: string; balance: number } | null
  selectedElementId?: string
  mockTokenImages?: Record<string, string>
  setIsFocused?: React.Dispatch<React.SetStateAction<boolean>>
  handleSelectedAsset?: (assetId: string) => void
  removeAsset?: (assetId: string) => void
  onRowAssetClick?: (assetId: string, balance: number) => void
  setDoLeaveRowSelected?: React.Dispatch<React.SetStateAction<boolean>>
}

const MarketplaceListingsTable: React.FC<MarketplaceListingsTableProps> = ({
  dbg = false,
  isList = false,
  assets = [],
  people = [],
  assetPriceOrOfferMap = {},
  assetOwnerMapByIdentity = {},
  assetOwnerMapByAssetId = {},
  balanceTextToNameMap = {},
  mockTokenImages = {},
  onRowAssetClick = () => {},
}) => {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)
  const [hoveredLeftIndex, setHoveredLeftIndex] = useState<number | null>(null)
  const [hoveredRightIndex, setHoveredRightIndex] = useState<number | null>(null)

  const priceDetails = (assetId: string) => {
    const assetDetails = assetPriceOrOfferMap[assetId]
    const isPrice = assetDetails?.isPrice
    const priceOrOffer = isPrice
      ? 'Price:\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0' // Add non-breaking spaces to align offer text
      : 'Make an offer:\u00A0\u00A0\u00A0'
    const amount = assetDetails.offeredAsset.amount
    const asset  = getAsset(assets, assetDetails.offeredAsset.assetId)
    const iconURL = asset.name ? MOCK_TOKEN_IMAGES[asset.name] : ''
    const assetImages = [iconURL, iconURL, iconURL]
  
    const circleStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      width: '1.5em',
      height: '1.5em',
      borderRadius: '50%',
      marginRight: '0.2em',
      overflow: 'hidden' // To ensure the image is contained within the circle
    }
  
    const lozengeStyle: React.CSSProperties = {
      display: 'inline-block',
      backgroundColor: '#00aaff',
      borderRadius: '0.9em',
      padding: '0.3em 0.3em',
      color: '#000',
      fontFamily: 'monospace',
      textAlign: 'left'
    }
  
    const imagesContainerStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'baseline',
      marginBottom: '0.4em',
      paddingBottom: '0.2em'
    }
  
    const imageStyle: React.CSSProperties = {
      width: '100%',
      height: '100%'
    }
      
    return (
      <div 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          fontFamily: 'monospace',
          paddingBottom: '0.2em'
        }}>
        <span
          style={{
            color: '#fff',
            display: 'inline-block',
            textAlign: 'left',
            marginBottom: '0.5em'
          }}>
          {priceOrOffer}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {isPrice ? (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', whiteSpace: 'nowrap', marginBottom: '0.5em' }}>
              <div style={circleStyle}>
                <span style={{ color: '#000' }}>$</span>
              </div>
              <span style={{ color: '#fff' }}>{amount}</span>
            </div>
          ) : (
            <>
              <div style={imagesContainerStyle}>
                {assetImages.map((src, index) => (
                  <div key={index} style={circleStyle}>
                    <img 
                      src={src} 
                      alt='' 
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: index % 2 === 0 ? '#fff' : '#00aaff'
                      }} 
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={lozengeStyle}>
                  <span>{amount} {asset.name}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const sellingDetails = (
    assetId: string,
  ) => {
    const assetOwnerIdentity = assetOwnerMapByAssetId[assetId][0].identity
    const sellerName = nameFromIdentity(people, assetOwnerIdentity)
    const asset  = getAsset(assets, assetId)
    const src = sellerName ? MOCK_PEOPLE_IMAGES[sellerName] : ''
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', marginTop: '0.5em' }}>
        <span style={{ marginRight: '0.5em' }}>by</span>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#4e4e4e',
            width: '2.5em',
            height: '2.5em',
            borderRadius: '50%',
            marginRight: '0.5em',
            overflow: 'hidden',
            flexShrink: 0, // Prevent shrinking
          }}
        >
          <img 
            src={src} 
            alt='' 
            style={{
              width: '2.5em',
              height: '2.5em',
              objectFit: 'cover',
            }} 
          />
        </div>
        <span style={{ color: '#fff' }}>{sellerName}</span>
      </div>
    )
  }
         
  const nameDetails = (isSellerInfo: boolean = false, name: string) => {
    return (
      <span style={{ 
        fontWeight: isSellerInfo ? 'bold' : 'normal',
        display: 'inline-block !important',
        whiteSpace: 'nowrap'
      }}>
        {name}
      </span>
    )
  }

  const row = (asset: Asset, iconURL: string | undefined) => (
    <TableRow
      key={asset.assetId}
      onClick={() => onRowAssetClick(asset.assetId, asset.balance)}
      onMouseEnter={() => setHoveredRowId(asset.assetId)}
      onMouseLeave={() => setHoveredRowId(null)}
      style={{
        backgroundColor: hoveredRowId === asset.assetId ? '#3a3a3a' : '#2b2b2b',
        cursor: 'pointer',
        borderRadius: BORDER_RADIUS_DOUBLE,
        borderBottom: '1px solid rgba(81, 81, 81, 0.5)', // Lighter bottom border
      }}
    >
      <TableCell style={{ color: '#fff', padding: '0px' }}>
        <Grid container alignItems='center' style={{ flexWrap: 'nowrap', marginTop: '0px' }}>
          <Grid item xs={1} />
          {asset.name && imageBadge(iconURL, asset.name, '6em', '0.5em')}
          <Grid item xs={1}>
            <div>
              {asset.name && nameDetails(true, asset.name)}
              {sellingDetails(asset.assetId)}
              {asset.balance > 0 && <span style={{ display: 'block' }}>
                {balanceTextToNameMap[asset.assetId]}:
                {asset.name === 'USD' ? '$' : ''}
                {asset.balance}
              </span>}
            </div>
          </Grid>
          <Grid item xs={8} 
            style={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              marginRight: '1em',
              textAlign: 'left'
            }}>
            {priceDetails(asset.assetId)}
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </TableCell>
    </TableRow>
  )

  const rowPair = (
    index: number,
    asset: Asset,
    iconURL: string | undefined,
    isLeftColumn: boolean,
    nextAssetName: string,
    nextAssetId: string,
    nextAssetBalance: number
  ) => (
    <TableRow key={`row-${index}`}>
      <TableCell
        onMouseEnter={() => setHoveredLeftIndex(index)}
        onMouseLeave={() => setHoveredLeftIndex(null)}
        style={{
          backgroundColor: hoveredLeftIndex === index ? '#2b2b2b' : '#121212',
          padding: '0px',
          borderBottom: '0px',
          borderRight: '1em solid #121212', // Ensure gap between left and right, set to background
        }}
      >
        <Grid
          container
          alignItems='center'
          style={{
            width: '100%',
            marginLeft: '0px',
            justifyContent: 'space-between',
            marginTop: '0px',
            flexWrap: 'nowrap',
          }}
        >
          {asset.name && imageBadge(
            iconURL, 
            asset.name, 
            '6em',
            '0em 0.5em 0em 0em',
            assets
          )}
          <Grid item xs={1}>
            <div>
            {asset.name && nameDetails(true, asset.name)}
              {sellingDetails(asset.assetId)}
              {asset.balance > 0 && (
                <span style={{ display: 'block' }}>
                  {balanceTextToNameMap[asset.assetId]}:
                  {asset.name === 'USD' ? '$' : ''}
                  {asset.balance}
                </span>
              )}
            </div>
          </Grid>
          <Grid item xs={8}
            style={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              marginRight: '1em',
              textAlign: 'left'
            }}>
            {priceDetails(asset.assetId)}
          </Grid>
          <Grid item xs={1}
            style={{
              backgroundColor: hoveredLeftIndex === index ? '#121212' : '#121212',
              width: '1em',
              height: '7em',
            }} />
        </Grid>
      </TableCell>
      <TableCell
        onMouseEnter={() => setHoveredRightIndex(index)}
        onMouseLeave={() => setHoveredRightIndex(null)}
        style={{
          backgroundColor: hoveredRightIndex === index ? '#2b2b2b' : '#121212',
          visibility: isLeftColumn && index === assets.length - 1 ? 'hidden' : 'visible',
          padding: '0px 0px', // Remove padding for column separator
          borderBottom: '0px', // Remove default 1px bottom border 
        }}
      >
        <Grid
          container
          alignItems='center'
          style={{
            width: '100%',
            justifyContent: 'space-between',
            marginTop: '0px', // Remove default
            flexWrap: 'nowrap',
          }}
        >
          {nextAssetName && imageBadge(
            mockTokenImages[nextAssetName] || undefined,
            nextAssetName,
            '6.0em',
            '0em 0.5em 0em 0em',
            assets
          )}
          <Grid item xs={1}>
            {nextAssetName && <div>
              {nameDetails(true, nextAssetName)}
              {sellingDetails(nextAssetId)}
              {nextAssetBalance > 0 && (
                <span style={{ display: 'block' }}>
                  {balanceTextToNameMap[nextAssetId]}:
                  {nextAssetName === 'USD' ? '$' : ''}
                  {nextAssetBalance}
                </span>
              )}
            </div>}
          </Grid>
          <Grid item xs={9}
            style={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              marginRight: '1em',
              textAlign: 'left'
            }}>
            {nextAssetName && priceDetails(nextAssetId)}
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  )
  
  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <TableContainer style={{ maxWidth: '100%' }}>
          <Table sx={{ minWidth: '40px', borderCollapse: 'separate', borderSpacing: '0 1em' }}
            aria-label='assets-table'
            size='small'
            style={{ justifyContent: 'space-between', maxWidth: '100%' }}>
            <TableBody>
              {assets?.map((asset, index) => {
                const iconURL: string | undefined = asset.name ? (mockTokenImages && mockTokenImages[asset.name]) : undefined
                if (isList) {
                  return true && row(getAsset(assets, asset.assetId), iconURL)
                } else {

                  // Not list layout so must be grid layout
                  // If left column only, duplicate in right column and remove
                  const nextAsset = assets.length % 2 === 1 && index === assets.length - 1 
                  ? assets[index]
                  : assets[index + 1]
                  const nextAssetName = nextAsset && nextAsset.name ? nextAsset.name : ''
                  const nextAssetId = nextAsset && nextAsset.assetId ? nextAsset.assetId : ''
                  const nextAssetBalance = nextAsset && nextAsset.balance ? nextAsset.balance : 0
                  const isLeftColumn = index % 2 === 0 && index === assets.length - 1
                  if (index % 2 === 0) {

                    // Render a row with two assets (left and right)
                    return true && 
                      rowPair(
                        index,
                        asset,
                        iconURL,
                        isLeftColumn,
                        nextAssetName,
                        nextAssetId,
                        nextAssetBalance
                      )
                  }
                }
                return null
              })}
              </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  )
}

export default  MarketplaceListingsTable

