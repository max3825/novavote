import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl opacity-40 animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl opacity-40 animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-8 py-24 text-center space-y-10">
          <div className="space-y-6 animate-fade-in">
            <div className="text-8xl mb-6 drop-shadow-lg">🗳️</div>
            <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight">
              <span className="gradient-text">
                NovaVote
              </span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
              Plateforme de Vote Électronique Sécurisée
            </h2>
          </div>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Votez en toute confiance avec une <span className="text-indigo-400 font-bold">cryptographie de niveau militaire</span>. 
            Transparent, vérifiable, et respectueux de votre vie privée.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
            <Link href="/login">
              <button className="btn-primary text-xl px-10 py-5 shadow-2xl">
                🔑 Accès Admin
              </button>
            </Link>
            <Link href="/vote">
              <button className="btn-secondary text-xl px-10 py-5">
                🗳️ Voter Maintenant
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-5xl font-extrabold text-center mb-4 tracking-tight gradient-text">
          Sécurité de Haut Niveau
        </h2>
        <p className="text-center text-slate-400 mb-20 text-xl font-medium">
          Tous les votes sont chiffrés, vérifiables et auditables
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative card-glass p-8 hover:scale-105 transition-transform">
              <div className="text-7xl mb-6 drop-shadow-md">🔐</div>
              <h3 className="text-3xl font-bold mb-4 text-slate-100 tracking-tight">Chiffrement ElGamal</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Protocole cryptographique moderne avec clés publiques distribuées. 
                Vos votes restent <span className="font-bold text-indigo-400">secrets même du serveur</span>.
              </p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative card-glass p-8 hover:scale-105 transition-transform">
              <div className="text-7xl mb-6 drop-shadow-md">✨</div>
              <h3 className="text-3xl font-bold mb-4 text-slate-100 tracking-tight">Preuves Zero-Knowledge</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Vérification cryptographique sans révéler le contenu. 
                Prouvez votre vote <span className="font-bold text-purple-400">sans le montrer</span> à personne.
              </p>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative card-glass p-8 hover:scale-105 transition-transform">
              <div className="text-7xl mb-6 drop-shadow-md">📋</div>
              <h3 className="text-3xl font-bold mb-4 text-slate-100 tracking-tight">Auditabilité Complète</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Tous les bulletins enregistrés publiquement. 
                Le décompte est <span className="font-bold text-blue-400">vérifiable par tous</span> indépendamment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section avec glassmorphism */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative card-glass text-center p-10">
              <div className="text-7xl font-black tracking-tighter mb-3 gradient-text">256-bit</div>
              <p className="text-slate-400 text-xl font-bold">Clés de Chiffrement</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative card-glass text-center p-10">
              <div className="text-7xl font-black tracking-tighter mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">100%</div>
              <p className="text-slate-400 text-xl font-bold">Vérifiable</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative card-glass text-center p-10">
              <div className="text-7xl font-black tracking-tighter mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">∞</div>
              <p className="text-slate-400 text-xl font-bold">Scalabilité</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="border-y border-slate-700 py-20 bg-slate-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-100">Stack Technique</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Next.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'IPFS', 'ElGamal', 'ZKP'].map((tech) => (
              <div 
                key={tech}
                className="px-8 py-4 bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700 rounded-full text-slate-100 font-bold hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 transition-all hover:scale-110 text-lg"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final avec gradient vibrant */}
      <div className="max-w-5xl mx-auto px-8 py-28 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20"></div>
          <div className="relative card-glass p-16 space-y-8">
            <h2 className="text-5xl font-extrabold tracking-tight gradient-text">
              Prêt à Voter ?
            </h2>
            <p className="text-2xl text-slate-400 font-medium max-w-2xl mx-auto">
              Commencez dès maintenant avec NovaVote - la plateforme de vote sécurisée et transparente
            </p>
            <Link href="/login">
              <button className="btn-primary text-2xl px-12 py-6 shadow-2xl animate-gradient">
                Créer une Élection
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 py-12 bg-slate-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-slate-400 font-semibold text-lg">
            NovaVote • Cryptographie Vérifiable • Démocratie Numérique Sécurisée
          </p>
          <p className="text-slate-500 text-base mt-3">
            Inspiré du protocole Belenios • Open Source • 2026
          </p>
        </div>
      </div>
    </div>
  );
}
