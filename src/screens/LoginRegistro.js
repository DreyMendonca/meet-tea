import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage, db } from '../firebase.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/poetsen-one';

import '../styles/logincadastro.css';
import IconSoloMeetTEA from '../icons/icon-solo-meet-tea.png';
import capa_meet_tea from '../img/capa_meet_tea.png';
import animalogin from '../img/animalogin.gif';

const LoginRegistro = (props) => {
    const [containerLogar, setContainerLogar] = useState(true);
    const [aceitouTermos, setAceitouTermos] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const navigate = useNavigate();

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

    const criarConta = async (e) => {
        e.preventDefault();

        if (!aceitouTermos) {
            toast.error('Você precisa aceitar os termos para criar uma conta.');
            return;
        }

        // Certifique-se de que os elementos DOM estão disponíveis antes de tentar acessar seus valores
        const birthdateElement = document.getElementById("birthdate-cadastro");
        const emailElement = document.getElementById("email-cadastro");
        const passwordElement = document.getElementById("password-cadastro");
        const userNameElement = document.getElementById("userName-cadastro");
        const genderElement = document.getElementById("gender-cadastro");
        const phoneElement = document.getElementById("phone-cadastro");
        const addressElement = document.getElementById("address-cadastro");
        const fileElement = document.getElementById("file-cadastro");
        const profilePhotoElement = document.getElementById("profile-photo-cadastro");

        if (!birthdateElement || !emailElement || !passwordElement || !userNameElement || !genderElement || !phoneElement || !addressElement || !fileElement) {
            toast.error("Há campos faltando no formulário de cadastro.");
            return;
        }

        let birthDate = birthdateElement.value;
        let idade = calcularIdade(birthDate);

        // Verifica se o usuário é maior de idade (18 anos ou mais)
        if (idade < 18) {
            toast.error('Você precisa ser maior de idade para criar uma conta.');
            return;
        }

        let email = emailElement.value;
        let password = passwordElement.value;
        let userName = userNameElement.value;
        let gender = genderElement.value;
        let phone = phoneElement.value;
        let address = addressElement.value;
        let selectedFile = fileElement.files[0];
        let profilePhoto = profilePhotoElement ? profilePhotoElement.files[0] : null;

        try {
            const authUser = await auth.createUserWithEmailAndPassword(email, password);
            toast.success("Conta criada com Sucesso!");

            await authUser.user.updateProfile({
                displayName: userName
            });

            let fileURL = '';
            let profilePhotoURL = '';

            if (selectedFile) {
                const fileRef = storage.ref().child(`user_files/${authUser.user.uid}/${selectedFile.name}`);
                await fileRef.put(selectedFile);
                fileURL = await fileRef.getDownloadURL();
                console.log('Arquivo enviado com sucesso! URL:', fileURL);
            }

            if (profilePhoto) {
                const profilePhotoRef = storage.ref().child(`user_profile_photos/${authUser.user.uid}/${profilePhoto.name}`);
                await profilePhotoRef.put(profilePhoto);
                profilePhotoURL = await profilePhotoRef.getDownloadURL();
                console.log('Foto do perfil enviada com sucesso! URL:', profilePhotoURL);
            }

            // Salvando as novas informações do usuário no Firestore
            await db.collection('users').doc(authUser.user.uid).set({
                email: authUser.user.email,
                displayName: userName,
                birthDate,
                gender,
                phone,
                address,
                about: '', // Aqui pode adicionar o campo "about" se quiser
                fileURL,
                idade,
                profilePhotoURL,
            });

        } catch (error) {
            toast.error('Erro ao criar uma conta: ' + error.message);
        }
    };

    const logar = async (e) => {
        e.preventDefault();

        let email = document.getElementById("email-login").value;
        let password = document.getElementById("password-login").value;

        try {
            const authResult = await auth.signInWithEmailAndPassword(email, password);
            const userDoc = await db.collection('users').doc(authResult.user.uid).get();

            if (userDoc.exists && userDoc.data().banned) {
                toast.error('Sua conta foi banida. Fale com algum ADM.');
                await auth.signOut();
                return;
            }

            props.setUser(authResult.user.displayName);
            toast.success('Logado com Sucesso!');
            navigate('/home');
        } catch (error) {
            toast.error('Erro ao logar: ' + error.message);
        }
    };

    const enviarEmailRedefinicaoSenha = (e) => {
        e.preventDefault();

        auth.sendPasswordResetEmail(resetEmail)
            .then(() => {
                toast.success('E-mail de redefinição de senha enviado!');
                setShowResetPassword(false);
            })
            .catch((error) => toast.error('Erro ao enviar e-mail de redefinição de senha: ' + error.message));
    };

    return (
        <div className="App">
            <div className="gif">
                <img src={animalogin} width={550} height={550} alt="..." />
            </div>
            <div className="main">
                {containerLogar ?
                    <div className="main-container-login">
                        <h1 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={IconSoloMeetTEA} width={55} style={{ margin: '0 10px' }} />MEET TEA <img style={{ margin: '0 10px' }} src={IconSoloMeetTEA} width={55} />
                        </h1>
                        <input type="email" placeholder="User@gmail.com" id="email-login" />
                        <input type="password" id="password-login" placeholder="Senha" />
                        <button onClick={(e) => logar(e)}>Iniciar Sessão</button>
                        <p onClick={() => setShowResetPassword(true)} style={{ cursor: 'pointer', color: 'blue' }}>Esqueci a senha</p>
                        <p>Não tem uma Conta? <span onClick={() => setContainerLogar(!containerLogar)}>Registrar-se</span></p>
                    </div>
                    :
                    <div className="main-container-registro">
                        <h1 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={IconSoloMeetTEA} width={40} style={{ margin: '0 10px' }} />MEET TEA <img src={IconSoloMeetTEA} width={40} style={{ margin: '0 10px' }} />
                        </h1>
                        <input type="text" id="userName-cadastro" placeholder="Nome de usuário" required />
                        <input type="email" placeholder="User@gmail.com" id="email-cadastro" required />
                        <input type="password" id="password-cadastro" placeholder="Senha" required />
                        <input type="date" id="birthdate-cadastro" placeholder="Data de Nascimento" required />
                        <select id="gender-cadastro" required>
                            <option value="">Selecione o Sexo</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                        <input type="text" id="phone-cadastro" placeholder="Telefone" />
                        <input type="text" id="address-cadastro" placeholder="Endereço" />
                        <label>Carteira CIPTEA</label>
                        <input type="file" id="file-cadastro" required />
                        {/* <label>Foto de perfil</label>
                        <input type="file" id="profile-photo-cadastro" /> */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input style={{ width: '10px', marginRight: '20px' }}
                                type="checkbox"
                                id="aceitou-termos"
                                checked={aceitouTermos}
                                onChange={(e) => setAceitouTermos(e.target.checked)}
                            />
                            <label htmlFor="aceitou-termos">Aceitar os Termos</label>
                        </div>
                        <button onClick={(e) => criarConta(e)}>Registrar</button>
                        <p>Já tem uma Conta? <span onClick={() => setContainerLogar(!containerLogar)}>Iniciar Sessão</span></p>
                    </div>
                }
            </div>

            {showResetPassword &&
                <div className="reset-password-modal">
                    <h2>Redefinir Senha</h2>
                    <input
                        type="email"
                        placeholder="Insira o seu email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                    />
                    <button onClick={enviarEmailRedefinicaoSenha}>Enviar Email de Redefinição</button>
                    <button onClick={() => setShowResetPassword(false)}>Cancelar</button>
                </div>
            }

            <ToastContainer />
        </div>
    );
};

export default LoginRegistro;
