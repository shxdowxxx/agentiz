import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginFlow from '../components/LoginFlow';

export default function Login() {
  const navigate = useNavigate();
  const onSuccess = () => navigate('/');
  return <LoginFlow onSuccess={onSuccess} />;
}
