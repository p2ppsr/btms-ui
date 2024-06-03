import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Typography, Grid, Box, ThemeProvider } from '@mui/material'
import { toast } from 'react-toastify'
import BTMS from '../utils/BTMS'
import Button from './Button'
import Inputs from './Inputs'
import web3Theme from '../theme'

const Mint: React.FC = () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')
  const [quantity, setQuantity] = useState('')
  const [description, setDescription] = useState('')
  const [isValidFields, setIsValidFields] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkIsValidatedFields = () => {
      const isValidFields =
        name !== ''
        && quantity !== ''
        && !isNaN(Number(quantity))
        && description !== ''
        && photo !== ''
      setIsValidFields(isValidFields)
    }
    checkIsValidatedFields()
},[name, photo, quantity, description])

  const handleOnChangePhoto = (text: string, isUnprintableChar: boolean) => {
    setPhoto(text)
  }
  const handleOnChangeName = (text: string, isUnprintableChar: boolean) => {
    setName(text)
  }

  const handleOnChangeDescription = (value: string, isUnprintableChar: boolean) => {
    setDescription(value)
  }

  const handleOnChangeQuantity = (value: string, isUnprintableChar: boolean) => {
    const $value = value.replace(/\D/g, '') // Remove non-numeric characters
    setQuantity($value)
  }

  const mint = async () => {
    try {
      //setLoading(true)
      if (!name.trim() || !quantity.trim() || isNaN(Number(quantity)) || !description.trim() || !photo) {
        toast.error('Please fill in all required fields.')
        return
      }
      
      await BTMS.issue(Number(quantity), name)
      //await BTMS.issue(Number(quantity), name, description, photoURL)
      toast.success(`You minted ${quantity} ${name}!`)
      history.push('/')
    } catch (error: any) {
      console.error('Error minting token:', error)
      toast.error(error.message || 'Something went wrong!')
    } finally {
      //setLoading(false)
    }
  }
    
  return (
    <ThemeProvider theme={web3Theme}>
      <Box sx={{ padding: '2em', backgroundColor: '#1c1c1c' }}>
        <Grid item xs={12} paddingTop='0.1em' paddingBottom='2em'>
          <img src='/BTMS-logo.png' alt='BTMS Logo' width={'100px'} />
        </Grid>
        <Container maxWidth='lg'>
          <Typography variant='h4' align='center' gutterBottom>
            Mint a Token
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={3} />
            <Grid item xs={6} sm={6}>
              <Inputs
                isDisabled={false}
                doMouseLeave={false}
                doMouseEnter={false}
                label='Token Name'
                fullWidth
                value={name}
                variant='outlined'
                margin='normal'
                required
                setValue={setName}
                handleOnChange={handleOnChangeName}
              />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={3} />
            <Grid item xs={6}>
              <Inputs
                isDisabled={false}
                value=''
                type='photo'
                handleOnChange={handleOnChangePhoto}
              />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={3} />
            <Grid item xs={6} sm={6}>
              <Inputs
                isDisabled={false}
                doMouseLeave={false}
                doMouseEnter={false}
                label='Number of Tokens'
                fullWidth
                value={quantity}
                variant='outlined'
                margin='normal'
                required
                setValue={setQuantity}
                handleOnChange={handleOnChangeQuantity}
              />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={3} />        
            <Grid item xs={6}>
              <Inputs
                isDisabled={false}
                doMouseLeave={false}
                doMouseEnter={false}
                label='Token Description'
                fullWidth
                multiline
                value={description}
                variant='outlined'
                margin='normal'
                required
                setValue={setDescription}
                handleOnChange={handleOnChangeDescription}
              />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={3} />        
            <Grid item xs={6}>
              <Button
                isDisabled={!isValidFields}
                label='Create Token'
                justifyContent='flex-start'
                handleOnClick={mint}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default Mint
