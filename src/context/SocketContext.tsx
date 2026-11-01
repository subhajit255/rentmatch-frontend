// // SocketContext.tsx
// import React from 'react';
// import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { useAuth } from './AuthContext';

// interface SocketContextType {
//   socket: Socket | null;
// }

// const SocketContext = createContext<SocketContextType | undefined>(undefined);

// export const SocketProvider = ({ children }: { children: ReactNode }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const { token } = useAuth();

//   useEffect(() => {
//     if (token) {
//       const newSocket = io('https://rentmatch-backend.shyamfuture.in', {
//         auth: { token },
//       });

//       newSocket.on('connect', () => {
//         console.log('Socket connected');
//       });

//       newSocket.on('connect_error', (error) => {
//         console.error('Socket connection error:', error);
//       });

//       setSocket(newSocket);

//       return () => {
//         newSocket.close();
//       };
//     }
//   }, [token]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error('useSocket must be used within SocketProvider');
//   }
//   return context;
// };
