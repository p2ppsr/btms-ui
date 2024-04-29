import React from 'react';
interface InputAmountProps {
    dbg?: boolean;
    isOffer: boolean;
    isAccept: boolean;
    balance: number;
    isNew: boolean;
    disable: boolean;
    assetSelected: boolean;
    resetField: boolean;
    setAddAssetDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    unsetResetInputAmount: () => void;
    handleAddAssets: (amount: number) => void;
    handleInputAmountFocused: (focused: boolean, isOffer: boolean, isAccept: boolean) => void;
}
declare const InputAmount: React.FC<InputAmountProps>;
export default InputAmount;
//# sourceMappingURL=InputAmount.d.ts.map