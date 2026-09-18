import { Link } from 'react-router-dom';
import ConstellationBackground from '../components/ConstellationBackground';

export default function Landing() {
    return (
        <div className="min-h-screen relative overflow-hidden font-sans text-white scroll-smooth">
            <ConstellationBackground />
            
            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col min-h-screen">
                
                {/* Navbar */}
                <nav className="flex justify-between items-center p-6 lg:px-12 backdrop-blur-sm bg-slate-900/50 border-b border-slate-800 sticky top-0 z-50">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl animate-pulse">S</div>
                        <span className="text-2xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Scheduly
                        </span>
                    </div>
                    <div>
                        <Link to="/login" className="text-sm font-medium hover:text-blue-400 transition-colors mr-6">
                            Sign In
                        </Link>
                        <Link to="/login" className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_rgba(37,99,235,0.8)]">
                            Get Started
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:px-24 gap-12 min-h-[90vh]">
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium backdrop-blur-sm animate-bounce">
                            🚀 The New Standard for Distributed Execution
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                            Execute jobs <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                without limits.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Scheduly is an enterprise-grade distributed job scheduler built for scale. Guarantee at-least-once delivery with Kafka, transactional outboxes, and atomic PostgreSQL leases.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                            <Link to="/login" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_rgba(37,99,235,0.8)] text-center">
                                Launch Dashboard
                            </Link>
                            <a href="#documentation" onClick={(e) => { e.preventDefault(); document.getElementById('documentation').scrollIntoView({ behavior: 'smooth' }); }} className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-medium border border-slate-600 hover:bg-slate-800 hover:border-blue-400 transition-all text-center group">
                                View Documentation <span className="inline-block transition-transform group-hover:translate-y-1">↓</span>
                            </a>
                        </div>
                    </div>
                    
                    {/* Hero Image */}
                    <div className="flex-1 w-full max-w-2xl animate-float">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-slate-700/50 group animate-glow">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700"></div>
                            <img 
                                src="/hero.jpg" 
                                alt="Distributed Nodes Illustration" 
                                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-1000"
                            />
                        </div>
                    </div>
                </main>

                {/* Documentation Section */}
                <section id="documentation" className="min-h-screen py-24 px-6 lg:px-24 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
                    <div className="max-w-5xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                How It Works
                            </h2>
                            <p className="text-xl text-slate-400">The anatomy of a highly resilient distributed worker node.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="group bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-blue-500/30">
                                    <span className="text-2xl">1️⃣</span>
                                </div>
                                <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-blue-400 transition-colors">The Outbox Pattern</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    When you create a job, it isn't just thrown into the void. It's saved transactionally to Postgres alongside an <span className="text-blue-300 font-mono">OutboxEvent</span>. This guarantees no data is lost if the system crashes before Kafka receives it.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="group bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] delay-100">
                                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-purple-500/30">
                                    <span className="text-2xl">2️⃣</span>
                                </div>
                                <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-purple-400 transition-colors">Kafka Streams</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    The <span className="text-purple-300 font-mono">OutboxRelayService</span> acts as a pacemaker, constantly sweeping the database and publishing lightning-fast events to the Kafka <span className="text-purple-300 font-mono">job-scheduling-topic</span>.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="group bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] delay-200">
                                <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-sky-500/30">
                                    <span className="text-2xl">3️⃣</span>
                                </div>
                                <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-sky-400 transition-colors">Atomic Locking</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Workers listen to Kafka, but use <span className="text-sky-300 font-mono">FOR UPDATE SKIP LOCKED</span> on the database to acquire a 30-second atomic lease. This guarantees no two workers will ever execute the same job twice!
                                </p>
                            </div>
                        </div>

                        {/* Interactive CLI Simulation */}
                        <div className="mt-16 bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-sm shadow-2xl overflow-hidden group">
                            <div className="flex items-center space-x-2 mb-4 border-b border-slate-800 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-slate-500 ml-4">worker-node-log</span>
                            </div>
                            <div className="space-y-2">
                                <div className="text-blue-400 group-hover:animate-pulse"> Initializing Scheduly Worker Node 1...</div>
                                <div className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"> Connected to Kafka Broker at localhost:9092</div>
                                <div className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-700"> Received Event: 8f4b-29c1... Claiming Database Lease!</div>
                                <div className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-1000"> [SUCCESS] Executed Webhook https://api.example.com</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="p-6 text-center text-slate-500 text-sm backdrop-blur-sm bg-slate-900/50">
                    &copy; {new Date().getFullYear()} Scheduly Inc. Built by Rishi.
                </footer>
            </div>
        </div>
    );
}
