import React, { createContext, useState, ReactNode } from 'react';

interface User {
    username(username: any): unknown;
    id: string;
    email: string;
    role: string;
}

interface Dog {
    _id: string;
    dog_id: string;
    dog_name: string;
    date_of_birth: string;
    gender: string;
    color: string;
    breed_s: string;
    breed_d: string;
    owner_id: string;
    trainer_id: string;
    status: string;
}

interface Profile {
    first_name: string;
    middle_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    date_of_birth: string | null;
    user_name: string;
    gender: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    ZIP: string;
    contact_label: string;
    phone_extension: string;
    profilePicture: string | null; // Keep as string | null
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (role: string, userId: string, password: string) => Promise<User>;
    logout: () => void;
    verifyEmail: (email: string, role: string) => Promise<any>; // New method for email verification
    verifyForgetEmail: (email: string) => Promise<any>;
    verifyOtp: (email: string, otp: string, role: string) => Promise<void>; // New method for OTP verification
    registerUser: (userData: any) => Promise<void>; // New method for user registration
    resetPassword: (email: string, password: string, confirmPassword: string) => Promise<void>; // New method for password reset
    fetchProfile: () => Promise<Profile>; // Updated return type
    updateProfile: (profileData: any) => Promise<void>;
    changePassword: (email: string, oldPassword: string, newPassword: string, confirmPassword: string) => Promise<void>; // Ensure this matches the implementation
    fetchDogs: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [dogs, setDogs] = useState<Dog[]>([]);


    // useEffect(() => {
    //     const token = localStorage.getItem('@jwt');
    //     if (token) {
    //         fetchProfile();
    //         fetchDogs();
    //     }
    // }, []);

    const login = async (role: string, userId: string, password: string): Promise<User> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role,
                    user_id: userId,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const userData = data.result.loginInstance;
            const token = data.result.token;
            const memberId = data.result.loginInstance.id
            localStorage.setItem('token', token);
            localStorage.setItem('memberId', memberId)
            const userDetails = {
                firstName: userData.first_name,
                lastName: userData.last_name,
                userName: userData.user_name,
                middleName: userData.middle_name,
                userRole: userData.role,
            };
            localStorage.setItem('userDetails', JSON.stringify(userDetails));

            setUser(userData);
            return userData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        // Retrieve remembered credentials
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        const rememberedPassword = localStorage.getItem('rememberedPassword');

        // Clear all localStorage
        localStorage.clear();

        // Restore remembered credentials
        if (rememberedEmail) localStorage.setItem('rememberedEmail', rememberedEmail);
        if (rememberedPassword) localStorage.setItem('rememberedPassword', rememberedPassword);

        // Clear user state
        setUser(null);
    };


    const verifyEmail = async (email: string, role: string): Promise<any> => { // Change the return type to any or a specific type
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}auth/email-verification-with-password-change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'email',
                    email: email,
                    role: role
                }),
            });

            if (!response.ok) {
                throw new Error('Email verification failed');
            }

            const data = await response.json(); // Get the response data
            return data; // Return the data
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const verifyForgetEmail = async (email: string): Promise<any> => { // Change the return type to any or a specific type
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}auth/email-verification-with-password-change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'veryemail',
                    email: email,
                }),
            });

            if (!response.ok) {
                throw new Error('Email verification failed');
            }

            const data = await response.json(); // Get the response data
            return data; // Return the data
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const verifyOtp = async (email: string, otp: string, role: string): Promise<void> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}auth/email-verification-with-password-change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    otp: otp,
                    email: email,
                    role: role, // Include the role in the request body
                    type: 'otp', // Include the type as per your API requirements
                }),
            });

            if (!response.ok) {
                throw new Error('OTP verification failed');
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const registerUser = async (userData: any): Promise<void> => {
        try {
            let apiUrl = `${process.env.REACT_APP_API_URL}auth/registration/member`;

            // Check the role and set the API URL accordingly
            if (userData.role === 'ADMIN') {
                apiUrl = `${process.env.REACT_APP_API_URL}auth/registration/admin`;
            }

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

    const resetPassword = async (email: string, password: string, confirmPassword: string): Promise<void> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}auth/email-verification-with-password-change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'password',
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Password reset failed');
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    };


    const fetchProfile = async (): Promise<Profile> => {
        const token = localStorage.getItem('@jwt');
        if (!token) {
            setUser(null); // Clear user state if no token
            return Promise.reject('No token found');
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}auth/get-profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            // Return the profile data with snake_case property names
            return {
                first_name: data.result.userDetails.first_name || '',
                middle_name: data.result.userDetails.middle_name || '',
                last_name: data.result.userDetails.last_name || '',
                phone_number: data.result.userDetails.phone_number || '',
                email: data.result.userDetails.email || '',
                date_of_birth: data.result.userDetails.date_of_birth || null,
                user_name: data.result.userDetails.user_name || '',
                gender: data.result.userDetails.gender || '',
                address_line_1: data.result.userDetails.address_line_1 || '',
                address_line_2: data.result.userDetails.address_line_2 || '',
                city: data.result.userDetails.city || '',
                state: data.result.userDetails.state || '',
                country: data.result.userDetails.country || '',
                ZIP: data.result.userDetails.ZIP || '',
                contact_label: data.result.userDetails.contact_label || '',
                phone_extension: data.result.userDetails.phone_extension || '',
                profilePicture: null, // Handle profile picture separately if needed
                role: data.result.userDetails.role || '',
            };
        } catch (error) {
            console.error('Error fetching profile:', error);
            setUser(null); // Clear user state on error
            throw error;
        }
    };

    const updateProfile = async (profileData: FormData): Promise<void> => {
        const token = localStorage.getItem('@jwt');
        if (!token) {
            throw new Error('No token found');
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}auth/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    const changePassword = async (email: string, oldPassword: string, newPassword: string, confirmPassword: string): Promise<void> => {
        const token = localStorage.getItem('@jwt'); // Retrieve the token from local storage
        if (!token) {
            throw new Error('No token found'); // Handle case where token is not available
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}auth/password-change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the Authorization header
                },
                body: JSON.stringify({
                    email,
                    old_password: oldPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Password change failed');
            }

        } catch (error) {
            throw error;
        }
    };

    const fetchDogs = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}member/dog/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('@jwt')}`, // Include token if needed
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dog list');
            }

            const data = await response.json();
            setDogs(data.data); // Assuming the response has a data field with the dogs
        } catch (error) {
            console.error('Error fetching dogs:', error);
        }
    };



    return (
        <AuthContext.Provider value={{ user, login, logout, verifyEmail, verifyOtp, registerUser, verifyForgetEmail, resetPassword, fetchProfile, updateProfile, changePassword, fetchDogs }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};