import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Zap, 
  ShieldCheck, 
  ArrowRight, } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">GigFlow</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-md"
          >
            Join Now
          </button>
        </div>
      </nav>

      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-700 text-sm font-medium mb-8">
            <Zap size={16} />
            <span>The #1 Micro-Freelancing Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Find the perfect <span className="text-indigo-600">Gig</span> <br /> 
            for your next big idea.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed">
            GigFlow connects ambitious startups with top-tier freelancers. 
            Post jobs, manage bids, and hire the best talent in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group"
            >
              Get Started for Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-8 py-4 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              Browse Market
            </button>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto">
                <Users className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Fluid Roles</h3>
              <p className="text-slate-500">Post a job as a client or bid as a freelancer from a single account.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto">
                <ShieldCheck className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Secure Hiring</h3>
              <p className="text-slate-500">Atomic hiring logic ensures one-click contracts without race conditions.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto">
                <Zap className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Instant Updates</h3>
              <p className="text-slate-500">Real-time notifications keep you informed the moment you're hired.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
              Ready to start your flow?
            </h2>
            <p className="text-indigo-100 text-lg mb-10 relative z-10 max-w-xl mx-auto">
              Join thousands of creators and builders on GigFlow. 
              Signing up takes less than 2 minutes.
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all relative z-10"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
            <Briefcase className="text-white w-4 h-4" />
          </div>
          <span className="font-bold">GigFlow</span>
        </div>
        <p className="text-slate-400 text-sm">© 2026 GigFlow Platform. Built for Internshala Assignment.</p>
      </footer>
    </div>
  );
}