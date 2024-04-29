import { Dispatch, SetStateAction } from 'react';
import { Asset } from '../../../btms-core/out/src';
export declare const copyAssetArray: (originalArray: Asset[]) => Asset[];
export declare const copyAsset: (asset: Asset) => Asset;
export declare const getAsset: (assets: Asset[], assetId: string) => Asset;
export declare const getAssetListIndexFromAsset: (assets: Asset[], selectedAsset: Asset) => number;
export declare const getAssetListIndexFromAssetId: (assets: Asset[], assetId: string) => number;
export declare const updateNewAssetNumberProp: (assets: Asset[], assetId: string, value: number, prop: string) => Asset;
export declare const updateExistingAssetNumberProp: (assets: Asset[], assetId: string, value: number, prop: string) => Asset[];
export declare const updateAssetWithRemainderBalance: (dbg: boolean, assets: Asset[], assetId: string, balance: number, setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>) => void;
export declare const updateAssetWithAmountBalance: (dbg: boolean, assets: Asset[], assetsWithAmounts: Asset[], assetId: string, balance: number, setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>) => void;
export declare const updateAssetWithOriginalBalance: (assets: Asset[], assetId: string, balance: number, setAssetsWithAmounts: React.Dispatch<React.SetStateAction<Asset[]>>) => void;
export declare const updateStringRecord: (assetId: string, record: string, setRecords: React.Dispatch<React.SetStateAction<{
    [key: string]: string;
}>>) => string;
export declare const updateNumberRecord: (assetId: string, record: number, setRecords: React.Dispatch<React.SetStateAction<{
    [assetId: string]: number;
}>>) => number;
export declare const updateAssetProp: (selectedAsset: Asset, prop: string, value: string | number, setAssetsWithAmounts: Dispatch<SetStateAction<Asset[]>>, assetsWithAmounts: Asset[], assetIndex: number) => void;
export declare const removeAsset: (assets: Asset[], assetId: string) => Asset[];
export declare const removeAssetWithAmount: (assets: Asset[], assetId: string, setAssetsWithAmounts: Dispatch<SetStateAction<Asset[]>>) => void;
export declare const checkAssetBalancesList: (num: number, availableAsset: Asset, offerList: Asset[], remainderList: Asset[]) => void;
export declare const isStringNumber: (str: string) => boolean;
//# sourceMappingURL=general.d.ts.map