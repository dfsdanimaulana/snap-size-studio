import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/elements/layout'

// features
import Home from './features/home'
import Cropper from './features/cropper'
import Resizer from './features/resizer'
import ErrorPage from './components/elements/error-page'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/resizer',
                element: <Resizer />,
            },
            {
                path: '/cropper',
                element: <Cropper />,
            },
        ],
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App
