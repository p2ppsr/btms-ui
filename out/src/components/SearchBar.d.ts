import React from 'react';
interface SearchBarProps {
    dbg?: boolean;
    isOffer: boolean;
    isAccept: boolean;
    handleSearchBar: (text: string) => void;
    handleClearSearchBar: () => void;
    handleSearchBarFocused: (focused: boolean, isOffer: boolean, isAccept: boolean) => void;
}
declare const SearchBar: React.FC<SearchBarProps>;
export default SearchBar;
//# sourceMappingURL=SearchBar.d.ts.map