"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Coordinator account created!");
      router.push('/login'); // We will build login next
    } else {
      const data = await res.json();
      alert(data.error || "Setup failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-brand-light">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Initialize Athenas</h1>
        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required 
              className="w-full p-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand text-white p-3 rounded-2xl font-semibold hover:bg-brand-dark transition"
          >
            {loading ? "Creating..." : "Create Master Coordinator"}
          </button>
        </form>
      </div>
    </div>
  );
}
