import React from 'react';
import { Asset } from '../../../btms-core/out/src';
interface AssetBalanceProps {
    dbg?: boolean;
    assetId: string;
    newAmount: number;
    assetListUpdated: boolean;
    assets: Asset[];
    doAssetBalance: boolean;
    setAssetListUpdated: React.Dispatch<React.SetStateAction<boolean>>;
    setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
    unsetResetInputAmount: () => void;
    updateRemainder: (remainder: number) => void;
    setDoAssetBalance: React.Dispatch<React.SetStateAction<boolean>>;
    setAvailable: React.Dispatch<React.SetStateAction<{
        [assetId: string]: number;
    }>>;
    setRemainder: React.Dispatch<React.SetStateAction<{
        [assetId: string]: number;
    }>>;
}
declare const AssetBalance: React.FC<AssetBalanceProps>;
export default AssetBalance;
//# sourceMappingURL=AssetBalance.d.ts.map