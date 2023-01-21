/** @jsxImportSource @emotion/react */
import { useState, useContext, use } from 'react'
import { css } from '@emotion/react'
import Router, { useRouter } from 'next/router'
import Layout from '../components/layout/Layout'
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario'

import { firebaseContext } from '../firebase'

import Error404 from '../components/layout/404'

// validaciones
import useValidacion from '../hooks/useValidacion'
import validarCrearProducto from '../validacion/validarCrearProducto'

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  // imagen: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {

  // States para la subida de la imagen
  const [uploading, setUploading] = useState(false);
  const [urlimagen, guardarUrlImagen] = useState('');
  
  const [error, guardarError] = useState(false)

  const { valores, errores, handleSubmit, handlechange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto)

  const { nombre, empresa, imagen, url, descripcion } = valores

  // context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(firebaseContext) 

  // hook de routing para redireccionar 
  const router = useRouter();

  async function crearProducto() {
    // si el usuario no está autenticado llevar al login
    if (!usuario) {
      return router.push('/login')
    }

    // crear el objeto del nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    }

    // insertarlo en la base de datos
    firebase.db.collection('productos').add(producto);

    return router.push('/')
  }

  const handleImageUpload = async e => {
    // Se obtiene referencia de la ubicación donde se guardará la imagen
    const file = e.target.files[0];
    const imageRef = firebase.storage.ref().child(`productos/${getRandomImgName()}`);
    await imageRef.put(file)
    const url = await imageRef.getDownloadURL()
    guardarUrlImagen(url)
  }

  function getRandomImgName() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  return (
    <div>
      <Layout>
        {!usuario ? <Error404/> : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >Nuevo producto</h1>
            <Formulario 
              onSubmit={handleSubmit}
              noValidate
            >

              <fieldset>
                <legend>Información general</legend>

                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text" 
                    id='nombre' 
                    placeholder='Nombre del producto'
                    name='nombre'
                    value={nombre}
                    onChange={handlechange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.nombre && <Error>{errores.nombre}</Error> }

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input 
                    type="text" 
                    id='empresa' 
                    placeholder='Nombre empresa o compañia'
                    name='empresa'
                    value={empresa}
                    onChange={handlechange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.empresa && <Error>{errores.empresa}</Error> }

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <input 
                    accept="image/*"
                    type="file" 
                    id='imagen' 
                    name='imagen'
                    value={imagen}
                    // onChange={handlechange}
                    onBlur={handleBlur}
                    onChange={handleImageUpload}
                  />
                </Campo>

                {errores.imagen && <Error>{errores.imagen}</Error> }
                
                <Campo>
                  <label htmlFor="url">URL</label>
                  <input 
                    type="text" 
                    id='url' 
                    name='url'
                    placeholder='URL de tu producto'
                    value={url}
                    onChange={handlechange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.url && <Error>{errores.url}</Error> }
              </fieldset>

              <fieldset>
                <legend>Sobre tu producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea 
                    id='descripcion' 
                    name='descripcion'
                    value={descripcion}
                    onChange={handlechange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.descripcion && <Error>{errores.descripcion}</Error> }
              </fieldset>

              {error && <Error>{error}</Error> }

              <InputSubmit type="submit" value="Crear producto" />
            </Formulario>
          </>
        )}
      </Layout>
    </div>
  )
}

export default NuevoProducto
