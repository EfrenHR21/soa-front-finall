/* eslint-disable @typescript-eslint/no-explicit-any */
import { responsePayload } from "@/services/api";
import { User } from "../../services/User.service";
import React, { FC, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

interface IAccountDetailsProps {
    user: Record<string, any>;
    dispatch: any;
    addToast: any;
}

const AccountDetails: FC<IAccountDetailsProps> = ({
    user,
    dispatch,
    addToast,
}) => {
const [accountForm, setAccountForm] = useState({
    name: user.name,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});

      const [isLoading, setIsLoading] = useState(false);

    const updateHandler = async (e:any) => {
        e.preventDefault();
        try {
          setIsLoading(true);
          const { name, oldPassword, newPassword, confirmPassword } = accountForm;
          if (!name || !oldPassword || !newPassword || !confirmPassword) {
            throw new Error('Completa todos los campos');
          }
          if (newPassword !== confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
          }
          if (newPassword.length < 6) {
            throw new Error('Contraseña muy corta. Minimos 6 caracteres');
          }
          const payload = {
            name,
            oldPassword,
            newPassword,
          };
          const { success, message, result }: responsePayload = 
            await User.updateUser(user.id, payload);
            if (!success){ 
              throw new Error(message);
            }  
    
            dispatch({
              type: 'UPDATE_USER',
              payload: result,
            });
    
            addToast(message, { 
              appearance: 'success', 
              autoDismiss: true, 
            });
    
          setAccountForm({
            name: result.name,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
    
        } catch (error: any) {
            if (error.response) {
              return addToast(error.response.data.message, {
                appearance: 'error',
                autoDismiss: true,
            });
          }
          addToast(error.message, { appearance: 'error', autoDismiss: true });
        } 
        finally {
          setIsLoading(false);
        }
      };

    return (
        <Card className='mt-3'>
          <Card.Header>Detalles de Cuenta</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group controlId='formBasicEmail' className='mb-3'>
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ingresa tu nombre completo'
                  value={accountForm.name}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, name: e.target.value })
                  }
                />
                </Form.Group>
                <Form.Group controlId='formBasicEmail' className='mb-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type='text'
                    disabled
                    value={user.email}
                />
              </Form.Group>
              <Form.Group controlId='formBasicPassword' className='mb-3'>
                <Form.Label>Antigua Contraseña</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Antigua Contraseña'
                  value={accountForm.oldPassword}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, oldPassword: e.target.value})
                  }
                />
              </Form.Group>
              <Form.Group controlId='formBasicPassword' className='mb-3'>
                <Form.Label>Nueva Contraseña</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='New password'
                  value={accountForm.newPassword}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, newPassword: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId='formBasicPassword' className='mb-3'>
                <Form.Label>Confirma contraseña</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Confirma password'
                  value={accountForm.confirmPassword}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, confirmPassword: e.target.value })
                  }
                />
              </Form.Group>
    
              <Button 
                variant='info' 
                className='btnAuth' 
                disabled={isLoading} 
                onClick={(e) => updateHandler(e)}
              >
                {isLoading && (
                  <span
                    className='spinner-border spinner-border-sm'
                    role='status'
                    aria-hidden='true'
                  ></span>
                )}
                Actualizar informacion
              </Button> 
              
            </Form>
          </Card.Body>
        </Card>
      );
    };

export default AccountDetails;