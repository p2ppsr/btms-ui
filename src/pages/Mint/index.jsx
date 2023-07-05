import React, { useState, useRef, useEffect } from 'react'
import useStyles from './mint-style'
import {
  Container, Typography, Grid, Button, TextField,
  Checkbox, FormControlLabel, Paper, IconButton
} from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

let checked = false
let runValidation = false

const Mint = () => {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState()
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState([])
  const [photoURL, setPhotoURL] = useState(null)
  const [formComplete, setFormComplete] = useState(false)
  const fileInputRef = useRef()
  const [showError, setShowError] = useState({
    name: false, quantity: false, description: false
  })

  const handleChecked = (event) => {
    checked = event.target.checked
    runValidation = true
  }

  const handlePhotoClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = e => {
    if (e.target.files.length > 0) {
      const URLReader = new FileReader()
      URLReader.onload = () => {
        setPhotoURL(URLReader.result)
      }
      URLReader.readAsDataURL(e.target.files[0])
      const arrayReader = new FileReader()
      arrayReader.readAsArrayBuffer(e.target.files[0])
    }
  }

  useEffect(async () => {
    if (runValidation === true) {
      if (name.trim() === '') {
        console.log('check name')
        setShowError(prev => ({ ...prev, name: true }))
        console.log(showError.name)
      } else {
        setShowError(prev => ({ ...prev, name: false }))
      }
      if (!quantity) {
        setShowError(prev => ({ ...prev, quantity: true }))
      } else {
        setShowError(prev => ({ ...prev, quantity: false }))
      }
      if (description.trim() === '') {
        setShowError(prev => ({ ...prev, description: true }))
      } else {
        setShowError(prev => ({ ...prev, description: false }))
      }
      if (!showError.name && !showError.quantity && !showError.description && checked) {
        setFormComplete(true)
      } else {
        setFormComplete(false)
      }
    }
  }, [name, quantity, description])


  const mint = async () => {
    try {
      window.location.href = `/assets/`
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  return (
    <div>
      <Container sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr'
      }}>
        <Grid container>
          <Grid item className={classes.button}>
            <Button component={Link} to='/' color='secondary'>
              <ArrowBackIosNewIcon className={classes.back_icon} /> My Tokens
            </Button>
          </Grid>
        </Grid>
        <Grid container sx={{
          display: 'grid',
          gridColumn: '2'
        }}>
          <Grid container>
            <Grid item className={classes.title} >
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                Mint a Token
              </Typography>
            </Grid>
            <Grid item container direction='column' className={classes.sub_title}>
              <Grid item container direction='column' className={classes.form}>
                <Grid item>
                  <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                    Token Name
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField placeholder='Give your token an original name'
                    variant='standard' color='secondary' multiline fullWidth
                    error={showError.name} helperText={showError.name == true ? 'Enter a name for the token!' : 'Required'} required
                    onChange={(e) => setName(e.target.value)} />
                </Grid>
              </Grid>
              <Grid item container direction='column' className={classes.form}>
                <Grid item>
                  <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                    Image
                  </Typography>
                </Grid>
                <Grid item container>
                  <Paper elevation={8} className={classes.photo_container}>
                    {photoURL ? (
                      <Grid item className={classes.photo_preview}>
                        <img
                          src={photoURL}
                          className={classes.photo_preview_img}
                          alt='preview'
                        />
                      </Grid>
                    ) : (
                      <Grid item>
                        <IconButton
                          color='secondary'
                          onClick={handlePhotoClick}
                        >
                          <AddAPhotoIcon />
                          <input
                            type='file'
                            accept='.png, .svg, .jpeg, .jpg'
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </IconButton>
                      </Grid>
                    )}
                  </Paper>
                </Grid>
              </Grid>
              <Grid item container direction='column' className={classes.form}>
                <Grid item>
                  <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                    Number of Tokens
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='p'>
                    This will limit the total number of supply for your token. When it reaches this number, no more tokens will be minted from the contract.
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField placeholder='Quantity' value={quantity}
                    variant='standard' color='secondary' fullWidth required
                    error={showError.quantity} helperText={showError.quantity == true ? 'Enter a quantity for the max number of tokens!' : 'Required'}
                    onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
                  />
                </Grid>
              </Grid>
              <Grid item container direction='column' className={classes.form}>
                <Grid item>
                  <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                    Token Description
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField placeholder='Give your token a fitting description'
                    multiline variant='standard' color='secondary' fullWidth
                    error={showError.description} helperText={showError.description == true ? 'Enter a description for the token!' : 'Required'} required
                    onChange={(e) => setDescription(e.target.value)} />
                </Grid>
              </Grid>
              <Grid item container direction='column' className={classes.form}>
                <Grid item>
                  <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                    Tags
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField placeholder='e.g. art, music, literature, etc'
                    multiline variant='standard' color='secondary' fullWidth
                    onChange={(e) => setTags(e.target.value)} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction='column' className={classes.form}>
            <Grid item>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                Preview
              </Typography>
            </Grid>
            <Grid item>
              <Paper elevation={8}>
                <Grid container direction='column' sx={{ padding: '2.5em' }} rowGap='0.5em'>
                  <Grid item>
                    <Typography sx={{ wordBreak: "break-word" }}>
                      Token Name: {name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ wordBreak: "break-word" }}>
                      Token Description: {description}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      Max Supply: {quantity}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Grid container direction='column' className={classes.form}>
            <Grid item>
              <FormControlLabel color='secondary' required control={<Checkbox color='secondary' onChange={handleChecked} />} label='I am aware and agree that the token creation will broadcast on the BSV blockchain when I approve this transaction, and it won’t be reversible.' />
            </Grid>
            <Grid item align='right' className={classes.button}>
              <Button variant='outlined' color='secondary' disabled={!formComplete} onClick={mint}>Create</Button>
            </Grid>
            <Grid item>
              <ToastContainer />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div >
  )
}

export default Mint
