import React, { createContext, useState, ReactNode, useCallback } from 'react';
// import { toast } from 'react-toastify';

interface Users {
    _id: string;
    member_id: string; // Assuming this is the user ID
    first_name: string;
    middle_name: string | null; // Can be null
    last_name: string;
    date_of_birth: string | null; // Can be null
    user_name: string | null; // Can be null
    email: string;
    phone_number: string | null; // Can be null
    password: string; // Consider removing this if not needed for display
    is_disabled: boolean;
    role: string;
    gender: string | null; // Can be null
    address_line_1: string | null; // Can be null
    address_line_2: string | null; // Can be null
    city: string | null; // Can be null
    state: string | null; // Can be null
    country: string | null; // Can be null
    ZIP: string | null; // Can be null
    contact_label: string | null; // Can be null
    phone_extension: number; // Assuming this is a number
    is_registered: boolean;
    is_subscribe: boolean;
    is_verified: boolean;
    last_login_date: string | null; // Can be null
    created_by: string | null; // Can be null
    otp: string | null; // Can be null
    expiresAt: string | null; // Can be null
    created_date: string; // Assuming this is a date string
    createdAt: string; // Assuming this is a date string
    updatedAt: string; // Assuming this is a date string
    __v: number; // Version key
    id: string; // Assuming this is the same as _id
}

interface UsersContextType {
    users: Users[];
    fetchMember: () => Promise<Users[]>;
    fetchSuperAdmin: () => Promise<Users[]>;
    fetchUsers: () => Promise<Users[]>; // Keep this as returning Users[]
    addUser: (userData: { first_name: string; last_name: string; password: string; email: string; }) => Promise<void>;
    addMember: (memberData: { first_name: string; last_name: string; password: string; email: string; }) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<Users[]>([]);

    const fetchUsers = useCallback(async (): Promise<Users[]> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}user-managment/admin/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('@jwt')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch User list');
            }

            const data = await response.json();
            setUsers(data.dog); // Update the state with the fetched user list
            return data.dog; // Return the user list
        } catch (error) {
            console.error('Error fetching users:', error);
            return []; // Return an empty array in case of error
        }
    }, []);

    const fetchMember = useCallback(async (): Promise<Users[]> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}user-managment/member/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('@jwt')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch User list');
            }

            const data = await response.json();
            setUsers(data.dog); // Update the state with the fetched user list
            return data.dog; // Return the user list
        } catch (error) {
            console.error('Error fetching users:', error);
            return []; // Return an empty array in case of error
        }
    }, []);

    const addUser = async (userData: { first_name: string; last_name: string; password: string; email: string; }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}auth/add-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('@jwt')}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            const data = await response.json();
            // Optionally, you can fetch the updated user list after adding a new user
            await fetchUsers();
            // toast.success(data.message);
            return data; // Return the response data if needed
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const addMember = async (userData: any): Promise<void> => {
        try {
            let apiUrl = `${process.env.REACT_APP_API_URL}auth/registration/member`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData), // Send the user data as the request body
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const fetchSuperAdmin = useCallback(async (): Promise<Users[]> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}user-managment/owner/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('@jwt')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch User list');
            }

            const data = await response.json();
            setUsers(data.dog); // Update the state with the fetched user list
            return data.dog; // Return the user list
        } catch (error) {
            console.error('Error fetching users:', error);
            return []; // Return an empty array in case of error
        }
    }, []);

    return (
        <UsersContext.Provider value={{ users, fetchUsers, addUser, addMember, fetchMember, fetchSuperAdmin }}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = (): UsersContextType => {
    const context = React.useContext(UsersContext);
    if (context === undefined) {
        throw new Error('useUsers must be used within a UsersProvider');
    }
    return context;
};