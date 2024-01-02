import React, { useEffect, useState } from "react";
import './Styles.modules.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import requestGameList from "../../requests/RequestGameList";
import requestPlataformList from "../../requests/RequestPlataformList";
import { useCookies } from "react-cookie";
import requestCreateOrUpdateGame from "../../requests/RequestCreateOrUpdateGame";
import requestDeleteGame from "../../requests/RequestDeleteGame";
import requestCreateOrUpdatePlataform from "../../requests/RequestCreateOrUpdatePlataform";
import requestDeletePlataform from "../../requests/RequestDeletePlataform";
import requestPageConfiguration from "../../requests/RequestPageConfiguration";
import requestUpdatePageConfiguration from "../../requests/RequestUpdatePageConfiguration";

export default function HomePage() {

    const [plataformList, setPlataformList] = useState([]);
    const [gameList, setGameList] = useState([]);

    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const user = cookies["user"];

    const [currentAba, setCurrentAba] = useState(0);
    const [editingGame, setEditingGame] = useState(false);
    const [editingPlataform, setEditingPlataform] = useState(false);
    const [addingNewPlataform, setAddingNewPlataform] = useState(false);
    const [addingNewGame, setAddingNewGame] = useState(false);
    const [currentEditingPlataform, setCurrentEditingPlataform] = useState();

    const [currentEditingGame, setCurrentEditingGame] = useState();

    const validateCookie = () => {
        if (user === undefined || user === null) {
            window.location.replace('/login');
        }
    }

    useEffect(() => {
        validateCookie();
        requestPageConfiguration(user.affiliateId, user.sessionId, setPageInformation);
        requestGameList(user.affiliateId, user.sessionId, setGameList);
        requestPlataformList(user.affiliateId, user.sessionId, setPlataformList);
    }, [user, setGameList, setPlataformList]);

    const forceUpdateGame = () => {
        const ne = {
            "gameId": currentEditingGame.gameId,
            "gameTitle": currentEditingGame.gameTitle,
            "gameImage": currentEditingGame.gameImage,
            "gameLinks": currentEditingGame.gameLinks,
            "updated": true
        };
        setCurrentEditingGame(ne);
    }

    const removePlataformFromGameLink = (v) => {
        for (let z = 0; z < currentEditingGame.gameLinks.length; z++) {
            if (currentEditingGame.gameLinks[z] === v) {
                currentEditingGame.gameLinks.splice(z, 1);
            }
        }
        forceUpdateGame();
    }

    const performDeleteGame = () => {
        requestDeleteGame(user.affiliateId, user.sessionId, currentEditingGame);
    }

    const performDeletePlataform = () => {
        requestDeletePlataform(user.affiliateId, user.sessionId, currentEditingPlataform);
    }

    const performSaveGame = (data) => {
        requestCreateOrUpdateGame(user.affiliateId, user.sessionId, data);
    }

    const performSavePlataform = (data) => {
        requestCreateOrUpdatePlataform(user.affiliateId, user.sessionId, data);
    }

    const [plataformLinkToAdd, setPlataformLinkToAdd] = useState({
        "plataform": "",
        "redirectUrl": ""
    })

    const editGame = () => {
        return (
            <div className="edit-game">
                <div className="edit-game-container">
                    <div className="edit-game-container-header">
                        <span className="edit-game-container-header-title">Editando - {currentEditingGame.gameTitle}</span>
                        <FontAwesomeIcon icon="fa-solid fa-circle-xmark" className="edit-game-container-header-close" size="1x" onClickCapture={() => setEditingGame(false)} />
                    </div>
                    <div className="game-form">
                        <div className="edit-game-container-input-title">
                            <span>Titulo:</span>
                            <input className="id" type="text" defaultValue={currentEditingGame.gameTitle} onChange={(e) => { currentEditingGame.gameTitle = e.target.value; forceUpdateGame(); }} />
                        </div>
                        <div className="edit-game-container-input-image">
                            <span>Imagem:</span>
                            <input className="id" type="text" defaultValue={currentEditingGame.gameImage} onChange={(e) => {
                                currentEditingGame.gameImage = e.target.value; forceUpdateGame()
                            }} />
                        </div>
                    </div>
                    <div className="edit-game-container-input-links">
                        <span className="title">Links:</span>
                        <div className="links-list-container">
                            <div className="links-list-header">
                                <span>Plataforma</span>
                                <span>Link</span>
                                <span>Deletar</span>
                            </div>
                            <div className="links">
                                {currentEditingGame.gameLinks.map((v) =>
                                    <div key={v.plataform} className="link">
                                        <span>{v.plataform}</span>
                                        <input type="url" className="url" readOnly defaultValue={v.redirectUrl} />
                                        <FontAwesomeIcon icon={"fa-solid fa-trash"} size="1x" className="delete" onClickCapture={() => removePlataformFromGameLink(v)} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="add-new-link">
                            <span>Novo:</span>
                            <select defaultValue={plataformList[0]} onChange={(e) => setPlataformLinkToAdd({ plataform: e.target.value, redirectUrl: plataformLinkToAdd.redirectUrl })}>
                                <option>Plataforma</option>
                                {plataformList.map((z) => (<option value={z.id} key={z.id}>{z.name}</option>))}
                            </select>
                            <input defaultValue={"Link"} onChange={(e) => setPlataformLinkToAdd({ plataform: plataformLinkToAdd.plataform, redirectUrl: e.target.value })} />
                            <FontAwesomeIcon icon="fa-solid fa-plus" className="add-button" onClick={() => { currentEditingGame.gameLinks.push(plataformLinkToAdd); forceUpdateGame(); }} />
                        </div>
                    </div>
                    <div className="edit-game-buttons">
                        <div className="edit-game-save-button" onClick={() => performSaveGame(currentEditingGame)}>
                            <span>Salvar</span>
                        </div>
                        <div className="edit-game-delete-button">
                            <span onClick={() => performDeleteGame()}>Deletar</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const forceUpdatePlataform = () => {
        const ne = {
            "id": currentEditingPlataform.id,
            "name": currentEditingPlataform.name,
            "accessLink": currentEditingPlataform.accessLink,
            "image": currentEditingPlataform.image,
            "hot": currentEditingPlataform.hot
        };
        setCurrentEditingPlataform(ne);
    }

    const editPlataform = () => {
        return (
            <div className="edit-plataform">
                <div className="edit-plataform-container">
                    <div className="edit-plataform-header">
                        <span className="edit-plataform-header-title"> Editando - {currentEditingPlataform.name}</span>
                        <FontAwesomeIcon icon="fa-solid fa-xmark" className="edit-plataform-header-close" onClick={() => setEditingPlataform(false)} />
                    </div>
                    <div className="edit-plataform-name">
                        <span>Titulo:</span>
                        <input type="text" defaultValue={currentEditingPlataform.name} onChange={e => { currentEditingPlataform.name = e.target.value; forceUpdatePlataform() }} />
                    </div>
                    <div className="edit-plataform-image">
                        <span>Imagem:</span>
                        <input type="text" defaultValue={currentEditingPlataform.image} onChange={e => { currentEditingPlataform.image = e.target.value; forceUpdatePlataform() }} />
                    </div>
                    <div className="edit-plataform-link">
                        <span>Link:</span>
                        <input type="text" defaultValue={currentEditingPlataform.accessLink} onChange={e => { currentEditingPlataform.accessLink = e.target.value; forceUpdatePlataform() }} />
                    </div>
                    <div className="edit-plataform-hot">
                        <span>Quente: </span>
                        {currentEditingPlataform.hot ? <FontAwesomeIcon icon="fa-solid fa-toggle-on" size="lg" onClick={() => { currentEditingPlataform.hot = false; forceUpdatePlataform() }} /> : <FontAwesomeIcon icon="fa-solid fa-toggle-off" size="lg" onClick={() => { currentEditingPlataform.hot = true; forceUpdatePlataform() }} />}
                    </div>
                    <div className="edit-plataform-buttons">
                        <span className="edit-plataform-buttons-save" onClick={() => performSavePlataform(currentEditingPlataform)}>Salvar</span>
                        <span className="edit-plataform-buttons-delete" onClick={() => performDeletePlataform()}>Deletar</span>
                    </div>
                </div>
            </div>
        )
    }

    const [newPlataformToSend, setNewPlataformToSend] = useState({
        "name": "",
        "accessLink": "",
        "image": "",
        "hot": false
    });

    const addPlataform = () => {
        return (
            <div className="add-new-plataform">
                <div className="add-new-plataform-container">
                    <div className="add-new-plataform-container-header">
                        <span>Adicionar Plataforma</span>
                        <FontAwesomeIcon icon="fa-solid fa-xmark" className="edit-plataform-header-close" onClick={() => setAddingNewPlataform(false)} />
                    </div>
                    <div className="add-new-plataform-container-input-name">
                        <span>Nome:</span>
                        <input type="text" onChange={(e) => newPlataformToSend.name = e.target.value} />
                    </div>
                    <div className="add-new-plataform-container-input-image">
                        <span>Imagem:</span>
                        <input type="text" onChange={(e) => newPlataformToSend.image = e.target.value} />
                    </div>
                    <div className="add-new-plataform-container-input-link">
                        <span>Link:</span>
                        <input type="text" onChange={(e) => newPlataformToSend.accessLink = e.target.value} />
                    </div>
                    <span className="add-new-plataform-container-save-button" onClick={() => performSavePlataform(newPlataformToSend)}>Salvar</span>
                </div>
            </div>
        )
    }

    const [newGameToSend, setNewGameToSend] = useState({
        "gameTitle": "",
        "gameImage": "",
        "gameLinks": []
    })

    const addGame = () => {
        return (
            <div className="add-new-games">
                <div className="add-new-game-container">
                    <div className="add-new-game-container-header">
                        <span>Adicionar Jogo</span>
                        <FontAwesomeIcon icon="fa-solid fa-xmark" className="add-new-game-header-close" onClick={() => setAddingNewGame(false)} />
                    </div>
                    <div className="add-new-game-container-input-name">
                        <span>Nome:</span>
                        <input type="text" onChange={(e) => setNewGameToSend({ gameTitle: e.target.value, gameImage: newGameToSend.gameImage, gameLinks: [] })} />
                    </div>
                    <div className="add-new-game-container-input-image">
                        <span>Imagem:</span>
                        <input type="text" onChange={(e) => setNewGameToSend({ gameTitle: newGameToSend.gameTitle, gameImage: e.target.value, gameLinks: [] })} />
                    </div>
                    <span className="add-new-game-container-save-button" onClickCapture={() => performSaveGame(newGameToSend)}>Salvar</span>
                </div>
            </div>
        )
    }

    const [color, setColor] = useState({});
    const [background, setBackground] = useState({});

    const [pageInformation, setPageInformation] = useState({
        page_title: "teste",
        instagram: "teste",
        titles: {
            footer: {
                value: "teste"
            }
        },
        home_page: {
            styles: {
                header: {
                    backgroundColor: "#FFF",
                    color: "#FFF"
                },
                main: {
                    image: {
                        active: false,
                        value: {
                            backgroundImage: "teste"
                        }
                    },
                    default: {
                        backgroundColor: "#FFF"
                    }

                },
                footer: {
                    global: {
                        backgroundColor: "#FFF",
                        color: "#FFF"
                    },
                    instagram: {
                        backgroundColor: "#FFF",
                        color: "#FFF"
                    }
                }
            }
        },
        game_page: {
            watermark: {
                active: false,
                value: "teste"
            },
            styles: {
                header: {
                    backgroundColor: "#FFF",
                    color: "#FFF"
                },
                main: {
                    image: {
                        active: false,
                        value: {
                            backgroundImage: "teste"
                        }
                    },
                    default: {
                        backgroundColor: " #FFF"
                    }

                },
                footer: {
                    global: {
                        backgroundColor: "#FFF",
                        color: "#FFF"
                    },
                    instagram: {
                        backgroundColor: "#FFF",
                        color: "#FFF"
                    }
                }
            }
        }
    });

    const performUpdatePageInformation = () => {
        requestUpdatePageConfiguration(user.affiliateId, user.sessionId, pageInformation);
    }

    const forceUpdatePageInformation = () => {
        let zzz = {
            page_title: pageInformation.page_title,
            instagram: pageInformation.instagram,
            titles: pageInformation.titles,
            home_page: pageInformation.home_page,
            game_page: pageInformation.game_page
        };

        setPageInformation(zzz);
    }

    const getAbaByNumber = () => {
        switch (currentAba) {
            case 0:
                return (
                    <div className="plataform-list">
                        <span className="plataform-list-title">Lista de Plataformas</span>
                        <div className="list-desc-table-header">
                            <b>ID</b>
                            <b>Nome</b>
                            <b>Quente</b>
                            <b>Editar</b>
                        </div>
                        <div className="plataforms">
                            {plataformList.map((v) => (
                                <div key={v.id} className="plataform">
                                    <span className="plataform-id">{v.id}</span>
                                    <span className="plataform-name">{v.name}</span>
                                    <span className="plataform-hot-value">{v.hot.toString()}</span>
                                    <button className="plataform-edit-button" onClickCapture={() => { setEditingPlataform(true); setCurrentEditingPlataform(v) }}>editar</button>
                                </div>
                            ))}
                        </div>
                        <button className="add-plataform-button" onClickCapture={() => setAddingNewPlataform(true)}>Adicionar Plataforma</button>
                    </div>
                );
            case 1:
                return (
                    <div className="game-list">
                        <div className="game-list-container">
                            <span className="game-container-title">Lista de Jogos</span>
                            <div className="table-header">
                                <span>ID</span>
                                <span>Nome</span>
                                <span>Editar</span>
                            </div>
                            <div className="games">
                                {gameList.map((v) => (
                                    <div className="game-div" key={v.gameId}>
                                        <span>{v.gameId}</span>
                                        <span>{v.gameTitle}</span>
                                        <span className="game-edit-button" onClickCapture={() => { setEditingGame(true); setCurrentEditingGame(v); }}>editar</span>
                                    </div>
                                ))}
                            </div>
                            <div className="add-new-game">
                                <span onClickCapture={() => setAddingNewGame(true)}>Adicionar Jogo</span>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="configuration-container">
                        <div className="main-titles-configuration">
                            <span className="header-title">Titulos Principais</span>
                            <div className="titles">
                                <div>
                                    <span>Titulo da Pagina</span>
                                    <input type="text" name="" id="pageTitle" defaultValue={pageInformation.page_title} onChange={e => pageInformation.page_title = e.target.value} />
                                </div>
                                <div>
                                    <span>Texto do Rodapé</span>
                                    <input type="text" name="" id="pageTitle" defaultValue={pageInformation.titles.footer.value} onChange={e => pageInformation.titles.footer.value = e.target.value} />
                                </div>
                                <div>
                                    <span>Instagram</span>
                                    <input type="text" name="" id="pageTitle" defaultValue={pageInformation.instagram} onChange={e => pageInformation.instagram = e.target.value} />
                                </div>
                                <div className="watermark">
                                    <span>Marca D`Agua</span>
                                    <input type="text" defaultValue={pageInformation.game_page.watermark.value} onChange={e => pageInformation.game_page.watermark.value = e.target.value} />
                                    {pageInformation.game_page.watermark.active ? <FontAwesomeIcon icon="fa-solid fa-toggle-on" size="lg" onClick={() => { pageInformation.game_page.watermark.active = false; forceUpdatePageInformation() }} /> : <FontAwesomeIcon icon="fa-solid fa-toggle-off" size="lg" onClick={() => { pageInformation.game_page.watermark.active = true; forceUpdatePageInformation() }} />}
                                </div>
                            </div>
                        </div>
                        <div className="home-page-configuration">
                            <div className="home-page-styles">
                                <div className="header-styles">
                                    <h4>Estilos do cabeçalho</h4>
                                    <div className="background">
                                        <span>Cor de Fundo</span>
                                        <input type="color" defaultValue={pageInformation.home_page.styles.header.backgroundColor} onChange={e => pageInformation.home_page.styles.header.backgroundColor = e.target.value} />
                                    </div>
                                    <div className="text-color">
                                        <span>Cor do Texto</span>
                                        <input type="color" defaultValue={pageInformation.home_page.styles.header.color} onChange={e => pageInformation.home_page.styles.header.color = e.target.value} />
                                    </div>
                                </div>
                                <div className="main-styles">
                                    <h4>Estilos da Pagina Central</h4>
                                    <div className="background">
                                        <span>Cor de Fundo</span>
                                        <input type="color" defaultValue={pageInformation.home_page.styles.main.default.backgroundColor} onChange={e => pageInformation.home_page.styles.main.default.backgroundColor = e.target.value} />
                                    </div>
                                    <div className="image">
                                        <span>Imagem/GIF de Fundo</span>
                                        <input type="text" defaultValue={pageInformation.home_page.styles.main.image.value.backgroundImage} onChange={e => pageInformation.home_page.styles.main.image.value.backgroundImage = e.target.value} />
                                        {pageInformation.home_page.styles.main.image.active ? <FontAwesomeIcon icon="fa-solid fa-toggle-on" size="lg" onClick={() => { pageInformation.home_page.styles.main.image.active = false; forceUpdatePageInformation() }} /> : <FontAwesomeIcon icon="fa-solid fa-toggle-off" size="lg" onClick={() => { pageInformation.home_page.styles.main.image.active = true; forceUpdatePageInformation() }} />}
                                    </div>
                                </div>
                                <div className="footer-styles">
                                    <h4>Estilos do Rodapé</h4>
                                    <div className="background">
                                        <span>Cor de Fundo</span>
                                        <input type="color" defaultValue={pageInformation.home_page.styles.footer.global.backgroundColor} onChange={e => pageInformation.home_page.styles.footer.global.backgroundColor = e.target.value} />
                                    </div>
                                    <div className="text-color">
                                        <span>Cor do Texto</span>
                                        <input type="color" defaultValue={pageInformation.home_page.styles.footer.global.color} onChange={e => pageInformation.home_page.styles.footer.global.color = e.target.value} />
                                    </div>
                                    <div className="instagram">
                                        <h5>Instagram Rodapé</h5>
                                        <div className="background">
                                            <span>Cor de Fundo</span>
                                            <input type="color" defaultValue={pageInformation.home_page.styles.footer.instagram.backgroundColor} onChange={e => pageInformation.home_page.styles.footer.instagram.backgroundColor = e.target.value} />
                                        </div>
                                        <div className="text-color">
                                            <span>Cor do Texto</span>
                                            <input type="color" defaultValue={pageInformation.home_page.styles.footer.instagram.color} onChange={e => pageInformation.home_page.styles.footer.instagram.color = e.target.value} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="game-page-configuration">
                            <h3>Estilos da Pagina de Jogo</h3>
                            <div className="game-page-styles">
                                <div className="header-styles">
                                    <h4>Estilos do cabeçalho</h4>
                                    <div className="background">
                                        <span>Cor de Fundo</span>
                                        <input type="color" defaultValue={pageInformation.game_page.styles.header.backgroundColor} onChange={e => pageInformation.game_page.styles.header.backgroundColor = e.target.value} />
                                    </div>
                                    <div className="text-color">
                                        <span>Cor do Texto</span>
                                        <input type="color" defaultValue={pageInformation.game_page.styles.header.color} onChange={e => pageInformation.game_page.styles.header.color = e.target.value} />
                                    </div>
                                </div>
                                <div className="main-styles">
                                    <h4>Estilos da Pagina Central</h4>
                                    <div className="background">
                                        <span>Cor de Fundo</span>
                                        <input type="color" defaultValue={pageInformation.game_page.styles.main.default.backgroundColor} onChange={e => pageInformation.game_page.styles.main.default.backgroundColor = e.target.value} />
                                    </div>
                                    <div className="image">
                                        <span>Imagem/GIF de Fundo</span>
                                        <input type="text" defaultValue={pageInformation.game_page.styles.main.image.value.backgroundImage} onChange={e => pageInformation.game_page.styles.main.image.value.backgroundImage = e.target.value} />
                                        {pageInformation.game_page.styles.main.image.active ? <FontAwesomeIcon icon="fa-solid fa-toggle-on" size="lg" onClick={() => { pageInformation.game_page.styles.main.image.active = false; forceUpdatePageInformation() }} /> : <FontAwesomeIcon icon="fa-solid fa-toggle-off" size="lg" onClick={() => { pageInformation.game_page.styles.main.image.active = true; forceUpdatePageInformation() }} />}
                                    </div>
                                </div>
                                <div className="footer-styles">
                                    <h4>Estilos do Rodapé</h4>
                                    <div className="background">
                                        <span>Cor de Fundo</span>
                                        <input type="color" defaultValue={pageInformation.game_page.styles.footer.global.backgroundColor} onChange={e => pageInformation.game_page.styles.footer.global.backgroundColor = e.target.value} />
                                    </div>
                                    <div className="text-color">
                                        <span>Cor do Texto</span>
                                        <input type="color" defaultValue={pageInformation.game_page.styles.footer.global.color} onChange={e => pageInformation.game_page.styles.footer.global.color = e.target.value} />
                                    </div>
                                    <div className="instagram">
                                        <h5>Instagram Rodapé</h5>
                                        <div className="background">
                                            <span>Cor de Fundo</span>
                                            <input type="color" defaultValue={pageInformation.game_page.styles.footer.instagram.backgroundColor} onChange={e => pageInformation.game_page.styles.footer.instagram.backgroundColor = e.target.value} />
                                        </div>
                                        <div className="text-color">
                                            <span>Cor do Texto</span>
                                            <input type="color" defaultValue={pageInformation.game_page.styles.footer.instagram.color} onChange={e => pageInformation.game_page.styles.footer.instagram.color = e.target.value} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="configuration-save-button" onClick={() => performUpdatePageInformation()}>Salvar</span>
                    </div>
                );
            default:
                return null;
        }
    }

    const renderTutorialButton = () => {
        switch (currentAba) {
            case 0:
                return (
                    <div className="tutorial-button">
                        <span onClick={()=> window.open("https://drive.google.com/file/d/1INuvXboKuu5xBY8j2LJhLAMEiIZjtDTs/view?usp=sharing", "_blank")}>Tutorial: Como adicionar e editar uma plataforma</span>
                    </div>
                )
            case 1:
                return (
                    <div className="tutorial-button">
                        <span onClick={()=> window.open("https://drive.google.com/file/d/1IXpfZ8YSau1RpyPxmsayW6w8FIHE5A9f/view?usp=sharing", "_blank")}>Tutorial: Como adicionar e editar um Game</span>
                    </div>
                )
            case 2:
                return (
                    <div className="tutorial-button">
                        <span onClick={()=> window.open("https://drive.google.com/file/d/1IXgWEpzrOZ10N0kVEnbFDdYJ-DwA1bnj/view?usp=sharing", "_blank")}>Tutorial: Como configurar os estilos, titulos e imagens</span>
                    </div>
                )
            default:
                return null;
        }
    }

    return (
        <div>
            {editingPlataform ? editPlataform() : null}
            {editingGame ? editGame() : null}
            {addingNewPlataform ? addPlataform() : null}
            {addingNewGame ? addGame() : null}
            <div className="home-page-header">
                <h1>Painel Afiliados</h1>
            </div>
            <div className="home-page-main">
                <div className="aba-selector">
                    <div className="plataformlist" onClickCapture={() => setCurrentAba(0)} style={currentAba === 0 ? { border: "orange dashed 2px" } : {}}>Plataformas</div>
                    <div className="gamelist" onClickCapture={() => setCurrentAba(1)} style={currentAba === 1 ? { border: "orange dashed 2px" } : {}}>Games</div>
                    <div className="configuration" onClickCapture={() => setCurrentAba(2)} style={currentAba === 2 ? { border: "orange dashed 2px" } : {}}>Configurações</div>
                </div>
                {renderTutorialButton()}
                {getAbaByNumber()}
            </div>
            <div className="home-page-footer">
                <span>Todos os direitos reservados.</span>
            </div>
        </div>
    );
}