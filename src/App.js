// import logo from './logo.svg';
import './App.css'
// import { styled } from '@mui/material/styles';
import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import axios from 'axios';


const App = () => {
  const [show, setShow] = useState(true)
  const [saveButton, setSaveButton] = useState(true)
  const [showAlert, setAlert] = useState(false)
  const [showAlertError, setAlertError] = useState(false) 
  const [showAlertNombre_vehiculo, setAlertNombre_vehiculo] = useState(false)
  const [showAlertAño_fabricacion, setAlertAño_fabricacion] = useState(false)
  const [showAlertCantidad, setAlertCantidad] = useState(false)
  const [showAlertPrecio, setAlertPrecio] = useState(false)
  const [data, setData] = useState([])
  const [idautos, setIdAutos] = useState(0)
  const [nombre_vehiculo, setNombre_vehiculo] = useState("")
  const [año_fabricacion, setAño_fabricacion] = useState(0)
  const [cantidad, setCantidad] = useState(0)
  const [precio, setPrecio] = useState(0)
 
 
  
  const onNombre_vehiculoChange = event => setNombre_vehiculo(event.target.value)
  const onAño_fabricacionChange = event => setAño_fabricacion(event.target.value)
  const onPrecioChange = event => setPrecio(event.target.value)
  const onCantidadChange = event => setCantidad(event.target.value)
  
  
  const getData = async () => {
    try {
      const {data: response} = await axios.get('http://localhost:8080/autos')
      setData(response)
    } catch (error) {
      console.log(error.message)
    }
  }
  
  useEffect(() => {
    getData()
    validateErrrorName()
  }, [])

  const  validateErrrorName = () => {
    if(nombre_vehiculo.length > 0) {
      setAlertNombre_vehiculo(false)
    }
  }

  const showForm = () =>{
    if (show){
      setShow(false)
      setSaveButton(true)
    }
  }

  const cancel = () =>{
    if (!show){
      setNombre_vehiculo("")
      setAño_fabricacion(0)
      setCantidad(0)
      setShow(true)
      setAlertError(false)
    }
  }

  const showTable = () =>{
    if (nombre_vehiculo === ""){
      setAlertError(true)
      setAlertNombre_vehiculo(true)
    } 
    if ( año_fabricacion === 0){
      setAlertError(true)
      setAlertAño_fabricacion(true)

      if ( precio === 0){
        setAlertError(true)
        setAlertAño_fabricacion(true)
      } 
    } 
    if (cantidad === 0){
      setAlertError(true)
      setAlertCantidad(true)
    }
    else  {
      axios.post('http://localhost:8080/agregar-auto', {
        nombre_vehiculo: nombre_vehiculo,
        año_fabricacion:  año_fabricacion,
        precio: precio,
        cantidad: cantidad,

      }).then((response) => {
        setNombre_vehiculo("")
        setAño_fabricacion(0)
        setPrecio(0)
        setCantidad(0)
        setShow(true)
        setAlert(true)
        setAlertError(false)
        setAlertNombre_vehiculo(false)
        setAlertAño_fabricacion(false)
        setAlertPrecio(false)
        setAlertCantidad(false)
        getData()
       console.log(response)
      })
      .catch((error) => {
       console.log(error)
      })
    }
 }

 const showData = ((object) => {
    setSaveButton(false)
    setIdAutos(object.idautos)
    setNombre_vehiculo(object.nombre_vehiculo)
    setAño_fabricacion(object. año_fabricacion)
    setPrecio(object.precio)
    setCantidad(object.cantidad)
    setShow(false)
 })

 const update = () => {
  if (nombre_vehiculo === ""){
    setAlertError(true)
    setAlertNombre_vehiculo(true)
    return
  } 
  if ( año_fabricacion < 1){
    setAlertError(true)
    setAlertAño_fabricacion(true)
    return
  } 

  if (precio < 1){
    setAlertError(true)
    setAlertPrecio(true)
    return
  }
  if (cantidad < 1){
    setAlertError(true)
    setAlertCantidad(true)
    return
  }
  else  {
      axios.put(`http://localhost:8080/actualizar-auto/${idautos}`, {
        nombre_vehiculo: nombre_vehiculo,
        año_fabricacion:  año_fabricacion,
        precio: precio,
        cantidad: cantidad,
      }).then(() => {
        setNombre_vehiculo("")
        setAño_fabricacion(0)
        setPrecio(0)
        setCantidad(0)
        setShow(true)
        setAlert(true)
        setAlertError(false)
        setAlertNombre_vehiculo(false)
        setAlertAño_fabricacion(false)
        setAlertPrecio(false)
        setAlertCantidad(false)
        getData()
      })
    }
  }

  return (
    <Box sx={{ width: 1000,
      height: 1000,
      p: 2,
      ml:12,
      flexGrow: 3, 
      backgroundColor: '#D4D4D4'}}>
      {show &&
        <Grid container spacing={2}>
          { showAlert &&
            <Grid item xs={10} sx={{mb:2,}}>
              <Alert value={showAlert}  severity="success">
                  Producto creado correctamente 
                </Alert>
            </Grid>
          }
          <Grid item xs={8}>
            <Button onClick={() => {showForm()}} variant="contained" color="success">Agregar Autos</Button>
          </Grid>
          <Grid item xs={12}>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500, pl: 2, }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Idautos</TableCell>
                    <TableCell align="left">nombre_vehiculo</TableCell>
                    <TableCell align="left">año_fabricacion</TableCell>
                    <TableCell align="left">precio</TableCell>
                    <TableCell align="left">cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow 
                      key={row.name}
                      onClick={() => {showData(row)}}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.idautos}
                      </TableCell>
                      <TableCell  align="left">{row.nombre_vehiculo}</TableCell>
                      <TableCell align="left">{row.año_fabricacion}</TableCell>
                      <TableCell align="left">{row.precio}</TableCell>
                      <TableCell align="left">{row.cantidad}</TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Grid>
        </Grid>
      }
      {!show && 
          <Box
            component="form"
            noValidate
            autoComplete="off"
            justifyContent="center"
          >
            <Grid sx={{mt:12,}} container justifyContent="center">
              {
                showAlertError && 
                <Grid item xs={10} sx={{mb:2,}}>
                  <Alert value={showAlertError}  severity="error">
                    Debes de llenar los campos que esten vacios. 
                    </Alert>
                </Grid>
              }
              <Grid item xs={3} >
                <TextField id="outlined-basic" 
                  label="nombre_vehiculo" 
                  variant="outlined" 
                  error={showAlertNombre_vehiculo} 
                  onChange={onNombre_vehiculoChange}  
                  value={nombre_vehiculo} />
              </Grid>

              <Grid item xs={3}>
                <TextField 
                  id="outlined-basic" 
                  label="año_fabricacion" 
                  variant="outlined" 
                  error={showAlertAño_fabricacion}
                  onChange={onAño_fabricacionChange}  
                  value={año_fabricacion}
                  />
              </Grid>

              <Grid item xs={3}>
                <TextField 
                  id="outlined-basic" 
                  label="Precio" 
                  variant="outlined" 
                  error={showAlertAño_fabricacion}
                  onChange={onPrecioChange}  
                  value={precio}
                  />
              </Grid>

              <Grid item xs={3}>
                <TextField 
                  id="outlined-basic" 
                  label="Cantidad" 
                  variant="outlined"
                  error={showAlertCantidad}
                  onChange={onCantidadChange}  
                  value={cantidad}
                />
              </Grid>

            </Grid>
            <Grid sx={{mt:6,}} container justifyContent="center" >
              <Grid item  sx={{mr:2,}} >
                <Button onClick={() => {cancel()}} variant="contained" color="error">Cancelar</Button>
              </Grid>
              {
                saveButton &&
                  <Grid item  >
                    <Button onClick={() => {showTable()}} variant="contained" color="success">Guardar</Button>
                  </Grid>
              }
              {
                !saveButton &&
                <Grid item  >
                  <Button onClick={() => {update()}} variant="contained" color="success">Actualizar</Button>
                </Grid>
              }
            </Grid>
          </Box>
      }
    </Box>
  )
}

export default App;