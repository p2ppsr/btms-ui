import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Tabs, Tab } from '@mui/material';
import { BTMS, Asset } from '../../btms-core/out/src';
import ExchangePage from './components/ExchangePageOrg';

let btms = new BTMS(
  'https://confederacy.babbage.systems',
  'https://peerserv.babbage.systems',
  'tokens-box',
  'tokens',
  'tokens',
  'tokens',
  1000
)
const App: React.FC = () => {
  // Initialize state with proper values
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Exchange
          </Typography>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Asset listing" />
            <Tab label="Marketplace" />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {tabIndex === 0 && (
            <ExchangePage btms={btms} />
          )}
          {tabIndex === 1 && (
            <Typography variant="body1">
              {selectedAsset ? `${selectedAsset.name}: ${selectedAsset.balance}` : 'Select an asset'}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
