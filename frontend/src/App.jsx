import React from 'react'
import AuthProvider from "./provider/AuthProvider";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Toaster />
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;