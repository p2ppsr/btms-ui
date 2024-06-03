import React, { useEffect, useState } from 'react'
import { TextField, Grid, IconButton, Paper, Box } from '@mui/material'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import web3Theme from '../theme'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { BORDER_RADIUS } from '../utils/constants'

interface InputsProps {
  dbg?: boolean
  isVisible?: boolean
  doMouseEnter?: boolean
  doMouseLeave?: boolean
  value: string
  label?: string
  isDisabled: boolean
  isElementSelected?: boolean
  selectedElementText?: string
  unselectedElementText?: string
  selectedElementTextMouseEnter?: string
  unselectedElementTextMouseEnter?: string
  selectedElementTextMouseLeave?: string
  unselectedElementTextMouseLeave?: string
  handleOnChange: (value: string, isUnprintableChar: boolean) => void
  setValue?: React.Dispatch<React.SetStateAction<string>>
  setIsFocused?: React.Dispatch<React.SetStateAction<boolean>>
  fullWidth?: boolean
  multiline?: boolean
  variant?: 'standard' | 'outlined' | 'filled'
  margin?: 'dense' | 'normal' | 'none'
  required?: boolean
  type?: string
  justifyContent?: 'flex-start' | 'flex-end' | 'center'
}

const Inputs: React.FC<InputsProps> = ({
  dbg = false,
  isVisible = true,
  doMouseEnter = true,
  doMouseLeave = true,
  value = '',
  label = '',
  isDisabled = true,
  isElementSelected = false,
  selectedElementText = '',
  unselectedElementText = '',
  selectedElementTextMouseEnter = '',
  unselectedElementTextMouseEnter = '',
  selectedElementTextMouseLeave = '',
  unselectedElementTextMouseLeave = '',
  handleOnChange,
  setValue=() => {},
  setIsFocused=() => {},
  fullWidth = false,
  multiline = false,
  variant = 'outlined',
  margin = 'normal',
  required = false,
  type='',
  justifyContent='flex-start'  
}) => {
  const [$value, $setValue] = useState<string>(value)
  const [$isDisabled, setIsDisabled] = useState<boolean>(isDisabled)
  const [isUnprintableChar, setIsUnprintableChar] = useState<boolean>(false)
  const [photoURL, setPhotoURL] = useState<string | null>(null)

  const theme = useTheme()

  const handleOnChangeInternal = (text: string) => {
    if (isUnprintableChar) {
      $setValue(text)
    }
    handleOnChange(text, isUnprintableChar)
    setIsUnprintableChar(false)
    setIsFocused(true)
  }

  const handleOnClick = () => {
    if (!$isDisabled) {

      // If not disabled, handle the logic to clear if it is not a number
      if (isNaN(Number(value))) {
        $setValue('')
      }
    } else {

      // If disabled, toggle the disabled state and focus
      setIsDisabled(false)
    }
    setIsFocused(true)
  }

  const handleMouseEnter = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (doMouseEnter && !$isDisabled) {
      const text = isElementSelected ? selectedElementTextMouseEnter : unselectedElementTextMouseEnter
      $setValue(text)
    }
  }

  const handleMouseLeave = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (doMouseLeave && !$isDisabled) {
      const text = isElementSelected ? selectedElementTextMouseLeave : unselectedElementTextMouseLeave
      $setValue(text)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.key === 'Backspace') {
      setIsUnprintableChar(true)
    }
    setIsFocused(true)
  }

  const handleFileChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setPhotoURL(reader.result as string)
      }
      reader.readAsDataURL(file)
      handleOnChange(file.name, false)
    }
  }

  useEffect(() => {
    setIsDisabled(isDisabled)
  }, [isDisabled])

  useEffect(() => {

    // Update internal state if external value changes
    $setValue(value)
  }, [value])

  useEffect(() => {

    // Update external setValue when internal state changes
    if (setValue) {
      setValue($value)
    }
  }, [$value, setValue])

  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <Grid
          container
          justifyContent={justifyContent}
          alignItems='center'
        >
          {type === 'text' || type === ''
          ? <>
            <TextField
              disabled={$isDisabled}
              size='small'
              fullWidth={fullWidth}
              multiline={multiline}
              variant={variant}
              margin={margin}
              value={value}
              label={label}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onChange={(e) => handleOnChangeInternal(e.target.value)}
              onClick={handleOnClick}
              onKeyDown={handleKeyDown}
              InputProps={{
                style: {
                  borderRadius: BORDER_RADIUS,
                  visibility: isVisible ? 'visible' : 'hidden',
                  display: isVisible ? 'block' : 'none',
                },
              }}
              required={required}
            />
            </>
          : type === 'photo' && <Paper elevation={3} style={{ padding: '10px', textAlign: 'center', marginTop: '10px' }}>
              {photoURL
              ?
                <>
                <img src={photoURL} alt='Preview' style={{ maxWidth: '100%', maxHeight: 200 }} />
                <IconButton
                  style={{ position: 'relative', top: '50%', left: '10%', transform: 'translate(-50%, -50%)' }}
                  onClick={() => setPhotoURL(null)}
                  aria-label='Remove Photo'
                >
                  <AddAPhotoIcon style={{ color: 'white', fontSize: 24 }} />
                </IconButton>
                </>
              : 
                <IconButton color='secondary' component='label' aria-label='Add Photo'>
                  <input
                    type='file'
                    accept='.png, .jpg, .jpeg, .svg, .webp'
                    onChange={handleFileChangePhoto}
                    style={{ display: 'none' }}
                  />
                  <AddAPhotoIcon style={{ color: 'white', fontSize: 24 }} />
                </IconButton>
              }
            </Paper>
          }
        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default Inputs
