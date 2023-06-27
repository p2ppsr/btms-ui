import React from 'react'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  page_wrap: {
    ...theme.templates.page_wrap,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '8em',
    marginTop: '6em',
    placeItems: 'center',
    [theme.breakpoints.down('lg')]: {
      gridGap: '3em'
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
      marginTop: '1em'
    }
  },
  inline_icon: {
    width: '1.5em',
    height: '1.5em',
    borderRadius: '8px',
    display: 'none',
    marginRight: '0.25em',
    marginBottom: '-0.35em',
    [theme.breakpoints.down('md')]: {
      display: 'inline'
    }
  },
  app_icon: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    userSelect: 'none',
    width: '100%',
    borderRadius: '16px',
    transition: 'all 0.4s',
    boxShadow: '10px 11px 16px 0px rgba(0,0,0,0.5)',
    '&:hover': {
      opacity: '0.85',
      transform: 'scale(1.1)',
      boxShadow: '10px 11px 42px 0px rgba(0,0,0,0.5)'
    }
  },
  list_item: {
    margin: '0.38em 0px',
    fontSize: '1.1em'
  },
  right_div: {
    minHeight: '100%',
    minWidth: '100%'
  },
  loading: {
    width: '20% !important',
    height: '20% !important',
    marginTop: '1em'
  },
  choice_grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridGap: '1em'
  },
  royalties: {
    marginBottom: '1.5em'
  },
  card_actions: {
    flexDirection: 'row-reverse'
  }
}), { name: 'Welcome' })

const Welcome = () => {
  const classes = useStyles()

  return (
    <div className={classes.page_wrap}>
      <img src='/BTMS-Icon.svg' alt='' className={classes.app_icon} />
      <div className={classes.right_div}>
        <Typography variant='h1'>
          <img className={classes.inline_icon} src='/BTMS-Icon.svg' alt='' />
          BTMS MVP
        </Typography>
        <br></br>
        <Typography>
          The loyalty program that you control
        </Typography>
        <br></br>
        <Typography>
          Mint loyalty points and various other types of tokens on the Bitcoin SV blockchain
        </Typography>
        <br></br>
        <Typography>
          Transfer tokens to users, which they then present or redeem.
        </Typography>
      </div>
    </div>
  )
}

export default Welcome
