import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function LoginSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fn = isLogin ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { data, error } = await fn({ email, password });
    if (error) return setMsg(`❌ ${error.message}`);
    setMsg(`✅ ${isLogin ? 'Logged in' : 'Signed up'} as ${email}`);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>{isLogin ? 'Log In' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} /><br />
        <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? 'Sign Up' : 'Log In'}
      </button>
      <p>{msg}</p>
    </div>
  );
}
