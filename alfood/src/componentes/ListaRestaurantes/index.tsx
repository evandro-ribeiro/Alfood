import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';

interface IParametrosBusca {
  ordering?: string,
  search?: string
}

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');

  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(res => {
        setRestaurantes(res.data.results);
        setProximaPagina(res.data.next);
        setPaginaAnterior(res.data.previous);
      })
      .catch(erro => {
        console.log(erro);
      })
  }

  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const opcoes = {
      params: {} as IParametrosBusca
    }
    if(busca) {
      opcoes.params.search = busca;
    }
    if(ordenacao) {
      opcoes.params.ordering = ordenacao;
    }
    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes);
  }

  useEffect(() => {
    // obter restaurantes
    carregarDados('http://localhost:8000/api/v1/restaurantes/');
  }, []);

  /* SEGUNDA OPÇÃO DE CÓDIGO
    const verMais = () => {
      axios.get<IPaginacao<IRestaurante>>(proximaPagina)
        .then(res => {
          setRestaurantes([...restaurantes, ...res.data.results]);
          setProximaPagina(res.data.next);
          setPaginaAnterior(res.data.previous);
        })
        .catch(erro => {
          console.log(erro);
        })
    }
  */

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <form onSubmit={buscar}>
      <input type="text" value={busca} onChange={evento => setBusca(evento.target.value)} />
      <div>
        <label htmlFor="select-ordenacao">Ordenação</label>
        <select 
          name="select-ordenacao" 
          id="select-ordenacao"
          value={ordenacao}
          onChange={evento => setOrdenacao(evento.target.value)}
        >
          <option value="">Padrão</option>
          <option value="id">Por ID</option>
          <option value="nome">Por Nome</option>
        </select>
      </div>
      <button type='submit'>Buscar</button>
    </form>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {/* {proximaPagina && <button onClick={verMais}>
      Ver mais
    </button>} */}
    {<button onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>Página Anterior</button>}
    {<button onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>Próxima Página</button>}
  </section>)
}

export default ListaRestaurantes;