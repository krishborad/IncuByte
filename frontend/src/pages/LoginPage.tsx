import React from 'react';

export const LoginPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Sign In to DriveHub</h2>
      <p className="text-slate-400 text-center text-sm mb-4">Enter your credentials to access your account</p>
    </div>
  );
};

export default LoginPage;
