// Read on every call (not at module load) so a login/logout in the same session is picked up
const readStoredPermission = (): any[] => {
    try {
        const raw = localStorage.getItem("permission");
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export function useRolePermissionCheck() {
    const adminPermission = readStoredPermission(); // Usually from localStorage/context

    /**
     * @param {string} moduleTitle - The title of the module (e.g., "Admin", "Dashboard")
     * @param {string} action - "add" | "edit" | "view" | "delete"
     * @returns {boolean}
     */
    interface Permission {
        [key: string]: boolean;
    }

    interface Module {
        title: string;
        permission?: Permission;
        children?: Module[];
    }

    type ActionType = "add" | "edit" | "view" | "delete";

    const hasPermission = (moduleTitle: string, action: ActionType): boolean => {
        // Helper to find the module recursively
        const findModule = (modules: Module[]): Module | null => {
            for (const item of modules) {
                if (item.title.toLowerCase() === moduleTitle.toLowerCase()) {
                    return item;
                }
                if (item.children && item.children.length > 0) {
                    const found = findModule(item.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const targetModule = findModule(adminPermission);

        // Return the boolean value of the permission, default to false if not found
        return !!(targetModule?.permission?.[action]);
    };

    return { hasPermission };
}


// export function useRolePermissionCheck() {
//     // const adminPermission = JSON.parse(adminPermissionRaw || "[]");
//     const adminPermission = adminPermissionRaw;
//     return adminPermission;
// }