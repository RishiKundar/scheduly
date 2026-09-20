import { Link } from 'react-router-dom';
import MatrixBackground from '../components/MatrixBackground';

export default function Landing() {
    return (
        <div className="min-h-screen relative overflow-hidden font-mono text-emerald-100 scroll-smooth">
            <MatrixBackground />
            
            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col min-h-screen bg-gray-950/60">
                
                {/* Navbar */}
                <nav className="flex justify-between items-center p-6 lg:px-12 backdrop-blur-md bg-gray-950/80 border-b border-emerald-500/30 sticky top-0 z-50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-emerald-950 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse">
                            {'>_'}
                        </div>
                        <span className="text-2xl font-bold tracking-widest uppercase text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                            Scheduly
                        </span>
                    </div>
                    <div>
                        <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-400 transition-colors mr-6">
                            Authenticate
                        </Link>
                        <Link to="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-5 py-2.5 rounded font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]">
                            Initialize
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:px-24 gap-12 min-h-[90vh]">
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 rounded border border-emerald-500/30 bg-emerald-950/50 text-emerald-400 text-sm font-bold tracking-widest uppercase backdrop-blur-sm animate-bounce shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            {'>'} System Online
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight uppercase tracking-wider">
                            Execute jobs <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                without limits.
                            </span>
                        </h1>
                        <p className="text-lg text-emerald-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                            Scheduly is an enterprise-grade distributed job scheduler built for scale. Guarantee at-least-once delivery with Kafka, transactional outboxes, and atomic PostgreSQL leases.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                            <Link to="/login" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-8 py-4 rounded font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] text-center">
                                Access Terminal
                            </Link>
                            <a href="#documentation" onClick={(e) => { e.preventDefault(); document.getElementById('documentation').scrollIntoView({ behavior: 'smooth' }); }} className="w-full sm:w-auto px-8 py-4 rounded font-bold uppercase tracking-widest border border-emerald-700 text-emerald-500 hover:bg-emerald-950/50 hover:border-emerald-400 hover:text-emerald-300 transition-all text-center group">
                                Read Manual <span className="inline-block transition-transform group-hover:translate-y-1">↓</span>
                            </a>
                        </div>
                    </div>
                    
                    {/* Hero Image / Cyber Element */}
                    <div className="flex-1 w-full max-w-2xl">
                        <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.2)] border border-emerald-500/30 group animate-pulse-slow">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/80 to-transparent mix-blend-overlay z-10"></div>
                            <img 
                                src="/hero.jpg" 
                                alt="System Architecture" 
                                className="w-full h-auto object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000"
                            />
                        </div>
                    </div>
                </main>

                {/* Documentation Section */}
                <section id="documentation" className="min-h-screen py-24 px-6 lg:px-24 bg-gray-950/90 backdrop-blur-xl border-t border-emerald-500/20">
                    <div className="max-w-5xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl lg:text-5xl font-bold text-emerald-400 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                Architecture
                            </h2>
                            <p className="text-xl text-emerald-600 font-sans">The anatomy of a highly resilient distributed worker node.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="group bg-gray-900/50 border border-emerald-900 rounded p-8 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <h3 className="text-2xl font-bold mb-4 text-emerald-100 group-hover:text-emerald-400 transition-colors tracking-wide uppercase">01. Outbox</h3>
                                <p className="text-emerald-600/80 leading-relaxed font-sans">
                                    When you create a job, it isn't just thrown into the void. It's saved transactionally to Postgres alongside an <span className="text-emerald-300 font-mono text-sm">OutboxEvent</span>. This guarantees no data is lost if the system crashes before Kafka receives it.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="group bg-gray-900/50 border border-emerald-900 rounded p-8 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden delay-100">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <h3 className="text-2xl font-bold mb-4 text-emerald-100 group-hover:text-emerald-400 transition-colors tracking-wide uppercase">02. Streams</h3>
                                <p className="text-emerald-600/80 leading-relaxed font-sans">
                                    The <span className="text-emerald-300 font-mono text-sm">OutboxRelay</span> acts as a pacemaker, constantly sweeping the database and publishing lightning-fast events to the Kafka <span className="text-emerald-300 font-mono text-sm">job-scheduling-topic</span>.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="group bg-gray-900/50 border border-emerald-900 rounded p-8 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden delay-200">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <h3 className="text-2xl font-bold mb-4 text-emerald-100 group-hover:text-emerald-400 transition-colors tracking-wide uppercase">03. Locking</h3>
                                <p className="text-emerald-600/80 leading-relaxed font-sans">
                                    Workers listen to Kafka, but use <span className="text-emerald-300 font-mono text-sm">FOR UPDATE SKIP LOCKED</span> on the database to acquire a 30-second atomic lease. This guarantees no two workers will ever execute the same job twice.
                                </p>
                            </div>
                        </div>

                        {/* Interactive CLI Simulation */}
                        <div className="mt-16 bg-gray-950 border border-emerald-500/30 rounded p-6 font-mono text-sm shadow-[0_0_40px_rgba(16,185,129,0.1)] overflow-hidden group">
                            <div className="flex items-center space-x-2 mb-4 border-b border-emerald-500/20 pb-4">
                                <div className="w-3 h-3 rounded-full bg-emerald-900 border border-emerald-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-700 border border-emerald-400/50"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                                <span className="text-emerald-600 ml-4 font-bold tracking-widest uppercase text-xs">/var/log/worker-node.log</span>
                            </div>
                            <div className="space-y-2">
                                <div className="text-emerald-500 group-hover:animate-pulse"> Initializing Scheduly Worker Node 1...</div>
                                <div className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"> Connected to Kafka Broker at localhost:9092</div>
                                <div className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-700"> Received Event: 8f4b-29c1... Claiming Database Lease!</div>
                                <div className="text-green-400 font-bold drop-shadow-[0_0_5px_rgba(74,222,128,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-1000"> [SUCCESS] Executed Webhook https://api.example.com</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="p-6 text-center text-emerald-800 text-xs font-bold uppercase tracking-widest bg-gray-950 border-t border-emerald-500/20">
                    &copy; {new Date().getFullYear()} Scheduly Inc. Built by Rishi.
                </footer>
            </div>
        </div>
    );
}
