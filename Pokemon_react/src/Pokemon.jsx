import { useEffect } from "react";
import "./index.css";
export const Pokemon = ()=>{

    const API = "https://pokeapi.co/api/v2/pokemon?limit=124";

    useEffect(()=>{
        fetchPokemon();
    },[]);

    return (
        <>
        <h1>Hello Pokemon</h1>
        </>
    );
};