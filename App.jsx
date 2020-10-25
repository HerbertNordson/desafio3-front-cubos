import React from "react";
import "./App.css";

function fazerRequisicaoComBody(url, metodo, conteudo, token) {
  return fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      Authorization: token && `Bearer ${token}`,
    },
    body: JSON.stringify(conteudo),
  });
}

function pegarClassificacao() {
  return fetch(
    `https://desafio-3-back-cubos-academy.herokuapp.com/classificacao`
  )
    .then((res) => res.json())
    .then((jogos) => {
      return jogos.dados.map((time, i) => {
        time.posicao = i + 1;
        time.saldoDeGols = time.golsFeitos - time.golsSofridos;
        return time;
      });
    });
}

function pegarRodada(novaRodada) {
  return fetch(
    `https://desafio-3-back-cubos-academy.herokuapp.com/jogos/${novaRodada}`
  )
    .then((res) => res.json())
    .then((dados) => {
      return dados.dados;
    });
}

function App() {
  const [resultados, setResultados] = React.useState([]);
  const [rodadaAtual, setRodada] = React.useState(1);
  const [classificacao, setClassificacao] = React.useState([]);
  const [ordem, setOrdem] = React.useState("crescente");
  const [coluna, setColuna] = React.useState("posicao");
  const [email, setEmail] = React.useState();
  const [senha, setSenha] = React.useState();
  const [token, setToken] = React.useState();
  const [golsCasa, setGolsCasa] = React.useState();
  const [golsVisitante, setGolsVisitante] = React.useState();
  const [id, setId] = React.useState();

  const classificacaoCrescente =
    classificacao &&
    [...classificacao].sort((a, b) => {
      const colunaA = a[coluna];
      const colunaB = b[coluna];
      if (typeof colunaA === "number" && typeof colunaB === "number") {
        return parseInt(colunaA, 10) - parseInt(colunaB, 10);
      } else {
        return colunaA.localeCompare(colunaB);
      }
    });

  const classificacaoOrdenada =
    ordem === "crescente"
      ? classificacaoCrescente
      : classificacaoCrescente.reverse();

  const ordenacao = (valor) => {
    if (coluna !== valor) {
      setColuna(valor);
      setOrdem("crescente");
    } else {
      setOrdem(ordem === "crescente" ? "decrescente" : "crescente");
    }
  };

  React.useEffect(() => {
    pegarRodada(rodadaAtual).then((rodada) => {
      setResultados(rodada);
    });
  }, [rodadaAtual]);

  React.useEffect(() => {
    pegarClassificacao().then((classificacao) => {
      setClassificacao(classificacao);
    });
  }, []);

  return (
    <div className="App">
      <div className="cabecalho">
        <div className="conteudo">
          <div className="Linhas">
            <div className="L1"></div>
            <div className="L2"></div>
            <div className="titulo">Brasileirão</div>
          </div>
          <div>
            {!token && (
              <form>
                Email{" "}
                <input
                  name="e-mail"
                  type="email"
                  value={email}
                  onChange={(element) => setEmail(element.target.value)}
                />
              </form>
            )}

            {!token && (
              <form>
                Senha{" "}
                <input
                  name="senha"
                  type="password"
                  value={senha}
                  onChange={(element) => setSenha(element.target.value)}
                />
              </form>
            )}
            <button
              onClick={() => {
                if (!token) {
                  fetch(
                    "https://desafio-3-back-cubos-academy.herokuapp.com/auth",
                    {
                      method: "POST",
                      headers: {
                        "content-type": "application/json",
                      },
                      body: JSON.stringify({
                        email: email,
                        password: senha,
                      }),
                    }
                  )
                    .then((response) => {
                      return response.json();
                    })
                    .then((response) => {
                      if (response.dados.token) {
                        setToken(response.dados.token);
                      } else {
                        alert(response.dados.mensagem);
                      }
                    });
                } else {
                  setToken(undefined);
                }
              }}
            >
              {!token ? "Logar" : "Deslogar"}
            </button>
          </div>
        </div>
      </div>

      <div className="principal">
        <div className="centro">
          <div className="jogos">
            <div className="rodadas">
              <button
                className="anterior"
                onClick={() => {
                  if (rodadaAtual > 1 && rodadaAtual <= 38) {
                    setRodada(rodadaAtual - 1);
                  } else {
                    setRodada(rodadaAtual);
                  }
                }}
              >
                <img
                  src="https://systemuicons.com/images/icons/arrow_left.svg"
                  alt="Retornar"
                />
              </button>

              <h2> {rodadaAtual}º Rodada</h2>

              <button
                className="proximo"
                onClick={() => {
                  if (rodadaAtual >= 1 && rodadaAtual < 38) {
                    setRodada(rodadaAtual + 1);
                  } else {
                    setRodada(rodadaAtual);
                  }
                }}
              >
                <img
                  src="https://systemuicons.com/images/icons/arrow_right.svg"
                  alt="Avançar"
                />
              </button>
            </div>

            <div className="resultados">
              <table>
                <thead>
                  {resultados.map((valor) => (
                    <tr>
                      <th className="mandante">{valor.time_casa}</th>
                      <th>
                        {id === valor.id ? (
                          <input
                            className="gols"
                            name="golsMandante"
                            type="text"
                            value={golsCasa}
                            onChange={(element) =>
                              setGolsCasa(element.target.value)
                            }
                          />
                        ) : (
                          valor.gols_casa
                        )}
                      </th>

                      <th className="x">x</th>
                      <th>
                        {id === valor.id ? (
                          <input
                            className="gols"
                            name="golsVisitante"
                            type="text"
                            value={golsVisitante}
                            onChange={(element) =>
                              setGolsVisitante(element.target.value)
                            }
                          />
                        ) : (
                          valor.gols_visitante
                        )}
                      </th>

                      <th className="visitante">{valor.time_visitante}</th>
                      {token && (
                        <th>
                          <button
                            className="editar"
                            onClick={() => {
                              if (id === valor.id) {
                                setId(null);
                                fazerRequisicaoComBody(
                                  "https://desafio-3-back-cubos-academy.herokuapp.com/jogos",
                                  "POST",
                                  {
                                    id: id,
                                    golsCasa: golsCasa,
                                    golsVisitante: golsVisitante,
                                  },
                                  token
                                )
                                  .then(() => {
                                    pegarClassificacao().then(
                                      (classificacao) => {
                                        setClassificacao(classificacao);
                                      }
                                    );
                                  })
                                  .then(() => {
                                    pegarRodada(rodadaAtual).then((rodada) => {
                                      setResultados(rodada);
                                    });
                                  });
                              } else {
                                setId(valor.id);
                                setGolsCasa(valor.gols_casa);
                                setGolsVisitante(valor.gols_visitante);
                              }
                            }}
                          >
                            <img
                              src={
                                id === null
                                  ? "https://systemuicons.com/images/icons/pen.svg"
                                  : "https://systemuicons.com/images/icons/check.svg"
                              }
                              alt="caneta"
                            />
                          </button>
                        </th>
                      )}
                    </tr>
                  ))}
                </thead>
              </table>
            </div>
          </div>

          <div className="classificacao">
            <div className="tabela">
              <table>
                <thead className="topo">
                  <tr>
                    <th>
                      Posição
                      <button
                        className="ordemBotao"
                        onClick={() => {
                          ordenacao("posicao");
                        }}
                      >
                        {coluna !== "posicao" ? (
                          <img
                            src="https://systemuicons.com/images/icons/sort.svg"
                            alt=""
                          />
                        ) : ordem === "crescente" ? (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_down.svg "
                            alt=""
                          />
                        ) : (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_up.svg "
                            alt=""
                          />
                        )}
                      </button>
                    </th>

                    <th>
                      Time
                      <button
                        className="ordemBotao"
                        onClick={() => {
                          ordenacao("nome");
                        }}
                      >
                        {coluna !== "nome" ? (
                          <img
                            src="https://systemuicons.com/images/icons/sort.svg"
                            alt=""
                          />
                        ) : ordem === "crescente" ? (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_down.svg "
                            alt=""
                          />
                        ) : (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_up.svg "
                            alt=""
                          />
                        )}
                      </button>
                    </th>

                    <th>
                      Pontos
                      <button
                        className="ordemBotao"
                        onClick={() => {
                          ordenacao("pontos");
                        }}
                      >
                        {coluna !== "pontos" ? (
                          <img
                            src="https://systemuicons.com/images/icons/sort.svg"
                            alt=""
                          />
                        ) : ordem === "crescente" ? (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_down.svg "
                            alt=""
                          />
                        ) : (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_up.svg "
                            alt=""
                          />
                        )}
                      </button>
                    </th>

                    <th>
                      E
                      <button
                        className="ordemBotao"
                        onClick={() => {
                          ordenacao("empates");
                        }}
                      >
                        {coluna !== "empates" ? (
                          <img
                            src="https://systemuicons.com/images/icons/sort.svg"
                            alt=""
                          />
                        ) : ordem === "crescente" ? (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_down.svg "
                            alt=""
                          />
                        ) : (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_up.svg "
                            alt=""
                          />
                        )}
                      </button>
                    </th>

                    <th>
                      V
                      <button
                        className="ordemBotao"
                        onClick={() => {
                          ordenacao("vitorias");
                        }}
                      >
                        {coluna !== "vitorias" ? (
                          <img
                            src="https://systemuicons.com/images/icons/sort.svg"
                            alt=""
                          />
                        ) : ordem === "crescente" ? (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_down.svg "
                            alt=""
                          />
                        ) : (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_up.svg "
                            alt=""
                          />
                        )}
                      </button>
                    </th>

                    <th>
                      D
                      <button
                        className="ordemBotao"
                        onClick={() => {
                          ordenacao("derrotas");
                        }}
                      >
                        {coluna !== "derrotas" ? (
                          <img
                            src="https://systemuicons.com/images/icons/sort.svg"
                            alt=""
                          />
                        ) : ordem === "crescente" ? (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_down.svg "
                            alt=""
                          />
                        ) : (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_up.svg "
                            alt=""
                          />
                        )}
                      </button>
                    </th>

                    <th>
                      GF
                      <button
                        className="ordemBotao"
                        onClick={() => {
                          ordenacao("golsFeitos");
                        }}
                      >
                        {coluna !== "golsFeitos" ? (
                          <img
                            src="https://systemuicons.com/images/icons/sort.svg"
                            alt=""
                          />
                        ) : ordem === "crescente" ? (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_down.svg "
                            alt=""
                          />
                        ) : (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_up.svg "
                            alt=""
                          />
                        )}
                      </button>
                    </th>

                    <th>
                      GS
                      <button
                        className="ordemBotao"
                        onClick={() => {
                          ordenacao("golsSofridos");
                        }}
                      >
                        {coluna !== "golsSofridos" ? (
                          <img
                            src="https://systemuicons.com/images/icons/sort.svg"
                            alt=""
                          />
                        ) : ordem === "crescente" ? (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_down.svg "
                            alt=""
                          />
                        ) : (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_up.svg "
                            alt=""
                          />
                        )}
                      </button>
                    </th>

                    <th>
                      SG
                      <button
                        className="ordemBotao"
                        onClick={() => {
                          ordenacao("saldoDeGols");
                        }}
                      >
                        {coluna !== "saldoDeGols" ? (
                          <img
                            src="https://systemuicons.com/images/icons/sort.svg"
                            alt=""
                          />
                        ) : ordem === "crescente" ? (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_down.svg "
                            alt=""
                          />
                        ) : (
                          <img
                            src="https://systemuicons.com/images/icons/arrow_up.svg "
                            alt=""
                          />
                        )}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="dados">
                  {classificacaoOrdenada.map((posicao, i) => (
                    <tr className="completo">
                      <td>{posicao.posicao}</td>
                      <td>{posicao.nome}</td>
                      <td>{posicao.pontos}</td>
                      <td>{posicao.empates}</td>
                      <td>{posicao.vitorias}</td>
                      <td>{posicao.derrotas}</td>
                      <td>{posicao.golsFeitos}</td>
                      <td>{posicao.golsSofridos}</td>
                      <td>{posicao.golsFeitos - posicao.golsSofridos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
