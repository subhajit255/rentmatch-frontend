import React, { createContext, useContext, useState } from 'react';

export const ModalContext = createContext({
    modalType : null as string | null,
    openModal : (type: string) => {},
    closeModal : () => {},
    parameter : {} as any,
    setParameters : (props: any) => {}
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children } : any) => {
    const [modalType, setModalType] = useState<string | null>(null);
    const [parameter, setParameter] = useState<any>({});

    const openModal = (type : string) => setModalType(type);
    const closeModal = () => setModalType(null);
    const setParameters = (props : any) => setParameter(props)

    return (
        <ModalContext.Provider value={{ modalType, openModal, closeModal, parameter, setParameters }}>
            {children}
        </ModalContext.Provider>
    );
};