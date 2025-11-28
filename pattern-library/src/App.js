import Routers from "./Routers";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserProvider from "./context/userContext";
import ToastProvider from "./components/toastMessage/HotToast/ToastProvider";
import { SignalRProvider } from "./context/SignalRContext";

const queryClient = new QueryClient();

const hubUrl =
  process.env.REACT_APP_SIGNALR_HUB || "https://localhost:7287/notificationHub";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        {/* <SignalRProvider hubUrl={hubUrl}>
        </SignalRProvider> */}
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
