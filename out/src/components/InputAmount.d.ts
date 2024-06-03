import React from 'react';
interface InputsProps {
    dbg?: boolean;
    isOffer: boolean;
    isAccept: boolean;
    balance: number;
    isNew: boolean;
    disable: boolean;
    assetSelected: boolean;
    resetField: boolean;
    setAddAssetDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    unsetResetInputs: () => void;
    handleAddAssets: (amount: number) => void;
    handleInputsFocused: (focused: boolean, isOffer: boolean, isAccept: boolean) => void;
}
declare const Inputs: React.FC<InputsProps>;
export default Inputs;
//# sourceMappingURL=Inputs.d.ts.map