import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IRestaurante from "../../../interfaces/IRestaurante";


const FormularioRestaurante = () => {

    const parametros = useParams();

    const [nomeRestaurante, setNomeRestaurante] = useState('');

    useEffect(() => {
        if (parametros) {
            http.get<IRestaurante>(`restaurantes/${parametros.id}/`)
                .then(res => setNomeRestaurante(res.data.nome))
        }
    }, [parametros]);


    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();

        if (parametros.id) {
            http.put(`restaurantes/${parametros.id}/`, {
                nome: nomeRestaurante
            })
                .then(() => { alert('Restaurante atualizado com sucesso!') })
        } else {
            http.post('restaurantes/', {
                nome: nomeRestaurante
            })
                .then(() => { alert('Restaurante cadastrado com sucesso!') })
        }

    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formulário de Restaurantes</Typography>
            <Box component={"form"} sx={{ width: '50%' }} onSubmit={aoSubmeterForm}>
                <TextField
                    value={nomeRestaurante}
                    onChange={evento => setNomeRestaurante(evento.target.value)}
                    label="Nome do Restaurante"
                    variant="standard"
                    fullWidth
                    required
                />
                <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">Salvar</Button>
            </Box>
        </Box>
    );
}

export default FormularioRestaurante;