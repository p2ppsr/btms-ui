import React, { useState, useRef } from 'react'
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
import BTMS from '../../utils/BTMS'

const Mint = ({ history }) => {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState([])
  const [checked, setChecked] = useState(false)
  const [photoURL, setPhotoURL] = useState(null)
  const fileInputRef = useRef()

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

  const mint = async () => {
    try {
      if (name.trim() === '') {
        toast.error('Enter a name for the token!')
      } else if (quantity.trim() === '' || isNaN(quantity)) {
        toast.error('Enter a quantity for the max number of tokens!')
      } else if (description.trim() === '') {
        toast.error('Enter a description for the token!')
      } else if (checked === true) {
        await BTMS.issue(Number(quantity), name)
        toast.success('Success!')
        history.push(`/tokens/`)
      }
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  return (
    <div>
      <Container sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr'
      }}
      >
        <Grid container>
          <Grid item className={classes.button}>
            <Button component={Link} to='/' color='secondary'>
              <ArrowBackIosNewIcon className={classes.back_icon} /> My Tokens
            </Button>
          </Grid>
        </Grid>
        <Grid
          container sx={{
            display: 'grid',
            gridColumn: '2'
          }}
        >
          <Grid container>
            <Grid item className={classes.title}>
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
                  <TextField
                    placeholder='Give your token an original name'
                    variant='standard' color='secondary' multiline fullWidth
                    helperText={'Required'}
                    onChange={(e) => setName(e.target.value)}
                  />
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
                    {photoURL
                      ? (
                        <Grid item className={classes.photo_preview}>
                          <img
                            src={photoURL}
                            className={classes.photo_preview_img}
                            alt='preview'
                          />
                        </Grid>
                      )
                      : (
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
                  <TextField
                    placeholder='Quantity' value={quantity}
                    variant='standard' color='secondary' fullWidth
                    helperText={'Required'}
                    onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ''))}
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
                  <TextField
                    placeholder='Give your token a fitting description'
                    multiline variant='standard' color='secondary' fullWidth
                    helperText={'Required'}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid item container direction='column' className={classes.form}>
                <Grid item>
                  <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                    Tags
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    placeholder='e.g. art, music, literature, etc'
                    multiline variant='standard' color='secondary' fullWidth
                    onChange={(e) => setTags(e.target.value)}
                  />
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
                    <Typography sx={{ wordBreak: 'break-word' }}>
                      Token Name: {name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ wordBreak: 'break-word' }}>
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
              <FormControlLabel
                color='secondary'
                required
                control={<Checkbox
                  color='secondary'
                  onChange={e => setChecked(c => !c)}
                />}
                label='I am aware and agree that the token creation will broadcast on the BSV blockchain when I approve this transaction, and it won’t be reversible.'
              />
            </Grid>
            <Grid item align='right' className={classes.button}>
              <Button variant='outlined' color='secondary' onClick={mint}>Create</Button>
            </Grid>
            <Grid item>
              <ToastContainer />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Mint
