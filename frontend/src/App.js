import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import SetAvatar from './pages/SetAvatar';

function App() {
  const router = createBrowserRouter([
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/setAvatar",
      element: <SetAvatar />
    },
    {
      path: "/",
      element: <Chat />
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
