import React from 'react'
import useStyles from './mint-style'
import { Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Mint = () => {
  const classes = useStyles()

  return (
    <div>
      <Container>
        <Link to='/'>Home</Link>
        <Typography variant='h1' className={classes.title}>mint</Typography>
      </Container>
    </div >
  )
}

export default Mint
