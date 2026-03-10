import { Navigate } from "react-router";
import type {JSX} from "react";
import {JWT} from "../../JWT.ts";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const jwt = JWT();
    const token = jwt;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}