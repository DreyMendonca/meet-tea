import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

export const Admin = () => {
    const [users, setUsers] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminName, setAdminName] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    // Função para autenticar o ADM.
    const handleLogin = () => {
        if (adminName === 'Robert' && adminPassword === 'MeetTEA') {
            setIsLoggedIn(true);
        } else if (adminName === 'Julia' && adminPassword === 'MeetTEA') {
            setIsLoggedIn(true);
        } else if (adminName === 'Isabelle' && adminPassword === 'MeetTEA') {
            setIsLoggedIn(true);
        } else if (adminName === 'Marcos' && adminPassword === 'MeetTEA') {
            setIsLoggedIn(true);
        }
        else {
            alert('Nome ou senha incorretos!');
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            if (!isLoggedIn) return;

            try {
                const usersCollection = await db.collection('users').get();
                const usersList = [];

                for (const userDoc of usersCollection.docs) {
                    const userData = userDoc.data();
                    const fileURL = userData.fileURL;

                    usersList.push({
                        id: userDoc.id,
                        email: userData.email,
                        fileURL,
                        banned: userData.banned || false,
                    });
                }

                setUsers(usersList);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        fetchUsers();
    }, [isLoggedIn]);

    const banUser = async (userId) => {
        try {
            await db.collection('users').doc(userId).update({
                banned: true,
            });

            setUsers(users.map(user =>
                user.id === userId ? { ...user, banned: true } : user
            ));
            console.log('Usuário banido com sucesso!');
        } catch (error) {
            console.error('Erro ao banir o usuário:', error);
        }
    };

    if (!isLoggedIn) {
        return (
            <div>
                <h1>Admin Login</h1>
                <div>
                    <label>
                        Nome Admin:
                        <input
                            type="text"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Senha Admin:
                        <input
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                        />
                    </label>
                </div>
                <button onClick={handleLogin}>Entrar</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Usuários Cadastrados</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID do Usuário:</th>
                        <th>Email:</th>
                        <th>Arquivo/Carteirinha:</th>
                        <th>Ações (ADM):</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.fileURL ? (
                                    <a href={user.fileURL} target="_blank" rel="noopener noreferrer">Download</a>
                                ) : (
                                    'Nenhum arquivo'
                                )}
                            </td>
                            <td>
                                {!user.banned ? (
                                    <button onClick={() => banUser(user.id)}>Banir</button>
                                ) : (
                                    <span>Banido</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;




// PARA CASO PRECISE DO CODE ANTIGO>....
// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase';

// export const Admin = () => {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const usersCollection = await db.collection('users').get();

//                 const usersList = [];

//                 for (const userDoc of usersCollection.docs) {
//                     const userData = userDoc.data();
//                     const fileURL = userData.fileURL;

//                     usersList.push({
//                         id: userDoc.id,
//                         email: userData.email,
//                         fileURL,
//                         banned: userData.banned || false,
//                         // esse campo banned é o de banimento.
//                     });
//                 }

//                 setUsers(usersList);
//             } catch (error) {
//                 console.error('Erro ao buscar usuários:', error);
//             }
//         };

//         fetchUsers();
//     }, []);

//     const banUser = async (userId) => {
//         try {
//             // Atualiza o campo 'banned' do usuário no Firestore
//             await db.collection('users').doc(userId).update({
//                 banned: true,
//             });
//             // Atualiza a lista de usuários localmente
//             setUsers(users.map(user =>
//                 user.id === userId ? { ...user, banned: true } : user
//             ));
//             console.log('Usuário banido com sucesso!');
//         } catch (error) {
//             console.error('Erro ao banir o usuário:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Usuários Cadastrados</h1>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>ID do Usuário:</th>
//                         <th>Email:</th>
//                         <th>Arquivo/Carteirinha:</th>
//                         <th>Ações (ADM):</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map((user) => (
//                         <tr key={user.id}>
//                             <td>{user.id}</td>
//                             <td>{user.email}</td>
//                             <td>
//                                 {user.fileURL ? (
//                                     <a href={user.fileURL} target="_blank" rel="noopener noreferrer">Download</a>
//                                 ) : (
//                                     'Nenhum arquivo'
//                                 )}
//                             </td>
//                             <td>
//                                 {!user.banned ? (
//                                     <button onClick={() => banUser(user.id)}>Banir</button>
//                                 ) : (
//                                     <span>Banido</span>
//                                 )}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// export default Admin;
