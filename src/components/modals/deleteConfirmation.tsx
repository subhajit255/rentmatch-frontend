import React from "react";
import { useModal } from "../../context/modalProvider";
import { Button } from "../ui/button";

const DeleteConfirmation = ({parameters} : {parameters : {header : string, description: string, fn: () => void, actionBtn?: string, outlineBtn?:boolean}}) => {
    const { closeModal } = useModal();

    return <div className="flex flex-col gap-9 max-w-[500px] mx-auto py-3">
        <div>
            <h3 className="text-2xl text-center font-bold text-muted">{parameters?.header}</h3>
            <p className="text-center text-lg font-medium mt-1">{parameters?.description}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
            <Button variant={parameters?.outlineBtn ? "outline" : "destructive"} onClick={() => {parameters?.fn(); closeModal();}}>{`${parameters?.actionBtn ?? "Delete"}`}</Button>
            <Button variant="secondary" onClick={closeModal}>{`Cancel`}</Button>
        </div>
    </div>
}

export default DeleteConfirmation;