import {Navigate} from 'react-router-dom'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Home from '../pages/Home/Home'
import Control from '../pages/Control/Control.jsx'
import ArticleSystem from '../pages/Control/ArticleSystem/ArticleSystem'
import BulletinSystem from '../pages/Control/BulletinSystem/BulletinSystem'
import CommentSystem from '../pages/Control/CommentSystem/CommentSystem'
import UserSystem from '../pages/Control/UserSystem/UserSystem'
import Create from '../pages/Control/Create/Create'
import Revise from '../pages/Control/Revise/Revise'
import DetailssCommentSystem from '../pages/Control/DetailssCommentSystem/DetailssCommentSystem'
import Details from '../pages/Details/Details'
const routes = [
	{
		path:'/home',
		element:<Home />
	},
	{
		path:'/login',
		element:<Login />
	},
	{
		path:'/register',
		element:<Register />
	},
	{
		path:'/control',
		element:<Control />,
		children:[
			{
				path:'articleSystem',
				element:<ArticleSystem/>,
			},
			{
				path:'bulletinSystem',
				element:<BulletinSystem/>
			},
			{
				path:'commentSystem',
				element:<CommentSystem/>
			},
			{
				path:'userSystem',
				element:<UserSystem/>
			},
			{
				path:'create',
				element:<Create />
			},
			{
				path:'revise/:id',
				element:<Revise />
			},
			{
				path:'DetailssCommentSystem/:id',
				element:<DetailssCommentSystem />
			},
		]

	},
	{
		path:'/details/:id',
		element:<Details />
	},
	{
		path:'/',
		element:<Navigate to="/home"/>
	},

]

export default routes