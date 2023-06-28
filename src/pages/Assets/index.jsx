import React from 'react'
import useStyles from './assets-style'
import { Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Assets = () => {
  const classes = useStyles()

  return (
    <div>
      <Container>
        <Link to='/'>Home</Link>
        <Typography variant='h1' className={classes.title}>assets</Typography>
      </Container>

    </div >
  )
}

export default Assets