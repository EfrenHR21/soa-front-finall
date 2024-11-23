/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useContext, useEffect, useRef } from 'react';
import { Button, Card, Form } from 'react-bootstrap';



import validator from 'validator';
import Router, { useRouter } from 'next/router';
import { Context } from '../../context';

import { useToasts } from 'react-toast-notifications';
import { User } from '../../services/User.service';


interface IRegisterLoginProps {
    isRegisterForm?: boolean;
}

const initalForm = {
	email: '',
	password: '',
	confirmPassword: '',
	name: '',
};


const RegisterLogin: FC<IRegisterLoginProps> = ({ isRegisterForm = false}) => {
    const {addToast} = useToasts();
    const [authForm, setAuthForm] = React.useState(initalForm);
    const [otpForm, setOtpForm] = React.useState({ otp: '', email:''});
    const [otpTime, setOtpTime] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const router = useRouter ();

    const {
        state : {user},
        dispatch,
    } = useContext(Context);

    useEffect(() => {
        if(user && user.email) {
            router.push('/my-account');
        }
    }, [router, user]);

    const handleRegister = async (e: any) => {
        e.preventDefault();
        try {       
            setIsLoading(true);
            const {email,name,password, confirmPassword} = authForm;
            if(!name ||!password  ||!confirmPassword ||!email ){
                throw new Error('Por favor completa los campos');
            }
            if(password !== confirmPassword){
                throw new Error('Las contraseñas no coinciden');
            }    
            if(password.length < 6){
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            if(!validator.isEmail(email)){
                throw new Error('Ingresa un email valido');
            }

            const payload = {
                email, 
                name,
                password,
                type: 'customer',
            };

            const {success, message} = await User.createUsers(payload);
            if (success) {
                setAuthForm(initalForm);
                setOtpForm({otp: '', email: payload.email});
                setOtpTime(true);
                return addToast(message, {appearance: 'success'});
            }
            throw new Error (message || 'Algo salio mal');

        } catch (error : any) {
            if(error.response){
                return addToast( error.response.data.message, {
                    appearance: 'error', 
                    autoDismiss: true,
                });
            }
            return addToast( error.message, {
                appearance: 'error', 
                autoDismiss: true,
            });
        } finally{
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const {email, password } = authForm;
            if (!password || !email){
                throw new Error('Por favor completa los campos');
            }
            if(!validator.isEmail(email)){
                throw new Error('Por favor ingresa o email valido');
            }

            const payload = {
                email,
                password,
            };

            const {success, message, result} = await User.loginUser(payload);
            if(success) {
                setAuthForm(initalForm);
                localStorage.setItem('user', JSON.stringify( result?.user));
                dispatch({
                    type: 'LOGIN',
                    payload: result?.user,
                });
                router.push('/my-account');
                return addToast(message, { appearance: 'success'});
            }
            throw new Error (message || 'Algo salio mal');

        } catch (error : any) {
            if (error.response){
                return addToast (error.response.data.message, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
            return addToast (error.message, {
                appearance: 'error',
                autoDismiss: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async (e: any) => {
        
        try {
			const { email } = otpForm;
			if (!email) {
				throw new Error('Ingrese su email');
			}
            if (!validator.isEmail(email)) {
				throw new Error('Ingrese su email');
			}
			const { success, message } = await User.resendOtp(email);
			if (success){
                setOtpTime(true);
                return addToast(message, { appearance: 'success'});
            } 
			throw new Error (message || 'Algo salio mal');

		} catch (error: any) {
			if (error.response) {
				return addToast(error.response.data.message, {
					appearance: 'error',
					autoDismiss: true,
				});
			}
            return addToast(error.message, {
                appearance: 'error', 
                autoDismiss: true 
            });
		} 
    };

    const verifyOtp = async (e : any) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            
            const {otp, email } = otpForm;
            if (!otp || !email ){
                throw new Error ('Ingresa tu email y OTP')
            }
            const data = await User.verifyOtp(otp, email);
            if(data?.success){
                setOtpTime(false);
                setOtpForm({ otp: '', email: ''});
                return addToast(data?.message, {appearance: 'success'});
            }
            throw new Error (data?.message || 'Algo salio mal');
        } catch (error : any) {
            if (error.response){
                return addToast (error.response.data.message, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
            return addToast (error.message, {
                appearance: 'error',
                autoDismiss: true,
            });
        }finally {
            setIsLoading(false);
        }
    }
    
    return (
    <Card>
        <Card.Header>{isRegisterForm ? 'Register' : 'Login' }</Card.Header>
        <Card.Body>
            {isRegisterForm && (
            <Form.Group className='mb-3'>
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control 
                type='text'
                placeholder='Ingresa tu nombre completo' 
                value={authForm.name} 
                onChange={(e) =>
                    setAuthForm({ ...authForm, name: e.target.value})
                }
                />
            </Form.Group>
            )}
            <Form.Group className='mb-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email'
                    placeholder='Ingresa tu direccion' 
                    value={authForm.email || otpForm.email} 
                    onChange={(e) =>
                        setAuthForm({ ...authForm, email: e.target.value})
                    }
                    />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type='password'
                    placeholder='Ingresa tu contraseña' 
                    value={authForm.password} 
                    onChange={(e) =>
                        setAuthForm({ ...authForm, password: e.target.value})
                    }
                    />
            </Form.Group>
            { isRegisterForm && (
             <Form.Group className='mb-3'>
                <Form.Label>Confirma Contraseña</Form.Label>
                <Form.Control type='password'
                    placeholder='Confirma tu contraseña' 
                    value={authForm.confirmPassword} 
                    onChange={(e) =>
                        setAuthForm({ ...authForm, confirmPassword: e.target.value})
                    }
                    />
             </Form.Group>   
            )}
            {otpTime && (
                <Form.Group className='mb-3'>
                    <Form.Label>OTP</Form.Label>
                    <Form.Control 
                    type='text' 
                    placeholder='Ingrese OTP'
                    value={otpForm.otp}
                    onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value})} 
                    />
                    <Button 
                    variant='link' 
                    className='resendOtpBtn' 
                    onClick={(e) => resendOtp(e)}
                    >
                        Reenviar OTP
                    </Button>
                </Form.Group>
            )}
            {otpTime ? (
                <Button className='btnAuth' variant='info' onClick={(e) => verifyOtp(e)} >
                Verificar
            </Button>
            ) : (
                <Button 
                className='btnAuth' 
                variant='info' 
                onClick={(e) => (isRegisterForm ? handleRegister(e) : handleLogin(e))                    
                }
                >
                {isRegisterForm ? 'Register' : 'Login'}
            </Button>
            )}
            {!isRegisterForm && (
                <a style={{textDecoration: 'none'}} href='/forgot-password'>
                    Olvidaste tu contraseña
                </a>
            )}
        </Card.Body>
    </Card>
    );
};   

export default RegisterLogin;