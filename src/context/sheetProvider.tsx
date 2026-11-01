import React, { createContext, useContext, useState } from 'react';

export const SheetContext = createContext({
    sheetType : null as string | null,
    openSheet : (type: string) => {},
    closeSheet : () => {},
    parameter : {} as any,
    setParameters : (props: any) => {}
});

export const useSheet = () => useContext(SheetContext);

export const SheetProvider = ({ children } : any) => {
    const [sheetType, setSheetType] = useState<string | null>(null);
    const [parameter, setParameter] = useState<any>({});

    const openSheet = (type : string) => setSheetType(type);
    const closeSheet = () => setSheetType(null);
    const setParameters = (props : any) => setParameter(props)

    return (
        <SheetContext.Provider value={{ sheetType, openSheet, closeSheet, parameter, setParameters }}>
            {children}
        </SheetContext.Provider>
    );
};