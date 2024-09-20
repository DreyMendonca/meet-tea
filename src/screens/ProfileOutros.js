import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; // Ajuste o caminho conforme necessário

const ProfileOutros = () => {
    const { id } = useParams(); // Obtém o ID da URL
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (id) {
            db.collection("users").doc(id).get().then(doc => {
                if (doc.exists) {
                    setUser(doc.data());
                } else {
                    console.log("Usuário não encontrado");
                }
            }).catch(error => {
                console.error("Erro ao buscar usuário:", error);
            });
        }
    }, [id]);

    if (!user) {
        return <div>Carregando informações do usuário...</div>;
    }

    return (
        <div>
            <h1>Informações do Usuário</h1>
            {user.profilePhotoURL && (
                <div style={{ marginBottom: '20px' }}>
                    <img
                        src={user.profilePhotoURL}
                        alt={user.name}
                        style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                    />
                </div>
            )}
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {/* Adicione mais informações do usuário conforme necessário */}
        </div>
    );
};

export default ProfileOutros;
