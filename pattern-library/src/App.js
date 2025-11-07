import Routers from "./Routers";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserProvider from "./context/userContext";
import ToastProvider from "./components/toastMessage/HotToast/ToastProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <div className="App">
          <Routers />
          {/* Toast Container - Global */}
          <ToastProvider />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
