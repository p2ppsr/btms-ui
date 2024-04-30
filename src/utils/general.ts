import { Dispatch, SetStateAction } from 'react';
import { Asset } from 'btms-core'
import { error } from 'console';

// Utility function to copy an array of Asset objects
export const copyAssetArray = (originalArray: Asset[]): Asset[] => {
  // Create a new array to hold the copied Asset objects
  const copiedArray: Asset[] = [];

  // Iterate over each Asset in the original array
  originalArray.forEach((asset) => {
    // Create a deep copy of the Asset object
    const copiedAsset: Asset = {
      ...asset, // Copy all properties of the original Asset
    };

    // Push the copied Asset object into the new array
    copiedArray.push(copiedAsset);
  });

  // Return the new array containing copied Asset objects
  return copiedArray;
};

export const copyAsset = (asset: Asset): Asset => {
  // Create a deep copy of the Asset object
  const copiedAsset: Asset = {
    ...asset, // Copy all properties of the original Asset
  };
  return copiedAsset;
};

export const getAsset = (assets: Asset[], assetId: string): Asset => {
  try {
    const index: number = assets.findIndex(asset => asset.assetId === assetId)
    return assets[index] || undefined
  } catch {
    console.error('Problem finding asset with assetId:', assetId)
    throw error('Problem finding asset with assetId:', assetId)
  }
}

export const getAssetListIndexFromAsset = (assets: Asset[], selectedAsset: Asset): number => {
  return assets.findIndex(asset => asset.assetId === selectedAsset.assetId);
}

export const getAssetListIndexFromAssetId = (assets: Asset[], assetId: string): number => {
  return assets.findIndex(asset => asset.assetId === assetId);
}

export const updateNewAssetNumberProp = (assets: Asset[], assetId: string, value: number, prop: string) => {
  try {
    const selectedAsset = getAsset(assets, assetId)
    const newAsset: Asset = {
      ...selectedAsset,
      [prop]: value,
    };
    return newAsset || undefined
  } catch (e) {
    console.error(`asset with ${assetId} not found in assets`)
    throw error(`asset with ${assetId} not found in assets`)
  }
}

export const updateExistingAssetNumberProp = (assets: Asset[], assetId: string, value: number, prop: string) => {
  try {
    const updatedAssets: Asset[] = assets.map(asset =>
      asset.assetId === assetId ? { ...asset, [prop]: value } : asset
    );
    return updatedAssets
  } catch (e) {
    console.error(`asset with ${assetId} not found in assets`)
    throw error(`asset with ${assetId} not found in assets`)
  }
}

export const updateAssetWithRemainderBalance = (
  dbg: boolean,
  assets: Asset[],
  assetId: string,
  balance: number,
  setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>
) => {
  // Create a new asset with the updated balance or update existing asset in list
  dbg && console.log('updateAssetWithRemainderBalance():assetId=', assetId.substring(0, 10), 'balance=', balance, ',assets=', assets)
  if (getAssetListIndexFromAssetId(assets, assetId) === -1) {
    const updatedAssetsWithAmount = updateNewAssetNumberProp(assets, assetId, balance, 'balance')
    setAssetsWithAmounts([...assets, updatedAssetsWithAmount])
    dbg && console.log('updateAssetWithRemainderBalance():assets=', assets)
  } else {
    const updatedAssetsWithAmounts = updateExistingAssetNumberProp(assets, assetId, balance, 'balance')
    setAssetsWithAmounts(updatedAssetsWithAmounts);
    dbg && console.log('updateAssetWithRemainderBalance():assets=', assets)
  }
}

export const updateAssetWithAmountBalance = (
  dbg: boolean,
  assets: Asset[],
  assetsWithAmounts: Asset[],
  assetId: string,
  balance: number,
  setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>
) => {
  // Create a new asset with the updated balance or update existing asset in list
  dbg && console.log('updateAssetWithAmountBalance():assetId=', assetId.substring(0, 10), 'balance=', balance, ',assets=', assets, ',assetsWithAmounts=', assetsWithAmounts)
  if (getAssetListIndexFromAssetId(assetsWithAmounts, assetId) === -1) {
    const updatedAssetsWithAmount = updateNewAssetNumberProp(assets, assetId, balance, 'balance')
    setAssetsWithAmounts([...assetsWithAmounts, updatedAssetsWithAmount])
  } else {
    const updatedAssetsWithAmounts = updateExistingAssetNumberProp(assetsWithAmounts, assetId, balance, 'balance')
    setAssetsWithAmounts(updatedAssetsWithAmounts);
  }
  dbg && console.log('updateAssetWithAmountBalance():assets=', assets, ',assetsWithAmounts=', assetsWithAmounts)
}

export const updateAssetWithOriginalBalance = (
  assets: Asset[],
  assetId: string,
  balance: number,
  setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>
) => {
  // Create a new asset with the updated balance or update existing asset in list
  if (getAssetListIndexFromAssetId(assets, assetId) === -1) {
    const updatedAssets = updateNewAssetNumberProp(assets, assetId, balance, 'balance')
    setAssetsWithAmounts([...assets, updatedAssets])
  } else {
    const updatedAssets = updateExistingAssetNumberProp(assets, assetId, balance, 'balance')
    setAssetsWithAmounts(updatedAssets);
  }
}

export const updateStringRecord = (
  assetId: string,
  record: string,
  setRecords: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  setRecords((prevRecords) => ({
    ...prevRecords,
    [assetId]: record,
  }));
  return record;
};

export const updateNumberRecord = (
  assetId: string,
  record: number,
  setRecords: React.Dispatch<React.SetStateAction<{ [assetId: string]: number }>>
) => {
  setRecords((prevRecords) => ({
    ...prevRecords,
    [assetId]: record,
  }));
  return record;
};

export const updateAssetProp = (
  selectedAsset: Asset,
  prop: string,
  value: string | number,
  setAssetsWithAmounts: Dispatch<SetStateAction<Asset[]>>,
  assetsWithAmounts: Asset[],
  assetIndex: number
) => {
  console.log('updateAssetProp():assetIndex=', assetIndex)
  if (assetIndex !== -1) {
    // Update the balance (or specified property) of the existing asset
    const updatedAssets: Asset[] = assetsWithAmounts.map(asset =>
      asset.assetId === selectedAsset.assetId ? { ...asset, [prop]: value } : asset
    );
    setAssetsWithAmounts(updatedAssets);
  } else {
    // Create a new asset with the updated balance (or specified property)
    const newAsset: Asset = {
      ...selectedAsset,
      [prop]: value,
    };
    setAssetsWithAmounts([...assetsWithAmounts, newAsset]);
    //console.log('updateAssetProp():newAsset=', newAsset)
    // Add the new asset to the existing array of assets
  }
  console.log('updateAssetProp():assetsWithAmounts=', assetsWithAmounts)
}

// Remove an asset from the list based on asset ID
export const removeAsset = (assets: Asset[], assetId: string) => {
  // Use filter method to create a new array with assets excluding the one to remove
  try {
    const updatedAssets = assets.filter(asset => asset.assetId !== assetId);
    return updatedAssets;
  } catch (e) {
    console.error(`asset with ${assetId} not found in assets while removing`)
    throw error(`asset with ${assetId} not found in assets while removing`)
  }
};

export const removeAssetWithAmount = (
  assets: Asset[],
  assetId: string,
  setAssetsWithAmounts: Dispatch<SetStateAction<Asset[]>>
) => {
  console.log('remove assets before=', assets)
  const updatedAssets = removeAsset(assets, assetId)
  setAssetsWithAmounts(updatedAssets)
  console.log('remove assets after=', assets)
};

export const checkAssetBalancesList = (num: number, availableAsset: Asset, offerList: Asset[], remainderList: Asset[],) => {
  if (offerList.length === 0 || remainderList.length === 0) return
  try {
    const offerIndex: number = getAssetListIndexFromAsset(offerList, availableAsset)
    const reaminderIndex: number = getAssetListIndexFromAsset(remainderList, availableAsset)
    console.log(`List ${num} ${availableAsset.name}: offered:${offerList[offerIndex].balance} remainer: ${remainderList[reaminderIndex].balance} available=${availableAsset.balance}`)
    if (offerList[offerIndex].balance
      + remainderList[reaminderIndex].balance !== availableAsset.balance) {
      console.error(`List ${num} ${availableAsset.name}: offered:${offerList[offerIndex].balance} remainer: ${remainderList[reaminderIndex].balance} available=${availableAsset.balance}`)
    }
  } catch (e) {
    console.log('List=', num)
    console.log('name=', availableAsset.name)
    console.log('availableAsset=', availableAsset)
    console.log('offerList=', offerList)
    console.log('remainderList=', remainderList)
    console.log('offered=', offerList[availableAsset.assetId].balance)
    console.log('remainer=', remainderList[availableAsset.assetId].balance)
    console.log('available=', availableAsset.balance)
  }
}

export const isStringNumber = (str: string): boolean => {
  const num = parseInt(str, 10);
  return !isNaN(num);
}