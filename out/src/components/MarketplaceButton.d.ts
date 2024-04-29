import React from 'react';
interface MarketplaceButtonProps {
    dbg?: boolean;
    isOffer: boolean;
    isAccept: boolean;
    text: string;
    handleOnMouseEnterConfirmed?: () => void;
    handleOnMouseLeaveConfirmed?: () => void;
    handleOnBlurConfirmed?: () => void;
    handleOnClickConfirmed?: () => void;
    disable: boolean;
}
declare const MarketplaceButton: React.FC<MarketplaceButtonProps>;
export default MarketplaceButton;
//# sourceMappingURL=MarketplaceButton.d.ts.map