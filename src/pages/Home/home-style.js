import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  title: {
    paddingTop: '5.5em'
  },
  sub_title: {
    paddingTop: '0.5em'
  },
  table_title: {
    paddingTop: '2.5em',
    paddingLeft: '2.5em'
  },
  no_tokens: {
    paddingTop: '1.5em',
    paddingBottom: '1.5em'
  },
  link: {
    textDecoration: 'none'
  },
  send_icon: {
    paddingLeft: '0.3em'
  },
  button: {
    marginBottom: '0.9em',
    marginRight: '0.9em'
  },
  identity_key: {
    marign: '0.9em'
  },
  form: {
    marginTop: '0.25em !important'
  },
  row_container: {
    display: 'grid !important',
    paddingTop: '0.25em !important',
    gridTemplateColumns: 'auto 1fr',
    gridColumnGap: '1.5em',
  },
}));

export default useStyles;