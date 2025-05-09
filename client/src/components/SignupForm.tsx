import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

// import { createUser } from '../utils/API';
// import Auth from '../utils/auth';
// import type { User } from '../models/User';
import { ADD_USER } from '../utils/mutations';
import { useMutation } from '@apollo/client';

const SignupForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  // Set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  // Set state for form validation
  const [validated, setValidated] = useState(false);
  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // Define the addUser mutation
  const [addUser, { error:addUserError }] = useMutation(ADD_USER);
  if (addUserError) {
    console.log(JSON.stringify(addUserError, null, 2));
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

 const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const form = event.currentTarget;
  if (form.checkValidity() === false) {
    event.stopPropagation();
    setValidated(true);
    return;
  }

  setValidated(true);

  try {
    
    const response = await addUser({ variables: userFormData });
    // if (!response.ok) {
    //   throw new Error('Failed to create user');
    // }
console.log('User created successfully:', response);
    // const { token } = await response.json();
    // Auth.login(token);
    handleModalClose();
    setShowAlert(false);
  } catch (err) {
    console.error('Signup error:', err);
    setShowAlert(true);
  }

  setUserFormData({ username: '', email: '', password: '' });
};


  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert || !!addUserError} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>

        <Button disabled={!(userFormData.username && userFormData.email && userFormData.password)} type='submit' variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;