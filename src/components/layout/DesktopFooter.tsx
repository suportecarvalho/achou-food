import React from 'react'
import { Link } from 'react-router-dom'
import { AchouLogo } from '@/components/common/AchouLogo'
import { MapPin, Heart, ShieldCheck, Motorcycle } from '@phosphor-icons/react'

export const DesktopFooter: React.FC = () => {
  return (
    <footer className="hidden md:block bg-white border-t border-gray-200/80 text-gray-600 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna 1: Marca & Descrição */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block">
              <AchouLogo variant="full" size="md" />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              A melhor plataforma de gastronomia e delivery em Canela e Região das Hortênsias. Peça dos seus restaurantes favoritos com rapidez e comodidade.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <MapPin size={16} weight="fill" className="text-red-base" />
              <span>Canela, Rio Grande do Sul - Brasil</span>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-red-base transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-red-base transition-colors">
                  Mapa de Restaurantes
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-red-base transition-colors">
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-red-base transition-colors">
                  Restaurantes Favoritos
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Categorias em Destaque */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Gastronomia Local
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500">Doces & Confeitarias Artesanais</li>
              <li className="text-gray-500">Cafés Coloniais da Serra Gaúcha</li>
              <li className="text-gray-500">Bistrôs & Gastronomia Contemporânea</li>
              <li className="text-gray-500">Hamburguerias & Lanches Gourmet</li>
            </ul>
          </div>

          {/* Coluna 4: Segurança & Compromisso */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Compromisso
            </h4>
            <div className="space-y-3 text-xs text-gray-500">
              <div className="flex items-start gap-2">
                <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Pagamento seguro e protegido na entrega</span>
              </div>
              <div className="flex items-start gap-2">
                <Motorcycle size={18} className="text-red-base flex-shrink-0 mt-0.5" />
                <span>Entregadores locais com rastreamento</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart size={18} weight="fill" className="text-red-base flex-shrink-0 mt-0.5" />
                <span>Apoie os empreendedores e restaurantes de Canela</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Inferior com Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Achou Food. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-600 transition-colors cursor-pointer">Termos de Uso</span>
            <span className="hover:text-gray-600 transition-colors cursor-pointer">Privacidade</span>
            <span className="hover:text-gray-600 transition-colors cursor-pointer">Canela - RS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
