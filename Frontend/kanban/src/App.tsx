import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import LandingPage from './Authentication/index.tsx';
import KanbanBoard from './Components/KanbanBoard/index.tsx';

const queryClient=new QueryClient();

function App() {
  return (
  <QueryClientProvider client={queryClient}>
    <div>
    <LandingPage />
      {/* <KanbanBoard /> */}
    </div>
  </QueryClientProvider>
  );
}

export default App;
