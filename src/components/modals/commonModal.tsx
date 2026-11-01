import React from "react";
import { useModal } from "../../context/modalProvider";
import { Dialog, DialogContent } from "../ui/dialog"
import DeleteConfirmation from "./deleteConfirmation";
import RejectVisitModals from "./rejectVisitModal";
import ChatFormModal from "./chatFormModal";


const CommonDialog = () => {
    const {modalType, closeModal, parameter} = useModal();
    const isOpen = modalType !== null;

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && closeModal()}>
            <DialogContent  className={'z-[999] backdrop-blur-[2px] max-h-[calc(100vh-10px)] overflow-y-auto bg-input ' + (modalType === 'yinLoader' ? '[&>button]:hidden' : '')}>
                {modalType === 'remove' && <DeleteConfirmation parameters={parameter} /> }
                {modalType === 'rejectVisit' && <RejectVisitModals parameters={parameter} closeModal={closeModal} /> }
                {modalType === 'chat1stTime' && <ChatFormModal parameters={parameter} closeModal={closeModal} /> }
            </DialogContent>
        </Dialog>
    )
}

export default CommonDialog;