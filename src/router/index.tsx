import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { routes, RouteConfig } from './routes';

const finalRoutes = routes.map((route: RouteConfig) => {
    const element = route.layout === 'blank' ?
        <BlankLayout>{route.element}</BlankLayout> :
        <DefaultLayout>{route.element}</DefaultLayout>;

    return {
        ...route,
        element: route.isPublic ? (
            <ProtectedRoute requireAuth={false}>
                {element}
            </ProtectedRoute>
        ) : (
            <ProtectedRoute>
                {element}
            </ProtectedRoute>
        ),
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;
