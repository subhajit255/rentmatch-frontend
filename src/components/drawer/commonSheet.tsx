import React from "react";
import { Dialog, DialogContent } from "../ui/dialog"
import { useSheet } from "../../context/sheetProvider";
import { Sheet, SheetContent } from "../ui/sheet";
import PropertySheet from "../ChildComponent/Common/PropertySheet";
import PropertySchedulerForm from "./propertySchedulerForm";
import AdvanceSearchModal from "./advanceSearchModal";


const CommonDrawer = () => {
    const { sheetType, closeSheet, setParameters, parameter } = useSheet();
    const isOpen = sheetType !== null;

    return (
        <Sheet open={isOpen} onOpenChange={open => !open && closeSheet()}>
            <SheetContent className="w-[400px] sm:w-[540px] !max-w-full" >
                {sheetType === "propertyDetails" && (
                    <PropertySheet id={parameter.id}
                        // property={parameter.property}
                    />
                )}
                {sheetType === "propertySchedularForm" && (
                    <PropertySchedulerForm id={parameter.id} />
                )}

                
                {sheetType === "advanceSearch" && (
                    <AdvanceSearchModal parameters={parameter} setParameters={setParameters} closeSheet={closeSheet}  />
                )}
            </SheetContent>
            {/* <PropertySheet id={id}
                property={property}
            /> */}
        </Sheet>
    )
}

export default CommonDrawer;