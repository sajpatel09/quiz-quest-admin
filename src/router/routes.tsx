import {lazy, ReactElement} from 'react';
import Category from "../pages/Category";
import Quiz from "../pages/Quiz";
import Question from "../pages/Question";
import Login from "../pages/Login";
import Profile from "../pages/Users/Profile";
import AccountSetting from "../pages/Users/AccountSetting";
import Error404 from "../pages/Pages/Error404";

const Index = lazy(() => import('../pages/Index'));

export interface RouteConfig {
    path: string;
    element: ReactElement;
    layout: 'blank' | 'default';
    isPublic?: boolean;
}

const publicRoutes: RouteConfig[] = [
    {
        path: "/login",
        element: <Login/>,
        layout: 'blank',
        isPublic: true
    },
];

const protectedRoutes: RouteConfig[] = [
    {
        path: '/',
        element: <Index/>,
        layout: 'default',
    },
    {
        path: '/category',
        element: <Category/>,
        layout: 'default',
    },
    {
        path: '/quiz',
        element: <Quiz/>,
        layout: 'default',
    },
    {
        path: '/question',
        element: <Question/>,
        layout: 'default',
    },
    {
        path: '/profile',
        element: <Profile/>,
        layout: 'default',
    },
    {
        path: '/account-setting',
        element: <AccountSetting/>,
        layout: 'default',
    },
    {
        path: '*',
        element: <Error404/>,
        layout: 'default',
    }
];

export const routes: RouteConfig[] = [...publicRoutes, ...protectedRoutes];
