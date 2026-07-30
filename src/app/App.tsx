import { QueryProvider, RouterProvider } from "@/app/providers/";
import { Toaster } from "sonner";

const App = () => {
  return (
    <QueryProvider>
      <RouterProvider />
      <Toaster position="top-right" richColors />
    </QueryProvider>
  );
};

export default App;
