import React from 'react'
import { Box, Button as Btn, Grid, ThemeProvider, useTheme } from '@mui/material'
import { styled } from '@mui/system'
import web3Theme from '../theme'
import { BORDER_RADIUS } from '../utils/constants'

interface ButtonProps {
  dbg?: boolean
  isVisible?: boolean
  label: string
  isDisabled: boolean
  justifyContent?: 'flex-start' | 'flex-end' | 'center'
  backgroundColor?: string
  handleOnMouseEnter?: () => void
  handleOnMouseLeave?: () => void
  handleOnBlur?: () => void
  handleOnClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  dbg = false,
  isVisible = true,
  isDisabled,
  label = '',
  justifyContent = 'center',
  backgroundColor = 'white',
  handleOnMouseEnter,
  handleOnMouseLeave,
  handleOnBlur,
  handleOnClick
}) => {

  const $handleOnMouseEnter = () => {
    handleOnMouseEnter && handleOnMouseEnter()
  }

  const $handleOnMouseLeave = () => {
    handleOnMouseLeave && handleOnMouseLeave()
  }

  const $handleOnBlur = () => {
    handleOnBlur && handleOnBlur()
  }

  const $handleOnClick = () => {
    handleOnClick && handleOnClick()
  }

  const StyledButton = styled(Btn)(({ theme }) => ({
    '& .MuiButton-label': {
      color: '#888',
      opacity: 0.5,
    },
    borderRadius: BORDER_RADIUS,
    visibility: isVisible ? 'visible' : 'hidden',
    display: isVisible ? 'block' : 'none',
    backgroundColor: backgroundColor ? backgroundColor : '#fff',
    color: '#888',
    '&:hover': {
      color: '#000',
      opacity: 1.0,
      backgroundColor: '#fff',
    },
  }))

  const DisabledButton = styled(Btn)(({ theme }) => ({
    borderRadius: BORDER_RADIUS,
    visibility: isVisible ? 'visible' : 'hidden',
    display: isVisible ? 'block' : 'none',
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    '&:hover': {
      backgroundColor: theme.palette.action.disabledBackground,
    },
  }))

  return (
    <ThemeProvider theme={web3Theme}>
      <Box>
        <Grid
          container
          justifyContent={justifyContent}
          alignItems='center'
        >
          {isDisabled ? (
            <DisabledButton
              onMouseEnter={$handleOnMouseEnter}
              onMouseLeave={$handleOnMouseLeave}
              onBlur={$handleOnBlur}
              onClick={$handleOnClick}
              disabled
            >
              {label}
            </DisabledButton>
          ) : (
            <StyledButton
              onMouseEnter={$handleOnMouseEnter}
              onMouseLeave={$handleOnMouseLeave}
              onBlur={$handleOnBlur}
              onClick={$handleOnClick}
            >
              {label}
            </StyledButton>
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default Button
