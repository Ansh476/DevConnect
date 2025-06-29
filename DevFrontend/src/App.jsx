import { BrowserRouter ,Routes, Route} from 'react-router-dom'
import Body from './components/Body'
import Loginpage from './components/Loginpage'
import Profile from './components/Profile'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import Feed from './components/Feed'
import Connections from './components/Connections'
import Requests from './components/Requests'
import Chat from './components/Chat'
import OAuthSuccess from "./components/OAuthSuccess";
function App() {

  return (
    <>
    <Provider store={appStore}>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Body/>} >
            <Route path='/' element={<Feed/>}/>
            <Route path='/login' element={<Loginpage/>}/>
            <Route path='/connections' element={<Connections/>}/>
            <Route path='/requests' element={<Requests/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/chat/:targetuserId' element={<Chat/>}/>
            <Route path="/oauth-success" element={<OAuthSuccess />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
