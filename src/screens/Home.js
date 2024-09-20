import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, storage, db } from '../firebase';
import '../styles/Home.css';
import IconSoloMeetTEA from '../icons/icon-solo-meet-tea.png';
import '@fontsource/poetsen-one';

const Home = (props) => {
    const [openModalPublicar, setOpenModalPublicar] = useState(false);
    const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
    const [openModalPerfis, setOpenModalPerfis] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [filter, setFilter] = useState("");
    const [ageFilter, setAgeFilter] = useState(""); // Novo estado para idade
    const [genderFilter, setGenderFilter] = useState(""); // Novo estado para sexo
    const navigate = useNavigate();

    //calcula a idade com base na data de nascimento
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
        if (openModalVisualizar) {
            db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
                const postPromises = snapshot.docs.map(async (doc) => {
                    const postData = doc.data();
                    const commentsSnapshot = await db.collection("posts").doc(doc.id).collection("comments").orderBy("timestamp", "asc").get();
                    const comments = commentsSnapshot.docs.map(commentDoc => ({
                        id: commentDoc.id,
                        ...commentDoc.data()
                    }));
                    return {
                        id: doc.id,
                        post: postData,
                        comments: comments
                    };
                });
                Promise.all(postPromises).then(posts => setPosts(posts));
            });
        }
    }, [openModalVisualizar]);

    useEffect(() => {
        if (openModalPerfis) {
            db.collection("users").get().then(snapshot => {
                const profilesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProfiles(profilesData);
                setFilteredProfiles(profilesData); // Inicialmente, todos os perfis são exibidos
            }).catch(error => {
                console.error("Erro ao buscar perfis:", error);
            });
        }
    }, [openModalPerfis]);

    useEffect(() => {
        const filtered = profiles.filter(profile => {
            const displayName = profile.displayName || ""; // Protege contra undefined
            const email = profile.email || ""; // Protege contra undefined
    
            const calculateAge = (birthDate) => {
                const birth = new Date(birthDate);
                const today = new Date();
                let age = today.getFullYear() - birth.getFullYear();
                const monthDifference = today.getMonth() - birth.getMonth();
    
                if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }
    
                return age;
            };
    
            const age = profile.birthDate ? calculateAge(profile.birthDate) : ""; // Calcula a idade
            const gender = profile.gender || ""; // Protege contra undefined
    
            const matchesNameOrEmail = displayName.toLowerCase().includes(filter.toLowerCase()) ||
                email.toLowerCase().includes(filter.toLowerCase());
    
            const matchesAge = ageFilter ? age.toString().includes(ageFilter) : true;
            const matchesGender = genderFilter ? gender.toLowerCase() === genderFilter.toLowerCase() : true;
    
            return matchesNameOrEmail && matchesAge && matchesGender;
        });
        setFilteredProfiles(filtered);
    }, [filter, ageFilter, genderFilter, profiles]);

    if (!props.user) {
        return <Navigate to="/" />;
    }

    const uploadPost = (e) => {
        e.preventDefault();

        let titlePost = document.getElementById("titlePost").value;
        let descricaoPost = document.getElementById("descricaoPost").value;

        if (!file) {
            alert("Selecione um arquivo para upload");
            return;
        }

        const uploadTask = storage.ref(`images/${file.name}`).put(file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                console.error("Erro no upload:", error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(file.name)
                    .getDownloadURL()
                    .then((url) => {
                        db.collection("posts").add({
                            title: titlePost,
                            description: descricaoPost,
                            imageUrl: url,
                            timestamp: new Date(),
                            user: props.user,
                            likes: 0,
                        });

                        setProgress(0);
                        setFile(null);
                        setOpenModalPublicar(false);
                    });
            }
        );
    }

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                console.log("Usuário deslogado com sucesso");
                window.location.href = '/';
            })
            .catch((error) => {
                console.error("Erro ao tentar deslogar:", error);
            });
    };

    const handleOpenChat = () => {
        setShowChat(!showChat);
    };

    const handleCommentSubmit = (postId) => {
        if (commentText.trim()) {
            const newComment = {
                text: commentText,
                user: props.user,
                timestamp: new Date(),
            };
    
            // Adiciona o comentário ao Firestore
            db.collection("posts").doc(postId).collection("comments").add(newComment);
    
            // Atualiza o estado local para refletir o novo comentário imediatamente
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { 
                            ...post,
                            comments: [...post.comments, newComment] 
                          }
                        : post
                )
            );
    
            setCommentText("");
            setCurrentPostId(null);
        }
    };
    

    const handleLike = async (postId, currentLikes) => {
        try {
            await db.collection("posts").doc(postId).update({
                likes: currentLikes + 1
            });
        } catch (error) {
            console.error('Erro ao curtir a publicação:', error);
        }
    }

    const handleProfileClick = (profileId) => {
        navigate(`/profile/${profileId}`);
    }

    return (
        <div className="container-home">
            <div className="navbar"> 
            <nav className="nav flex-column">
             <a class="nav-link active" id="Inicio" aria-current="page" href="./Home">Inicio </a>
             <a class="nav-link" id="perfil" href="./Profile">Perfil</a>
             <a class="nav-link" id="config" href="#">Configurações</a>
             <button className="btn-post" id="btn-chat" onClick={handleOpenChat}>
                {showChat ? 'Fechar' : 'Chat'}
            </button>
             <button className="btn-post" id="btn-pub" onClick={() => setOpenModalPublicar(!openModalPublicar)}>
                {openModalPublicar ? 'Fechar' : 'Postar'} 
              </button>
             </nav>
         </div>
            <div className="header">
                <h1 className="title">
                    <h1 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={IconSoloMeetTEA} width={100} style={{ margin: '0 10px' }} />
                        MEET TEA
                        <img style={{ margin: '0 10px' }} src={IconSoloMeetTEA} width={100} />
                    </h1>
                </h1>
            </div>

            <p>Olá, {props.user}!</p>

            <button className="btn-post" onClick={() => setOpenModalVisualizar(!openModalVisualizar)}>
                {openModalVisualizar ? 'Fechar' : 'Visualizar'} Posts
            </button>
            <button className="btn-post" onClick={() => setOpenModalPerfis(!openModalPerfis)}>
                {openModalPerfis ? 'Fechar' : 'Visualizar'} Perfis
            </button>
           
            <button className="btn-post" onClick={() => navigate('/profile')}>
                Meu Perfil
            </button>
            <button className="btn-post" onClick={handleLogout}>Sair</button>

            {showChat && <iframe src="https://meet-tea-3db7c.web.app/" style={{ width: '100%', height: '100vh' }} />}

            {openModalPublicar &&
                <div id="container-publicar" className="modal-publicar">
                    <form onSubmit={(e) => uploadPost(e)}>
                        <progress value={progress} id="progress" max="100"></progress>

                        <label>Título</label>
                        <input type="text" id="titlePost" placeholder="Insira um Título para sua Publicação..." />

                        <label>Imagem:</label>
                        <input type="file" id="imagePost" onChange={(e) => setFile(e.target.files[0])} placeholder="Image..." />

                        <label>Descrição</label>
                        <textarea placeholder="Insira uma descrição para sua publicação..." id="descricaoPost"></textarea>

                        <button type="submit">Publicar</button>
                        <button type="button" onClick={() => setOpenModalPublicar(false)}>Fechar Publicação</button>
                    </form>
                </div>
            }

            {openModalVisualizar &&
                <div id="container-posts" className="modal-posts">
                    {posts.map((post) => (
                        <div key={post.id} className="post">
                            <h2>{post.post.title}</h2>
                            <img style={{width: '100%' }} src={post.post.imageUrl} alt={post.post.title} />
                            <p>{post.post.description}</p>
                            <button onClick={() => handleLike(post.id, post.post.likes)}>
                                Curtir ({post.post.likes})
                            </button>
                            <div className="comments">
                                <h3>Comentários:</h3>
                                {post.comments.map(comment => (
                                    <div key={comment.id} className="comment">
                                        <p><strong>{comment.user}:</strong> {comment.text}</p>
                                    </div>
                                ))}
                                {currentPostId === post.id && (
                                    <div className="comment-form">
                                        <textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Escreva um comentário..."
                                        />
                                        <button onClick={() => handleCommentSubmit(post.id)}>Enviar</button>
                                    </div>
                                )}
                                <button onClick={() => setCurrentPostId(post.id === currentPostId ? null : post.id)}>
                                    {currentPostId === post.id ? 'Fechar' : 'Comentar'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            }

            {openModalPerfis &&
                <div id="container-perfis" className="modal-perfis">
                    <div className="filter-controls">
                        <label>Filtrar por Nome/Email:</label>
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Filtrar por Nome ou Email"
                        />

                        <label>Filtrar por Idade:</label>
                        <input
                            type="text"
                            value={ageFilter}
                            onChange={(e) => setAgeFilter(e.target.value)}
                            placeholder="Filtrar por Idade"
                        />

                        <label>Filtrar por Sexo:</label>
                        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    {filteredProfiles.map(profile => (
                        <div key={profile.id} className="profile" onClick={() => handleProfileClick(profile.id)}>
                            <p><strong>Nome:</strong> {profile.displayName}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Idade:</strong> {calcularIdade(profile.birthDate)}</p> 
                            <p><strong>Sexo:</strong> {profile.gender}</p>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default Home;
