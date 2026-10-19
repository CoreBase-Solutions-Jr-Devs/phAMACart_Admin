import AppRoutes from "./routes";
import { ThemeProvider } from "./context/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";
import TenantInitializer from "./lib/tenant-initializer";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <TenantInitializer>
          <AppRoutes />
        </TenantInitializer>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
