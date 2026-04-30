import { Navigate, Route, Routes } from "react-router-dom";
import { ClassicLayout } from "../components/layout/ClassicLayout";
import { AdminPage } from "../pages/AdminPage";
import { CarrinhoPage } from "../pages/CarrinhoPage";
import { AuthPage } from "../pages/AuthPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProdutoDetalhePage } from "../pages/ProdutoDetalhePage";
import { ProdutosPage } from "../pages/ProdutosPage";

import { FinalizacaoPage } from "../pages/FinalizacaoPage";

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route element={<ClassicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/produtos/:id" element={<ProdutoDetalhePage />} />
        <Route path="/carrinho" element={<CarrinhoPage />} />
        <Route path="/finalizar" element={<FinalizacaoPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
