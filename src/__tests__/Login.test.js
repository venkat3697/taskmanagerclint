// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from '../pages/Login'; // Adjust this import to your file structure

jest.mock('axios');

describe('Login Component', () => {
  test('successful login redirects to dashboard', async () => {
    // Mocking successful response from the API
    axios.post.mockResolvedValueOnce({ data: { token: 'fake-token' } });

    render(<Login />);
    
    // Enter valid credentials
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    // Click login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Expect to be redirected to the dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });

  test('displays error message on incorrect credentials', async () => {
    // Mocking error response from the API
    axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<Login />);
    
    // Enter invalid credentials
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    
    // Click login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Expect error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('shows error message for empty email and password', async () => {
    render(<Login />);
    
    // Leave fields empty
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Expect error messages for empty fields
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test('disables login button when fields are empty', () => {
    render(<Login />);
    
    // Check if button is disabled when inputs are empty
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  });
});
