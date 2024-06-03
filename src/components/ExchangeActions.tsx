import React, { useState, useEffect, useCallback } from 'react'
import { Box, Grid } from '@mui/material'
import { BTMS, Asset } from '../../../btms-core/out/src'
import { ThemeProvider } from '@mui/material/styles'
import web3Theme from '../theme'
import SearchBar from './SearchBar'
import Inputs from './Inputs'
import AssetsTable from './AssetsTable'
import Button from './Button'
import { 
	AVAILABLE_TEXT,
	REMAINDER_TEXT,
	MOCK_TOKEN_IMAGES
} from '../utils/constants'

import {
  updateAssetWithRemainderBalance,
  updateAssetWithAmountBalance,
	isStringNumber,
	getAsset,
	updateExistingAssetNumberProp,
	removeAsset,
	removeNumberElementFromRecords,
	mockFetchAssets,
	fetchAssets
} from '../utils/general'

const DEFAULT_TEXT = 'Enter amount...'
const DEFAULT_ASSET_TEXT = '$'
const WARN_PERIOD_MS = 1000
const SELECT_AN_ASSET_TEXT = 'Select an asset'
const BUTTON_LABEL = '+ Selected Asset'

interface ExchangeActionsProps {
	initialSearchBarText: string
	filteredNames?: string[]
	label: string
  btms: BTMS
	assetsWithAmounts: Asset[]
	defaultAsset?: Asset
	setAreAssetsReady: React.Dispatch<React.SetStateAction<boolean>>
	setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>
}

const ExchangeActions: React.FC<ExchangeActionsProps> = ({ 
	initialSearchBarText,
	filteredNames=[],
	label,
	btms,
	assetsWithAmounts,
	defaultAsset={assetId: '', balance: 0},
	setAreAssetsReady,
	setAssetsWithAmounts
}) => {

	const [showProgress, setShowProgress] = useState<boolean>(false)
  const [assets, setAssets] = useState<Asset[]>([defaultAsset])
	const [amount, setAmount] = useState<number>(0)
  const [balanceTextToNameMap, setBalanceTextToNameMap] = useState<{ [key: string]: string }>({})
  const [balanceTextToWithAmountNameMap, setBalanceTextToWithAmountNameMap] = useState<{ [key: string]: string }>({})
  const [doAssetBalance, setDoAssetBalance] = useState<boolean>(false)
	const [isAddAssetButtonDisabled, setIsAddAssetButtonDisabled] = useState<boolean>(true)
  const [available, setAvailable] = useState<{ [key: string]: number }>({})
  const [remainders, setRemainders] = useState<{ [key: string]: number }>({})
	const [valueSearchBar, setValueSearchBar] = useState<string>(initialSearchBarText)
	const [isFocusedSearchBar, setIsFocusedSearchBar] = useState<boolean>(false)
	const [valueInputAmount, setValueInputAmount] = useState<string>('')
	const [isFocusedInputAmount, setIsFocusedInputAmount] = useState<boolean>(false)
	const [selectedAssetTextInputAmount, setSelectedAssetTextInputAmount] = useState<string>('')
	const [unselectedAssetTextInputAmount, setUnselectedAssetTextInputAmount] = useState<string>('')
	const [selectedAssetTextMouseEnterInputAmount, setSelectedAssetTextMouseEnterInputAmount] = useState<string>('')
	const [unselectedAssetTextMouseEnterInputAmount, setUnselectedAssetTextMouseEnterInputAmount] = useState<string>('')
	const [selectedAssetTextMouseLeaveInputAmount, setSelectedAssetTextMouseLeaveInputAmount] = useState<string>('')
	const [unselectedAssetTextMouseLeaveInputAmount, setUnselectedAssetTextMouseLeaveInputAmount] = useState<string>('')
	const [isValidatedInputAmount, setIsValidatedInputAmount] = useState<boolean>(false)
	const [isDisabledInputAmount, setIsDisabledInputAmount] = useState<boolean>(true)
	const [isElementSelectedInputAmount, setIsElementSelectedInputAmount] = useState<boolean>(false)
	const [isFocusedAssetsTable, setIsFocusedAssetsTable] = useState<boolean>(false)
	const [isVisibleAssetsTable, setIsVisibleAssetsTable] = useState<boolean>(true)
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>('')
  const [rowSelectedAssetId, setRowSelectedAssetId] = useState<{ assetId: string; balance: number } | null>(null)
  const [doLeaveRowSelected, setDoLeaveRowSelected] = useState<boolean>(false)
	const [isAssetNotDefined, setIsAssetNotDefined] = useState<boolean>(false)
	const [removeAssetId, setRemoveAssetId] = useState<string>('')

	const handleRowAssetClick = (assetId: string, balance: number) => {
    const newSelectedAsset = { assetId, balance }
    if (
			!rowSelectedAssetId 
			|| rowSelectedAssetId && rowSelectedAssetId.assetId !== assetId 
		) {
      setRowSelectedAssetId(newSelectedAsset)
    }
  }

  useEffect(() => {
    fetchAssets(
			btms,
			balanceTextToNameMap,
			filteredNames,
			AVAILABLE_TEXT,
			available,
			label,
			setShowProgress,
			setBalanceTextToNameMap,
			setAssets,
			setAvailable
		)
  }, [btms])

  useEffect(() => {
		if (assetsWithAmounts.length === 0) {
			setSelectedAssetId(undefined)
		}		
		setAreAssetsReady(assetsWithAmounts.length > 0)
  }, [assetsWithAmounts])

	const removeAnAsset = useCallback(() => {
		if (removeAssetId !== '') {
			const updatedAssetsWithAmounts = removeAsset(assetsWithAmounts, removeAssetId)
			setAssetsWithAmounts(updatedAssetsWithAmounts)
			const updatedRemainders = removeNumberElementFromRecords(remainders, removeAssetId)
			if (updatedRemainders) {
				setRemainders(updatedRemainders)
			}
			const updatedAssets = updateExistingAssetNumberProp(assets, removeAssetId, available[removeAssetId], 'balance')
			setAssets(updatedAssets)
			const updatedBalanceTextToNameMap = { ...balanceTextToNameMap }
			updatedBalanceTextToNameMap[removeAssetId] = AVAILABLE_TEXT
			setBalanceTextToNameMap(updatedBalanceTextToNameMap)
			if (assetsWithAmounts.length === 0) {
				setSelectedAssetId(undefined)
			} else if (removeAssetId === selectedAssetId) {
				setSelectedAssetId('')
				setValueInputAmount('')
				setRowSelectedAssetId(null)
				setSelectedAssetTextInputAmount('')
			}
			setRemoveAssetId('')
		}
	}, [removeAssetId, assetsWithAmounts, removeAsset, selectedAssetId])
	
	useEffect(() => {
		removeAnAsset()
	}, [removeAssetId, removeAnAsset])
	
	const handleOnChangeSearchBar = async (text: string) => {

		// If text is blank then populate table with full asset listing and let user filter?
		try {
			setValueSearchBar(text)
			setShowProgress(true)
			let fetchAssets = await mockFetchAssets(btms, filteredNames)
			setShowProgress(false)

			// Update available to latest balances
			fetchAssets.forEach((asset) => {
				available[asset.assetId] = asset.balance
			})

			if (text !== '*') {
				fetchAssets = fetchAssets.filter((asset) =>
					asset.name?.toLowerCase().includes(text.toLowerCase())
				)
			}

			const updatedBalanceTextToNameMap = { ...balanceTextToNameMap }
			fetchAssets.forEach((asset) => {
				if (!updatedBalanceTextToNameMap[asset.assetId]) {
					updatedBalanceTextToNameMap[asset.assetId] = AVAILABLE_TEXT
				}
			})
			setBalanceTextToNameMap(updatedBalanceTextToNameMap)
      Object.keys(remainders).forEach((assetId) => {
				const asset = getAsset(fetchAssets, assetId)
        if (asset) {
					fetchAssets = updateExistingAssetNumberProp(fetchAssets, assetId, remainders[assetId], 'balance')
					updatedBalanceTextToNameMap[assetId] = REMAINDER_TEXT
					setIsAssetNotDefined(false)
				} else {
					setIsAssetNotDefined(true)
				}
			})
			setAssets(fetchAssets)
		} catch (error) {
			console.error('Error fetching accept assets:', error)
		} finally {
		}
	}

  const handleClearSearchBar = () => {
    setAssets([])
  }

	const handleSelectedAsset = (assetId: string) => {
		setSelectedAssetId(assetId)
		setIsElementSelectedInputAmount(true)
		setInputAmount(assetId, true)
	}

	const setInputAmount = (assetId: string, isElementSelectedInputAmount: boolean) => {
		if (assetId === defaultAsset.assetId) {
			const text ='$USD...'
			if (isFocusedInputAmount) {
				if (isElementSelectedInputAmount) {
					setValueInputAmount(text)
					setSelectedAssetTextInputAmount(text)
				} else {
					setValueInputAmount(text)
				}
			} else {
				if (isElementSelectedInputAmount) {
					setValueInputAmount(text)
					setSelectedAssetTextInputAmount(text)
				} else {
					setValueInputAmount(text)
				}
			}
		} else {
			const text = DEFAULT_TEXT
			const availableText = `(available ${available[assetId ? assetId : '']})`
			if (isFocusedInputAmount) {
				if (isElementSelectedInputAmount) {
					setValueInputAmount(text)
					setSelectedAssetTextInputAmount(`${text}${availableText}`)
				} else {
					setValueInputAmount(text)
				}
			} else {
				if (isElementSelectedInputAmount) {
					setValueInputAmount(text)
					setSelectedAssetTextInputAmount(`${text}${availableText}`)
				} else {
					setValueInputAmount(`${text}${availableText}`)
				}
			}			
		}
	}

	const handleAddAssets = () => {
		setDoLeaveRowSelected(true)
		if (selectedAssetId !== '' && selectedAssetId !== undefined) {
			if (!isValidatedInputAmount 
				|| Number(valueInputAmount) < 0 ) {
				console.error(`Invalid ${label} asset or amount`)
				return
			}
			const amount = Number(valueInputAmount)
			setIsAddAssetButtonDisabled(true)
			setAmount(amount)

			// Not implemented, 0 currently an invalid amount
			if (amount === 0) {
				setRemoveAssetId(selectedAssetId)
			} else {
				updateAssetWithAmountBalance(
					false,
					assets,
					assetsWithAmounts,
					selectedAssetId,
					amount,
					setAssetsWithAmounts
				)
				balanceTextToWithAmountNameMap[selectedAssetId] = label
				setDoAssetBalance(true)
			}

			const remainder = available[selectedAssetId] - amount
			if (getAsset(assets, selectedAssetId)) {
				updateAssetWithRemainderBalance(false, assets, selectedAssetId, remainder, setAssets)
				const updatedRowSelectedAssetId = { assetId: selectedAssetId, balance: remainder }
				setRowSelectedAssetId(updatedRowSelectedAssetId)
				const updatedBalanceTextToNameMap = { ...balanceTextToNameMap }
				updatedBalanceTextToNameMap[selectedAssetId] = REMAINDER_TEXT
				setBalanceTextToNameMap(updatedBalanceTextToNameMap)
			}
			remainders[selectedAssetId] = remainder
			setIsValidatedInputAmount(false)
		}
  }

  const handleOnChangeInputAmount = (value: string, isUnprintableChar: boolean) => {

		// Validate the amount of the asset
		const valueInputAmount = value
    setIsFocusedInputAmount(true)

		if (!isUnprintableChar) {
			if (!isStringNumber(valueInputAmount)) {
				setValueInputAmount('Digits only')
				setTimeout(() => {
					setValueInputAmount('')
				}, WARN_PERIOD_MS)
				return
			}
    }

    const numberInputAmount = parseFloat(valueInputAmount)
		if (selectedAssetId) {
			const balance = available[selectedAssetId]

			if (numberInputAmount > balance && selectedAssetId !== defaultAsset.assetId) {
				setValueInputAmount(`<= ${balance}`)
				setTimeout(() => {
					setValueInputAmount('')
					setIsAddAssetButtonDisabled(true)
				}, 500)
			} else if (numberInputAmount === 0) { 
				setValueInputAmount('> 0')
				setTimeout(() => {
					setValueInputAmount('')
				}, 500)
			} else {
				if (isUnprintableChar && isNaN(numberInputAmount)) {
					setValueInputAmount('')
				} else {
					setValueInputAmount(numberInputAmount.toString())
					setIsValidatedInputAmount(true)
				}
			}
			const isAddAssetBUttonDisabled =
			valueInputAmount === DEFAULT_TEXT
			|| valueInputAmount === ''
			|| valueInputAmount === '0'
			setIsAddAssetButtonDisabled(isAddAssetBUttonDisabled)
		}
	}

	return (
		<ThemeProvider theme={web3Theme}>
			<Box>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<SearchBar		
						//dbg={true}
						value={valueSearchBar}
						showProgress={showProgress}
						initialText={initialSearchBarText}
						handleOnChange={handleOnChangeSearchBar}
						handleClear={handleClearSearchBar}
						setValue={setValueSearchBar}
						setIsFocused={setIsFocusedSearchBar}
					/>
					</Grid>
					<Grid item xs={12}>
						{assets.length > 0 && <AssetsTable
							//dbg={true}
							isVisible={isVisibleAssetsTable}
							doLeaveRowSelected={doLeaveRowSelected}
							isAssetNotDefined={isAssetNotDefined}
							label={label}
							assets={assets}
							balanceTextToNameMap={balanceTextToNameMap}
							rowSelectedAssetId={rowSelectedAssetId}
							selectedElementId={selectedAssetId ? selectedAssetId : ''}
							mockTokenImages={MOCK_TOKEN_IMAGES}
							setIsFocused={setIsFocusedAssetsTable}
							handleSelectedAsset={handleSelectedAsset}
							setRowSelectedAssetId={setRowSelectedAssetId}
							removeAsset={setRemoveAssetId}
							onRowAssetClick={handleRowAssetClick}
							setDoLeaveRowSelected={setDoLeaveRowSelected}
						/>}
					</Grid>
					<Grid item xs={8}>
						{selectedAssetId !== undefined && <Inputs
							dbg={true}
							value={valueInputAmount}
							label={selectedAssetTextInputAmount}
							isVisible={selectedAssetId !== ''}
							isDisabled={selectedAssetId === ''}
							doMouseLeave={!isStringNumber(valueInputAmount)}
							doMouseEnter={!isStringNumber(valueInputAmount)}
							isElementSelected={selectedAssetId !== ''}
							handleOnChange={handleOnChangeInputAmount}
							setValue={setValueInputAmount}
							setIsFocused={setIsFocusedInputAmount}
							fullWidth
						/>}
					</Grid>
					<Grid item xs={4}>
						{selectedAssetId !== undefined && <Button
							//dbg={true}
							isVisible={selectedAssetId !== ''}
							label={BUTTON_LABEL}
							handleOnClick={handleAddAssets}
							isDisabled={isAddAssetButtonDisabled}
							justifyContent='flex-end'
						/>}
					</Grid>
					<Grid item xs={12}>
						{assetsWithAmounts.length > 0 && <AssetsTable
							//dbg={true}
							isVisible={isVisibleAssetsTable}
							doLeaveRowSelected={doLeaveRowSelected}
							isAssetNotDefined={isAssetNotDefined}
							label={label}
							assets={assetsWithAmounts}
							balanceTextToNameMap={balanceTextToWithAmountNameMap}
							rowSelectedAssetId={rowSelectedAssetId}
							selectedElementId={selectedAssetId ? selectedAssetId : ''}
							mockTokenImages={MOCK_TOKEN_IMAGES}
							setIsFocused={setIsFocusedAssetsTable}
							handleSelectedAsset={handleSelectedAsset}
							setRowSelectedAssetId={setRowSelectedAssetId}
							removeAsset={setRemoveAssetId}
							onRowAssetClick={handleRowAssetClick}
							setDoLeaveRowSelected={setDoLeaveRowSelected}
						/>}
					</Grid>
				</Grid>
			</Box>
		</ThemeProvider>
	)
}

export default ExchangeActions