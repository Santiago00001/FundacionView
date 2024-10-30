import axios from 'axios';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); // Estado para el correo
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  const handleSignIn = useCallback(async () => {
    setLoading(true); // Iniciar el estado de carga

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}api/auth/login`, {
        email, // Cambia esto a 'email' si tu backend usa 'email'
        password,
      });

      // Almacena el token y el ID del usuario en localStorage
      localStorage.setItem('token', response.data.token);
      const {userId} = response.data; // Asegúrate de que tu backend envíe el ID del usuario
      localStorage.setItem('currentUserId', userId);

      // Obtener información del usuario
      const userResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${response.data.token}`, // Incluye el token en la cabecera
        },
      });

      // Almacena la información del usuario en localStorage
      localStorage.setItem('currentUser', JSON.stringify(userResponse.data)); // Asumiendo que la respuesta es un objeto

      router.push('/'); // Redirige al usuario después de iniciar sesión
    } catch (error) {
      console.error('Error de autenticación:', error);
      alert('Credenciales inválidas.'); // Mostrar un mensaje de error al usuario
    } finally {
      setLoading(false); // Finalizar el estado de carga
    }
  }, [email, password, router]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Correo"
        value={email} // Usar estado para el valor
        onChange={(e) => setEmail(e.target.value)} // Actualizar estado en el cambio
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        ¿Olvidaste tu contraseña?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Contraseña"
        value={password} // Usar estado para el valor
        onChange={(e) => setPassword(e.target.value)} // Actualizar estado en el cambio
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="button" // Cambiar a "button" para evitar el comportamiento de envío
        color="inherit"
        variant="contained"
        loading={loading} // Mostrar carga cuando esté en estado de carga
        onClick={handleSignIn}
      >
        Iniciar Sesion
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Iniciar Sesion</Typography>
      </Box>

      {renderForm}
    </>
  );
}