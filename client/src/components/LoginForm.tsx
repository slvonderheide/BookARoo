import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations'; // ✅ Fix: Import LOGIN_USER mutation

const LoginForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Define the loginUser mutation
  const [loginUser, { error }] = useMutation<{ login: { token: string } }, { email: string; password: string }>(LOGIN_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    try {
      const { data } = await loginUser({
        variables: { ...userFormData },
      });

      if (data?.login?.token) {
        Auth.login(data.login.token);
        handleModalClose(); // ✅ Ensure modal closes after successful login
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({ email: '', password: '' });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert || !!error} variant="danger">
          {error ? error.message : "Something went wrong with your login credentials!"}
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
        </Form.Group>

        <Button disabled={!(userFormData.email && userFormData.password)} type="submit" variant="success">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
