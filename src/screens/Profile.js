import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase.js'; // Certifique-se de importar o Firebase corretamente

export const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newProfilePhoto, setNewProfilePhoto] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        phone: '',
        about: '',
    });
    const user = auth.currentUser;

    // Função para calcular a idade com base na data de nascimento
    const calcularIdade = (birthDate) => {
        const hoje = new Date();
        const nascimento = new Date(birthDate);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        // Verifica se o aniversário ainda não aconteceu neste ano
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return idade;
    };

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        setUserData(userDoc.data());
                        setFormData({
                            displayName: userDoc.data().displayName || '',
                            phone: userDoc.data().phone || '',
                            about: userDoc.data().about || '',
                        });
                    } else {
                        console.log('Usuário não encontrado no Firestore.');
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        } else {
            console.log('Usuário não autenticado.');
            setLoading(false);
        }
    }, [user]);

    const handleFileChange = (event) => {
        setNewProfilePhoto(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!newProfilePhoto) return;

        setUploading(true);
        const fileRef = storage.ref(`profilePhotos/${user.uid}/${newProfilePhoto.name}`);
        try {
            await fileRef.put(newProfilePhoto);
            const newPhotoURL = await fileRef.getDownloadURL();

            await db.collection('users').doc(user.uid).update({
                profilePhotoURL: newPhotoURL
            });

            setUserData(prevData => ({ ...prevData, profilePhotoURL: newPhotoURL }));
            alert('Foto de perfil atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            alert('Erro ao atualizar a foto de perfil.');
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await db.collection('users').doc(user.uid).update(formData);
            setUserData(prevData => ({ ...prevData, ...formData }));
            setEditMode(false);
            alert('Dados atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            alert('Erro ao atualizar os dados.');
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="profile-container">
            {userData ? (
                <div>
                    <h1>Perfil</h1>
                    <img src={userData.profilePhotoURL || 'default-profile-pic.png'} alt="Foto de Perfil" width={100} />
                    {editMode ? (
                        <div>
                            <input
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleInputChange}
                                placeholder="Nome"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Telefone"
                            />
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleInputChange}
                                placeholder="Sobre mim"
                            />
                            <button onClick={handleSaveChanges}>Salvar Alterações</button>
                            <button onClick={() => setEditMode(false)}>Cancelar</button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Nome:</strong> {userData.displayName}</p>
                            <p><strong>Email:</strong> {userData.email}</p>
                            <p><strong>Idade:</strong> {calcularIdade(userData.birthDate)}</p> {/* Exibir idade aqui */}
                            <p><strong>Sexo:</strong> {userData.gender}</p>
                            <p><strong>Telefone:</strong> {userData.phone}</p>
                            <p><strong>Endereço:</strong> {userData.address}</p>
                            <p><strong>Sobre mim:</strong> {userData.about}</p>
                            {userData.fileURL && (
                                <div>
                                    <h2>Arquivo</h2>
                                    <a href={userData.fileURL} target="_blank" rel="noopener noreferrer">Visualizar Arquivo</a>
                                </div>
                            )}
                            <button onClick={() => setEditMode(true)}>Editar Perfil</button>
                            <div className="profile-photo-update">
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                                <button onClick={handleUpload} disabled={uploading}>
                                    {uploading ? 'Atualizando...' : 'Atualizar Foto de Perfil'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>Dados do usuário não encontrados.</div>
            )}
        </div>
    );
};

export default Profile;
