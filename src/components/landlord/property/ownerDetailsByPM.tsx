import React, { ChangeEvent } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import Icon from "../../icons/icon";

import { ownerDetailsbyPMType } from "@/src/types/property";
import { Required } from "../../ui/miscellenious";

/* ----------------------- PROPS ----------------------- */

type OwnerInformationProps = {
    ownerInfo: ownerDetailsbyPMType;
    setOwnerInfo: React.Dispatch<
        React.SetStateAction<ownerDetailsbyPMType>
    >;
};

/* ----------------------- COMPONENT ----------------------- */

const OwnerDetailsByPM: React.FC<OwnerInformationProps> = ({
    ownerInfo,
    setOwnerInfo,
}) => {
    /* ----------------------- HANDLERS ----------------------- */

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOwnerInfo((prev) => ({ ...prev, [name]: value }));
    };
    /* ----------------------- UI ----------------------- */

    return (
        <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
            <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-3">
                    <Label>
                        Owner first name
                    </Label>
                    <Input
                        name="first_name"
                        value={ownerInfo.first_name}
                        onChange={handleChange}
                        placeholder="Enter the owner first name"
                    />

                </div>

                <div className="flex flex-col gap-3">
                    <Label>
                        Owner middle name
                    </Label>
                    <Input
                        name="middle_name"
                        value={ownerInfo.middle_name}
                        onChange={handleChange}

                        placeholder="Enter the owner middle name"
                    />

                </div>

                <div className="flex flex-col gap-3">
                    <Label>
                        Owner last_name
                    </Label>
                    <Input
                        name="last_name"
                        value={ownerInfo.last_name}
                        onChange={handleChange}

                        placeholder="Enter the owner lst name"
                    />

                </div>

                <div className="flex flex-col gap-3">
                    <Label>
                        Owner phone
                    </Label>
                    <Input
                        name="phone_number"
                        value={ownerInfo.phone_number}
                        onChange={handleChange}

                        placeholder="Enter the owner lst name"
                    />

                </div>

                <div className="flex flex-col gap-3">
                    <Label>
                        Owner email
                    </Label>
                    <Input
                        name="email"
                        value={ownerInfo.email}
                        onChange={handleChange}

                        placeholder="Enter the owner lst name"
                    />

                </div>

                <div className="flex flex-col gap-3">
                    <Label>
                        Owner full address
                    </Label>
                    <Input
                        name="full_address"
                        value={ownerInfo.full_address}
                        onChange={handleChange}

                        placeholder="Enter the owner lst name"
                    />

                </div>


            </div>
        </div>
    );
}

export default OwnerDetailsByPM