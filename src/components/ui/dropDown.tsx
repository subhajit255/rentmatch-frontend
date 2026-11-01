import React from "react";
import Icon  from "../icons/icon";
import type { SyntheticEvent } from "react";
import { dropDownItemType } from "../../types/table";

const DropDown = ( {className, list, handleAction} : {
    className ?: string,
    list : dropDownItemType[],
    handleAction : (e : SyntheticEvent, name : string) => void
}) => {

    return (
        <div className={`${className} rounded-[10px] border border-black/10 px-2 py-1 bg-white shadow-md`}>
            <ul>
                {
                    list?.map((item : dropDownItemType) => (
                        <li onClick={(e) => handleAction(e, item?.name)} key={item?.name} className="font-medium px-2 py-3 border-b border-black/10 last:border-none flex gap-2 items-center justify-start hover:bg-black/5 rounded-sm cursor-pointer">
                            <Icon name={item?.icon} className={`w-4 h-4 `}  />
                            <span className={item?.class ? item?.class : ""}>
                                {item?.name}
                            </span>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default DropDown;