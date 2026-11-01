import React, { useEffect } from 'react';
import { getRoleBySlug, updatRolePermission } from '../../../actions/common';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler, UseFormRegister } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from '../../../custom-hooks/use-toast';

// --- Interfaces ---

const defaultValues = {
  role: "ADMIN",
  role_description: "Full access administrator role",
  access: [
    {
      id: 1,
      title: "Dashboard",
      icon: "Dashboard",
      to: "/dashboard",
      children: null,
      permission: { add: false, edit: false, view: false, delete: false },
    },
    {
      id: 2,
      title: "User Management",
      icon: "UserManagement",
      to: "/admin",
      permission: { add: true, edit: true, view: true, delete: true },
      children: [
        { id: 20, title: "Admin", icon: "ArrowRight", to: "/admin", children: null, permission: { add: false, edit: false, view: false, delete: false } },
        { id: 21, title: "member", icon: "ArrowRight", to: "/member", children: null, permission: { add: false, edit: false, view: false, delete: false } }
      ],
    },
    // {
    //   title: 'Approval Requests',
    //   icon: 'Approvals',
    //   to: '/approval-requests',
    //   children: null,
    //   permission: { add: false, edit: false, view: false, delete: false },
    //   id: 3,
    // },
    // {
    //   title: 'Reports',
    //   icon: 'Reports',
    //   to: '/reports',
    //   children: null,
    //   permission: { add: false, edit: false, view: false, delete: false },
    //   id: 4,
    // },
    {
      title: 'CMS',
      icon: 'CMS',
      to: '/cms',
      children: [
        {
          title: 'Property Types',
          icon: 'ArrowRight',
          to: '/property-type',
          children: null,
          permission: { add: false, edit: false, view: false, delete: false },
          id: 25,
        },
        {
          title: 'FAQ',
          icon: 'FAQ',
          to: '/faq-management',
          children: null,
          permission: { add: false, edit: false, view: false, delete: false },
          id: 26,
        },
        {
          title: 'Terms & Conditions',
          icon: 'Terms',
          to: '/terms-and-conditions',
          children: null,
          permission: { add: false, edit: false, view: false, delete: false },
          id: 27,
        },
        {
          title: 'Privacy Policy',
          icon: 'Privacy',
          to: '/privacy-policy',
          children: null,
          permission: { add: false, edit: false, view: false, delete: false },
          id: 28,
        },
      ],
      permission: { add: true, edit: true, view: true, delete: true },
      id: 5,
    },
    // {
    //   title: 'Settings',
    //   icon: 'Settings',
    //   to: '/settings',
    //   children: null,
    //   permission: { add: false, edit: false, view: false, delete: false },
    //   id: 6,
    // },
    // {
    //   title: 'Role Permission',
    //   icon: 'UserRoundCog',
    //   to: '/role-permission',
    //   children: null,
    //   permission: { add: false, edit: false, view: false, delete: false },
    //   id: 7,
    // },
    {
      title: 'Help Center',
      icon: 'HelpCenetr',
      to: '/feedback-and-support',
      children: null,
      permission: { add: false, edit: false, view: false, delete: false },
      id: 8,
    },

    {
      title: 'Connect us',
      icon: 'MessageResponse',
      to: '/connect-us-admin',
      children: null,
      permission: { add: false, edit: false, view: false, delete: false },
      id: 10
    },
    {
      title: 'Subscription Management',
      icon: 'SubscriptIcon',
      to: '/find-tanent',
      children: [
        {
          title: 'Data & Analytics',
          icon: 'ArrowRight',
          to: '/data-and-analytics',
          children: null,
          permission: { add: false, edit: false, view: false, delete: false },
          id: 22,
        },
        {
          title: 'Plan',
          icon: 'ArrowRight',
          to: '/subscription/plans',
          children: null,
          permission: { add: false, edit: false, view: false, delete: false },
          id: 23,
        },
        {
          title: 'All Subscriptions',
          icon: 'ArrowRight',
          to: '/all-subscriptions',
          children: null,
          permission: { add: false, edit: false, view: false, delete: false },
          id: 24,
        },
      ],
      permission: { add: true, edit: true, view: true, delete: true },
      id: 9,
    }
  ]
}
interface Permissions {
  add: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
}

interface AccessItem {
  id: number;
  title: string;
  icon: string;
  to: string;
  permission: Permissions;
  children: AccessItem[] | null;
}

interface RoleFormValues {
  user_id?: string
  role: string;
  role_description: string;
  access: AccessItem[];
}

const RoleForm: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  console.log(state, "<----state ??")
  useEffect(() => {
    if (state === null) {
      navigate('/admin/admin')
    } else if (state?.role !== 'ADMIN') {
      toast({
        title: `you can not update the role of ${state.role}`,
        description: ``,
        variant: "error",
      });
    }
  }, [state])
  // const { rolePermission , _id } = state


  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm<RoleFormValues>({
    defaultValues: defaultValues
  });

  // Watch access to determine if children exist during render
  const accessData = watch("access");

  useEffect(() => {
    if (state?.rolePermission) {
      const apiAccess = state.rolePermission.access;

      // Map your static defaultValues and fill them with API permission values
      const mergedAccess = defaultValues.access.map((templateItem) => {
        // Find the matching item from the API by title or 'to' path
        const apiItem = apiAccess.find((a: any) => a.to === templateItem.to);

        return {
          ...templateItem,
          // Use API permission if found, otherwise keep default
          permission: apiItem?.permission || templateItem.permission,
          // Handle nested children
          children: templateItem.children?.map((templateChild: any) => {
            // Look for this specific child in the API's children array
            const apiChild = apiItem?.children?.find((c: any) => c.to === templateChild.to);
            return {
              ...templateChild,
              permission: apiChild?.permission || templateChild.permission,
            };
          }) || null,
        };
      });

      reset({
        role: state.rolePermission.role,
        role_description: state.rolePermission.role_description,
        access: mergedAccess,
      });
    }
  }, [state, reset]);


  const onSubmit: SubmitHandler<RoleFormValues> = async (data) => {
    console.log("Final output", data)
    data.user_id = state._id
    try {
      const response = await updatRolePermission(data);
      queryClient.invalidateQueries({ queryKey: ["user_management"] });
      console.log("Success:", response);
      response.success ? navigate('/admin/admin') : toast({
        title: `Faild to update the role`,
        description: `Please try again letter`,
        variant: "error",
      });
      // Add success feedback (e.g., toast or redirect)
    } catch (error) {
      console.error("Failed to update permissions:", error);
      toast({
        title: `Faild to update the role`,
        description: (error as any)?.response?.data?.message || `Please try again letter`,
        variant: "error",
      });
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <div className="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center justify-center w-10 h-10 transition-colors bg-gray-50 hover:bg-gray-100 active:scale-95 text-gray-600 rounded-xl"
          aria-label="Go back"
        >
          <svg
            xmlns="http://w3.org"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        {/* Header Title */}
        <h1 className="text-lg font-bold tracking-tight text-gray-900 truncate">
          Edit Permissions for {state?.first_name || 'Loading...'}
        </h1>
      </div>

      <div className="space-y-4">
        <input {...register("role")} readOnly placeholder="Role Name" className="border p-2 w-full font-bold text-lg" />
        <textarea {...register("role_description")} placeholder="Description" className="border p-2 w-full text-sm" />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-700 border-b pb-2">Module Permissions</h3>

        {accessData?.map((item, idx) => {
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.id} className="border rounded-md overflow-hidden">
              {/* Parent Row */}
              <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
                <span className="font-semibold text-gray-800">{item.title}</span>

                {/* Only show checkboxes if NO children exist */}
                {!hasChildren && (
                  <PermissionGroup name={`access.${idx}.permission`} register={register} />
                )}
              </div>

              {/* children Rows */}
              {hasChildren && (
                <div className="bg-white divide-y">
                  {item.children?.map((child, childIdx) => (
                    <div key={child.id} className="flex justify-between items-center p-3 pl-10">
                      <span className="text-sm text-gray-600">{child.title}</span>
                      <PermissionGroup
                        name={`access.${idx}.children.${childIdx}.permission`}
                        register={register}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-2 rounded font-medium disabled:opacity-60 disabled:cursor-not-allowed">
        {isSubmitting ? "Saving..." : "Save Role Configuration"}
      </button>
    </form>
  );
};

// --- Sub-Component for Checkboxes ---
const PermissionGroup = ({ name, register }: { name: string, register: UseFormRegister<RoleFormValues> }) => (
  <div className="flex gap-6">
    {(['view', 'add', 'edit', 'delete'] as const).map((type) => (
      <label key={type} className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          {...register(`${name}.${type}` as any)}
          className="w-4 h-4 rounded border-gray-300 text-indigo-600"
        />
        <span className="text-xs uppercase font-semibold text-gray-500">{type}</span>
      </label>
    ))}
  </div>
);

export default RoleForm;
