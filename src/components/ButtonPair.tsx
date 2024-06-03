import React from 'react'
import { Button, ThemeProvider } from '@mui/material'
import { styled } from '@mui/system'
import web3Theme from '../theme'
import { BORDER_RADIUS } from '../utils/constants'

interface ButtonPairProps {
  isOneOn: boolean
  isTwoOn: boolean
  isVisible?: boolean
  labelOne: string
  labelTwo: string
  isDisabled: boolean
  justifyContent?: 'flex-start' | 'flex-end' | 'center'
  backgroundColor?: string
  backgroundColorOn?: string
  backgroundColorOff?: string
  handleOnClickOne: () => void
  handleOnClickTwo: () => void
  border?: string
  padding?: string
}

const ButtonPair: React.FC<ButtonPairProps> = ({
  isOneOn,
  isTwoOn,
  isVisible = true,
  isDisabled,
  labelOne,
  labelTwo,
  justifyContent = 'center',
  backgroundColor = 'grey',
  backgroundColorOn = 'white',
  backgroundColorOff = 'black',
  handleOnClickOne,
  handleOnClickTwo,
  border = 'none',
  padding = '10px',
}) => {

  return (
    <ThemeProvider theme={web3Theme}>
      <Panel border={border} backgroundColor={backgroundColor} padding={padding} justifyContent={justifyContent}>
        <ButtonWrapper>
          <StyledButton
            onClick={handleOnClickOne}
            disabled={isDisabled}
            backgroundColorOn={backgroundColorOn}
            backgroundColorOff={backgroundColorOff}
            isOn={isOneOn}
          >
            {labelOne}
          </StyledButton>
          <StyledButton
            onClick={handleOnClickTwo}
            disabled={isDisabled}
            backgroundColorOn={backgroundColorOn}
            backgroundColorOff={backgroundColorOff}
            isOn={isTwoOn}
          >
            {labelTwo}
          </StyledButton>
        </ButtonWrapper>
      </Panel>
    </ThemeProvider>
  )
}

interface PanelProps {
  border: string
  backgroundColor: string
  padding: string
  justifyContent: string
}

const Panel = styled('div')<PanelProps>(({ border, backgroundColor, padding, justifyContent }) => ({
  border,
  borderRadius: BORDER_RADIUS,
  backgroundColor,
  padding,
  display: 'flex',
  justifyContent,
  alignItems: 'center',
  width: '100%',
  boxSizing: 'border-box',
}))

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  gap: '0.4em', // Adjust this to control the space between buttons
})

interface StyledButtonProps {
  backgroundColorOn: string
  backgroundColorOff: string
  isOn: boolean
}

const StyledButton = styled(Button)<StyledButtonProps>(({ backgroundColorOn, backgroundColorOff, isOn }) => ({
  '& .MuiButton-label': {
    color: isOn ? backgroundColorOff : backgroundColorOn,
    opacity: 0.5,
  },
  borderRadius: BORDER_RADIUS,
  backgroundColor: isOn ? backgroundColorOn : backgroundColorOff,
  color: '#888',
  '&:hover': {
    color: isOn ? backgroundColorOff : backgroundColorOn,
    opacity: 1.0,
    backgroundColor: isOn ? backgroundColorOn : backgroundColorOff,
  },
  flex: 1,
}))

export default ButtonPair
