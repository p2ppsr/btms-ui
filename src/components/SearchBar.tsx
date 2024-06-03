import React, { useEffect, useState } from 'react'
import { TextField, IconButton, InputAdornment, LinearProgress, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import web3Theme from '../theme'
import { BORDER_RADIUS } from '../utils/constants'

interface SearchBarProps {
  dbg?: boolean
  isVisible?: boolean
  initialText?: string
  value: string
  isDisabled?: boolean
  showProgress: boolean
  handleOnChange: (text: string) => void
  handleClear: () => void
  setValue: React.Dispatch<React.SetStateAction<string>>
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchBar: React.FC<SearchBarProps> = ({
  dbg = false,
  isVisible = true,
  initialText = '',
  value,
  isDisabled,
  showProgress,
  handleOnChange,
  handleClear,
  setValue,
  setIsFocused,
}) => {
  const [isFocused, setIsFocusedState] = useState<boolean>(false)

  useEffect(() => {
    setIsFocusedState(isFocused)
  }, [isFocused])

  const handleOnClick = () => {
    if (value === initialText) {
      setValue('')
    }
    handleOnFocus()
  }

  const handleOnFocus = () => {
    setIsFocusedState(true)
    setIsFocused(true)
  }

  const handleOnBlur = () => {
    setIsFocusedState(false)
    setIsFocused(false)
  }

  const handleOnClickClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation() // Prevent the TextField onClick event from triggering
    setValue('')
    handleClear()
  }

  const theme = useTheme()

  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <TextField
          style={{
            visibility: isVisible ? 'visible' : 'hidden',
            display: isVisible ? 'block' : 'none',
          }}
          size='small'
          variant='outlined'
          fullWidth
          value={value}
          onClick={handleOnClick}
          InputProps={{
            style: { borderRadius: BORDER_RADIUS },
            startAdornment: (
              <InputAdornment position='start'>
                {!isFocused && value === '' && (
                  <IconButton size='small' disabled={!isFocused}>
                    <SearchIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                {value && (
                  <IconButton onClick={handleOnClickClose} size='small' disabled={!value}>
                    <CloseIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onChange={(e) => handleOnChange(e.target.value)}
        />
        {showProgress && <LinearProgress />}
      </Box>
    </ThemeProvider>
  )
}

export default SearchBar
