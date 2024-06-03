import { useEffect, useState, useRef, MouseEvent as ClickEvent } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Grid,
  IconButton,
  Box,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import web3Theme from '../theme'
import { Asset } from '../../../btms-core/out/src'
import { BORDER_RADIUS } from '../utils/constants'
import { Person } from '../utils/general'

const mockTokenDefaultImage = 'mock/tokenIcon-A1.png'

interface AssetsTableProps {
	dbg?: boolean
  isAssetFilter?: boolean
  isPersonFilter?: boolean
  isVisible?: boolean
	doLeaveRowSelected?: boolean
  isAssetNotDefined?: boolean
  label?: string
  assets: Asset[] | null
  person?: Person[] | null
  balanceTextToNameMap?: Record<string, string>
	rowSelectedAssetId?: { assetId: string; balance: number } | null
	rowSelectedIdentity?: { identity: string; isTrusted: boolean } | null
  selectedElementId?: string
  mockTokenImages?: Record<string, string>
	setIsFocused?: React.Dispatch<React.SetStateAction<boolean>>
  handleSelectedAsset?: (assetId: string) => void
  setRowSelectedAssetId?: React.Dispatch<React.SetStateAction<{ assetId: string; balance: number } | null>>
  setRowSelectedIdentity?: React.Dispatch<React.SetStateAction<{ identity: string; isTrusted: boolean } | null>>
  removeAsset?: (assetId: string) => void
	onRowAssetClick?: (assetId: string, balance: number) => void
	setDoLeaveRowSelected?: React.Dispatch<React.SetStateAction<boolean>>
}

const AssetsTable: React.FC<AssetsTableProps> = ({
  dbg = false,
  isAssetFilter = true,
  isPersonFilter = false,
  isVisible = true,
	doLeaveRowSelected = false,
  isAssetNotDefined = false,
  label = '',
  assets = [],
  person = [],
  balanceTextToNameMap = {},
  rowSelectedAssetId = null,
  rowSelectedIdentity = null,
  selectedElementId = '',
  mockTokenImages = [],
  setIsFocused = () => {},
  handleSelectedAsset = () => {},
  setRowSelectedAssetId = () => {},
  setRowSelectedIdentity = () => {},
  removeAsset = () => {},
  onRowAssetClick = () => {},
	setDoLeaveRowSelected = () => {},
}) => {

  const [$selectedElementId, setSelectedElementId] = useState<string>('')
  const [isClickedTable, setIsClickedTable] = useState(false)
  const [isHoveredTable, setIsHoveredTable] = useState<boolean>(false)
  const [isHoveredRow, setIsHoveredRow] = useState<string | null>(null)

  type AssetOrPerson = { type: 'asset'; data: Asset } | { type: 'person'; data: Person }

  const combined: AssetOrPerson[] = [
    ...(assets?.map(asset => ({ type: 'asset', data: asset })) || []),
    ...(person?.map(person => ({ type: 'person', data: person })) || [])
  ] as Array<{ type: 'asset'; data: Asset } | { type: 'person'; data: Person }>

  useEffect(() => {
    setSelectedElementId(selectedElementId)
  }, [selectedElementId])

  	const isClickedRowPerson = (identity: string, isTrusted: boolean | undefined) => {
		const clicked = rowSelectedIdentity && rowSelectedIdentity.identity === identity
		return clicked
	}

	const handleRowClickPerson = (identity: string, isTrusted: boolean | undefined) => {
    setIsFocused(true)
  }

  const isClickedRowAsset = (assetId: string, balance: number) => {
		const clicked = rowSelectedAssetId && rowSelectedAssetId.assetId === assetId
		return clicked
	}

	const handleRowClickAsset = (assetId: string, balance: number) => {
    onRowAssetClick(assetId, balance) // Notify parent of row click
    setIsFocused(true)
    handleSelectedAsset(assetId)
  }
   
  const handleOnClickTable = () => {
    setIsClickedTable(true)
    setIsFocused(true)
  }

  const handleMouseEnterTable = () => {
    setIsHoveredTable(true)
    setIsFocused(true)
  }

  const handleMouseLeaveTable = () => {
    setIsHoveredTable(false)
    setIsFocused(true)
  }

  const handleMouseEnterTableRow = (assetId: string) => {
    setIsHoveredRow(assetId)
    setIsFocused(true)
  }

  const handleMouseLeaveTableRow = () => {
    setIsHoveredRow(null)
    setIsFocused(false)
  }
	
	const handleRemoveAsset = (assetId: string) => {
    setIsFocused(true)
    removeAsset(assetId)
  }

  const tableContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableContainerRef.current && !tableContainerRef.current.contains(event.target as Node)) {
        setIsClickedTable(false)
        setIsHoveredTable(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <Grid
          container
          spacing={2}
          style={{
            paddingLeft: '1em',
            visibility: isVisible ? 'visible' : 'hidden',
            display: isVisible ? 'block' : 'none',
          }}
        >
          <Grid item xs={5} />
          <TableContainer
            ref={tableContainerRef}
            onClick={handleOnClickTable}
            onMouseEnter={handleMouseEnterTable}
            onMouseLeave={handleMouseLeaveTable}
            style={{
              height: '16em',
              overflowX: 'hidden',
              overflowY: 'auto',
              borderRadius: BORDER_RADIUS,
              border: isClickedTable
                ? '2px solid rgba(255, 255, 255, 1)'
                : isHoveredTable
                ? '1px solid rgba(255, 255, 255, 1)' // 1px solid with opacity 1.0 when hovered
                : '1px solid rgba(128, 128, 128, 0.77)', // Default 1px solid with lower opacity
            }}
          >
            <Table sx={{ minWidth: 250 }} aria-label='assets-table' size='small'>
              <TableBody>
                {combined?.map((item) => {
                  if (isAssetFilter && item.type === 'asset') {
                    const asset = item.data as Asset
                    if (asset.name !== undefined) {
                      const iconURL = asset.name ? mockTokenImages && mockTokenImages[asset.name] || mockTokenDefaultImage : mockTokenDefaultImage
                      return (
                        <TableRow
                          key={asset.assetId}
                          onMouseEnter={() => handleMouseEnterTableRow(asset.assetId)}
                          onMouseLeave={handleMouseLeaveTableRow}
                          onClick={() => handleRowClickAsset(asset.assetId, asset.balance)}
                          style={{
                            //padding: '0px',
                            cursor: 'pointer',
                            color: isClickedRowAsset(asset.assetId, asset.balance) ? '#000' : '#fff',
                            backgroundColor: isClickedRowAsset(asset.assetId, asset.balance) 
                            ? '#fff' : isHoveredRow === asset.assetId ? '#2b2b2b' 
                            : 'transparent',

                            //backgroundColor: isClickedRowAsset(asset.assetId, asset.balance) ? '#fff' : 'transparent',
                          }}
                        >
                          <TableCell style={{ color: isClickedRowAsset(asset.assetId, asset.balance) ? '#000' : '#fff' }}>
                            <Grid item xs={12} container spacing={2} alignItems='center'>
                              <Grid item xs={2} paddingTop='1em'>
                                {asset.name !== 'USD' && (
                                  <img src={iconURL} alt={asset.name} 
                                  style={{ 
                                    width: '3em',
                                    height: '3em',
                                    paddingRight: '0.3em' 
                                  }} />
                                )}
                              </Grid>
                              <Grid item xs={9}>
                                <div>
                                  <span style={{textDecoration: 'bold'}}>{asset.name}</span>
                                  {asset.balance > 0 && (
                                    <>
                                    <br />
                                    <span>
                                      {balanceTextToNameMap[asset.assetId]}: 
                                      {asset.name === 'USD' ? '$' : ''}
                                      {asset.balance}
                                    </span>
                                    </>
                                    )
                                  }
                                </div>
                              </Grid>
                              <Grid item xs={1}>
                                {balanceTextToNameMap[asset.assetId] === label && (
                                  <IconButton 
                                    onClick={() => handleRemoveAsset(asset.assetId)} size='small'
                                    style={{
                                      cursor: 'pointer',
                                      color: isClickedRowAsset(asset.assetId, asset.balance) ? '#000' : '#fff',
                                      //backgroundColor: isClickedRowAsset(asset.assetId, asset.balance) ? '#fff' : 'transparent',
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>)}
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      )
                    }
                  } else if(isPersonFilter) {
                    const person = item.data as Person
                    if (person.identity !== undefined) {
                      const iconURL = person.iconURL 
                      return (
                        <TableRow
                          key={person.identity}
                          onMouseEnter={() => handleMouseEnterTableRow(person.identity)}
                          onMouseLeave={handleMouseLeaveTableRow}
                          onClick={() => handleRowClickPerson(person.identity, person.isTrusted)}
                          style={{
                            //padding: '0px',
                            cursor: 'pointer',
                            //color: isClickedRowPerson(person.assetId, person.balance) ? '#000' : '#fff',
                            //backgroundColor: isClickedRowPerson(person.assetId, person.balance) 
                            //</TableBody>? '#fff' : isHoveredRow === person.assetId ? '#2b2b2b' 
                            //: 'transparent',

                            //backgroundColor: isClickedRowPerson(person.assetId, person.balance) ? '#fff' : 'transparent',
                          }}
                        >
                          <TableCell style={{ color: isClickedRowPerson(person.identity, person.isTrusted) ? '#000' : '#fff' }}>
                            <Grid item xs={12} container spacing={2} alignItems='center'>
                              <Grid item xs={2} paddingTop='1em'>
                                <img src={iconURL} alt={`${person.firstName} ${person.lastName}`} 
                                style={{ 
                                  width: '3em',
                                  height: '3em',
                                  paddingRight: '0.3em' 
                                }} />
                              </Grid>
                              <Grid item xs={9}>
                                <div>
                                  <span style={{textDecoration: 'bold'}}>{person.firstName} {person.lastName}</span>
                                </div>
                              </Grid>
                              <Grid item xs={1} />
                            </Grid>
                          </TableCell>
                        </TableRow>
                      )
                    }
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default AssetsTable
