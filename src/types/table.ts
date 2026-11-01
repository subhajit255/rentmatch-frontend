import { IconName } from "../components/icons/icon";

export type actionType = 'View' | 'Edit' | 'Active' | 'Disable' | 'Remove' | 'Edit Permission';

export type dropDownItemType = {
    name : actionType,
    icon : IconName,
    class ?: string
}