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
    
        let birthDate = document.getElementById("birthdate-cadastro").value;
        let idade = calcularIdade(birthDate);
    
        // Verifica se o usuário é maior de idade (18 anos ou mais)
        if (idade < 18) {
            toast.error('Você precisa ser maior de idade para criar uma conta.');
            return;
        }

        let email = document.getElementById("email-cadastro").value;
        let password = document.getElementById("password-cadastro").value;
        let userName = document.getElementById("userName-cadastro").value;
        let gender = document.getElementById("gender-cadastro").value;
        let phone = document.getElementById("phone-cadastro").value;
        let address = document.getElementById("address-cadastro").value;
        let about = document.getElementById("about-cadastro").value;
        let selectedFile = document.getElementById("file-cadastro").files[0];
        let profilePhoto = document.getElementById("profile-photo-cadastro").files[0]; // Novo campo

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
                about,
                fileURL,
                birthDate,
                idade,
                profilePhotoURL, // Adicionando a URL da foto do perfil no banco de dados
            });

        } catch (error) {
            toast.error('Erro ao criar uma conta: ' + error.message);
        }
    }

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
    }

    const enviarEmailRedefinicaoSenha = (e) => {
        e.preventDefault();

        auth.sendPasswordResetEmail(resetEmail)
            .then(() => {
                toast.success('E-mail de redefinição de senha enviado!');
                setShowResetPassword(false);
            })
            .catch((error) => toast.error('Erro ao enviar e-mail de redefinição de senha: ' + error.message));
    }

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
                        <input type="text" id="userName-cadastro" placeholder="Nome de usuário" required/>
                        <input type="email" placeholder="User@gmail.com" id="email-cadastro" required/>
                        <input type="password" id="password-cadastro" placeholder="Senha" required/>
                        <input type="date" id="birthdate-cadastro" placeholder="Data de Nascimento" required/>
                        <select id="gender-cadastro" required>
                            <option value="">Selecione o Sexo</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                        <input type="text" id="phone-cadastro" placeholder="Telefone" />
                        <input type="text" id="address-cadastro" placeholder="Endereço" />
                        {/* <textarea id="about-cadastro" placeholder="Sobre mim"></textarea> */}
                        <label>Carteira CIPTEA</label>
                        <input type="file" id="file-cadastro" required/>
                        {/* <label>Foto de perfil</label>
                        <input type="file" id="profile-photo-cadastro" /> Novo campo */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input style={{width: '10px' ,marginRight: '20px'}}
                                type="checkbox"
                                id="aceitou-termos"
                                checked={aceitouTermos}
                                onChange={(e) => setAceitouTermos(e.target.checked)}
                            />

                           
                            <label htmlFor="aceitou-termos" style={{marginBottom: '10px'}}>
                                Ao submeter esse formulário, declaro que li e entendi que o tratamento de dados pessoais será realizado nos termos de <a href="/termos-privacidade">Política de Privacidade </a> Meet TEA
                            </label>
                        </div>
                        <button onClick={(e) => criarConta(e)}>Registrar-se</button>
                        <p>Já tem uma Conta? <span onClick={() => setContainerLogar(!containerLogar)}>Logar-se</span></p>
                    </div>
                    
                }
               

                {showResetPassword && (
                    <div className="reset-password-modal">
                        <div className="reset-password-content">
                            <h2>Redefinir Senha</h2>
                            <input
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                            />
                            <button onClick={(e) => enviarEmailRedefinicaoSenha(e)}>Enviar E-mail de Redefinição</button>
                            <button onClick={() => setShowResetPassword(false)}>Fechar</button>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    )
}

export default LoginRegistro;





// CASO PRECISE DO CODE ANTIGO....:
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, storage, db } from '../firebase.js';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import '../styles/logincadastro.css';
// import IconSoloMeetTEA from '../icons/icon-solo-meet-tea.png';

// const LoginRegistro = (props) => {
//     const [containerLogar, setContainerLogar] = useState(true);
//     const [aceitouTermos, setAceitouTermos] = useState(false);
//     const [showResetPassword, setShowResetPassword] = useState(false);
//     const [resetEmail, setResetEmail] = useState("");
//     const navigate = useNavigate();

//     const criarConta = async (e) => {
//         e.preventDefault();

//         if (!aceitouTermos) {
//             toast.error('Você precisa aceitar os termos para criar uma conta.');
//             return;
//         }

//         let email = document.getElementById("email-cadastro").value;
//         let password = document.getElementById("password-cadastro").value;
//         let userName = document.getElementById("userName-cadastro").value;
//         let selectedFile = document.getElementById("file-cadastro").files[0];

//         try {
//             const authUser = await auth.createUserWithEmailAndPassword(email, password);
//             toast.success("Conta criada com Sucesso!");

//             await authUser.user.updateProfile({
//                 displayName: userName
//             });

//             let fileURL = '';

//             if (selectedFile) {
//                 const fileRef = storage.ref().child(`user_files/${authUser.user.uid}/${selectedFile.name}`);
//                 await fileRef.put(selectedFile);
//                 fileURL = await fileRef.getDownloadURL();
//                 console.log('Arquivo enviado com sucesso! URL:', fileURL);
//             }

//             // Aqui está salvando as informações do usuário no Firestore.
//             await db.collection('users').doc(authUser.user.uid).set({
//                 email: authUser.user.email,
//                 fileURL,
//             });

//         } catch (error) {
//             toast.error('Erro ao criar uma conta: ' + error.message);
//         }
//     }


//     const logar = async (e) => {
//         e.preventDefault();

//         let email = document.getElementById("email-login").value;
//         let password = document.getElementById("password-login").value;

//         try {
//             const authResult = await auth.signInWithEmailAndPassword(email, password);
//             const userDoc = await db.collection('users').doc(authResult.user.uid).get();

//             if (userDoc.exists && userDoc.data().banned) {
//                 toast.error('Sua conta foi banida. Fale com algum ADM.');
//                 await auth.signOut();
//                 return;
//             }

//             props.setUser(authResult.user.displayName);
//             toast.success('Logado com Sucesso!');
//             navigate('/home');
//         } catch (error) {
//             toast.error('Erro ao logar: ' + error.message);
//         }
//     }


//     const enviarEmailRedefinicaoSenha = (e) => {
//         e.preventDefault();

//         auth.sendPasswordResetEmail(resetEmail)
//             .then(() => {
//                 toast.success('E-mail de redefinição de senha enviado!');
//                 setShowResetPassword(false);
//             })
//             .catch((error) => toast.error('Erro ao enviar e-mail de redefinição de senha: ' + error.message));
//     }

//     return (
//         <div className="App">
//             <div className="main">
//                 {containerLogar ?
//                     <div className="main-container-login">
//                         <h1 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                             <img src={IconSoloMeetTEA} width={40} style={{ margin: '0 10px' }} />MEET TEA <img style={{ margin: '0 10px' }} src={IconSoloMeetTEA} width={40} />
//                         </h1>
//                         <input type="email" placeholder="User@gmail.com" id="email-login" />
//                         <input type="password" id="password-login" placeholder="Senha" />
//                         <button onClick={(e) => logar(e)}>Iniciar Sessão</button>
//                         <p onClick={() => setShowResetPassword(true)} style={{ cursor: 'pointer', color: 'blue' }}>Esqueci a senha</p>
//                         <p>Não tem uma Conta? <span onClick={() => setContainerLogar(!containerLogar)}>Registrar-se</span></p>
//                     </div>
//                     :
//                     <div className="main-container-registro">
//                         <h1 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                             <img src={IconSoloMeetTEA} width={40} style={{ margin: '0 10px' }} />MEET TEA <img src={IconSoloMeetTEA} width={40} style={{ margin: '0 10px' }} />
//                         </h1>
//                         <input type="email" placeholder="User@gmail.com" id="email-cadastro" />
//                         <input type="password" id="password-cadastro" placeholder="Senha" />
//                         <input type="text" id="userName-cadastro" placeholder="Nome de usuário" />
//                         <input type="file" id="file-cadastro" />
//                         <div style={{ display: 'flex', alignItems: 'center' }}>
//                             <input
//                                 type="checkbox"
//                                 id="aceitou-termos"
//                                 checked={aceitouTermos}
//                                 onChange={(e) => setAceitouTermos(e.target.checked)}
//                             />
//                             <label htmlFor="aceitou-termos">
//                                 Ao submeter esse formulário, declaro que li e entendi que o tratamento de dados pessoais será realizado nos termos da Política de Privacidade do Meet TEA
//                             </label>
//                         </div>
//                         <button onClick={(e) => criarConta(e)}>Registrar-se</button>
//                         <p>Já tem uma Conta? <span onClick={() => setContainerLogar(!containerLogar)}>Logar-se</span></p>
//                     </div>
//                 }

//                 {showResetPassword && (
//                     <div className="reset-password-modal">
//                         <div className="reset-password-content">
//                             <h2>Redefinir Senha</h2>
//                             <input
//                                 type="email"
//                                 placeholder="Digite seu e-mail"
//                                 value={resetEmail}
//                                 onChange={(e) => setResetEmail(e.target.value)}
//                             />
//                             <button onClick={(e) => enviarEmailRedefinicaoSenha(e)}>Enviar E-mail de Redefinição</button>
//                             <button onClick={() => setShowResetPassword(false)}>Fechar</button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <ToastContainer />
//         </div>
//     )
// }

// export default LoginRegistro;
