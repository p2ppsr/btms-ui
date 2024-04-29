import React from 'react';
import { BTMS, Asset } from '../../../btms-core/out/src';
interface AssetsTableProps {
    dbg?: boolean;
    isVisible: boolean;
    isOffer: boolean;
    isAccept: boolean;
    btms: BTMS;
    assets: Asset[] | null;
    balanceTextToNameMap: Object;
    setAssetTableFocused: React.Dispatch<React.SetStateAction<boolean>>;
    handleSelectedAsset: (assetId: string, isOffer: boolean, isAccept: boolean) => void;
    setSelectedAssetId: React.Dispatch<React.SetStateAction<string>>;
    removeAssetWithAmount: (assetId: string) => void;
    handleAssetTableFocused: (focused: boolean, isOffer: boolean, isAccept: boolean) => void;
}
declare const AssetsTable: React.FC<AssetsTableProps>;
export default AssetsTable;
//# sourceMappingURL=AssetsTable.d.ts.map