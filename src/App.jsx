import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import SignIn from './component/SignIn/SignIn.jsx';
import SignUp from './component/SignUp/SignUp.jsx';
import Waitlist from './component/Waitlist/Waitlist.jsx';
import Entrepreneurs from './component/Entrepreneurs/Home.jsx';
import Home from './component/Home/Home.jsx';
import LogIn from './component/LogIn/LogIn.jsx';
import Notification from './Utiles/Notification.jsx';
import { UserState } from './context/UserContext.jsx';
import ProtectedRoute from './routes/ProtectedRoutes.jsx';
import Investors from './component/Investors/Investors.jsx';
import Agent from './component/Agent/Agent.jsx';
import Blog from './component/Home/Blog.jsx';
import Blogdetails from './component/Home/Blogdetails.jsx';

import blog1 from './Assets/Images/blog1.png';
import blog2 from './Assets/Images/blog2.png';
import blog3 from './Assets/Images/blog3.png';
import blog4 from './Assets/Images/blog4.png';
import blog5 from './Assets/Images/blog5.png';
import blog6 from './Assets/Images/blog6.png';
import blog7 from './Assets/Images/blog7.png';
import blog8 from './Assets/Images/blog8.png';
import blog9 from './Assets/Images/blog9.png';
import Error404 from './component/Home/Error404.jsx';
import Contactus from './component/Home/Contactus.jsx';
import ManageLogin from './component/Private/Pages/Login.jsx'
import Legalteam from './component/Private/Role/Legalteam.jsx';
import Protected from './component/Private/Protected.jsx';
import Admin from './component/Private/Role/Admin.jsx';
import PaymentCancel from './component/Entrepreneurs/Pages/CancelPayment.jsx';
import SucessPayment from './component/Entrepreneurs/Pages/SucessPayment.jsx'
import PrivacyPolicy from './component/Home/PrivacyPolicy.jsx';
import EntrepreneurPage from './component/Home/Entrepreneur.jsx';
import InvestorPage from './component/Home/InvestorPage.jsx'
import AgentPage from './component/Home/AgentPage.jsx'
import TermsAndConditions from './component/Home/TermsConditions.jsx';
import AboutUsPage from './component/Home/AboutUs.jsx'
import Pricing from './component/Home/Pricing.jsx'
import LoginAs from './component/LogIn/LoginAs.jsx'
import Privacypolicy from './Utiles/Privacypolicy.jsx';
import Deleteaccount from './Utiles/Deleteaccount.jsx';
import EventPage from './component/Home/EventPage.jsx';
import GuideEBook from './component/Home/GuideEBook.jsx';
import GettingStart from './component/Home/GettingStart.jsx';

function App() {

  const { user } = UserState();

  const data = [
    {
      id: 1,
      img: blog1,
      ctg: 'Travel',
      date: '13 March 2023',
      title: 'Train Or Bus Journey?Which one suits?',
      text: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      desc: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person ,The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      thought: '“People worry that computers will get too smart and take over the world, but the real problem is that they’re too stupid and they’ve already taken over the world.”',
      by: 'Pedro Domingos'
    },
    {
      id: 2,
      img: blog2,
      ctg: 'Travel',
      date: '13 March 2023',
      title: 'Train Or Bus Journey?Which one suits?',
      text: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      desc: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person ,The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      thought: '“People worry that computers will get too smart and take over the world, but the real problem is that they’re too stupid and they’ve already taken over the world.”',
      by: 'Pedro Domingos'
    },
    {
      id: 3,
      img: blog3,
      ctg: 'Travel',
      date: '13 March 2023',
      title: 'Train Or Bus Journey?Which one suits?',
      text: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      desc: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person ,The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      thought: '“People worry that computers will get too smart and take over the world, but the real problem is that they’re too stupid and they’ve already taken over the world.”',
      by: 'Pedro Domingos'
    },
    {
      id: 4,
      img: blog4,
      ctg: 'Travel',
      date: '13 March 2023',
      title: 'Train Or Bus Journey?Which one suits?',
      text: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      desc: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person ,The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      thought: '“People worry that computers will get too smart and take over the world, but the real problem is that they’re too stupid and they’ve already taken over the world.”',
      by: 'Pedro Domingos'
    },
    {
      id: 5,
      img: blog5,
      ctg: 'Travel',
      date: '13 March 2023',
      title: 'Train Or Bus Journey?Which one suits?',
      text: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      desc: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person ,The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      thought: '“People worry that computers will get too smart and take over the world, but the real problem is that they’re too stupid and they’ve already taken over the world.”',
      by: 'Pedro Domingos'
    },
    {
      id: 6,
      img: blog6,
      ctg: 'Travel',
      date: '13 March 2023',
      title: 'Train Or Bus Journey?Which one suits?',
      text: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      desc: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person ,The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      thought: '“People worry that computers will get too smart and take over the world, but the real problem is that they’re too stupid and they’ve already taken over the world.”',
      by: 'Pedro Domingos'
    },
    {
      id: 7,
      img: blog7,
      ctg: 'Travel',
      date: '13 March 2023',
      title: 'Train Or Bus Journey?Which one suits?',
      text: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      desc: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person ,The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      thought: '“People worry that computers will get too smart and take over the world, but the real problem is that they’re too stupid and they’ve already taken over the world.”',
      by: 'Pedro Domingos'
    },
    {
      id: 8,
      img: blog8,
      ctg: 'Travel',
      date: '13 March 2023',
      title: 'Train Or Bus Journey?Which one suits?',
      text: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      desc: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person ,The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      thought: '“People worry that computers will get too smart and take over the world, but the real problem is that they’re too stupid and they’ve already taken over the world.”',
      by: 'Pedro Domingos'
    },
    {
      id: 9,
      img: blog9,
      ctg: 'Travel',
      date: '13 March 2023',
      title: 'Train Or Bus Journey?Which one suits?',
      text: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      desc: 'The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person ,The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person , The choice between a train or bus journey depends on various factors such as the distance of the journey, the time available, the cost, and person',
      thought: '“People worry that computers will get too smart and take over the world, but the real problem is that they’re too stupid and they’ve already taken over the world.”',
      by: 'Pedro Domingos'
    },
  ]

  function LoginElement() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
  
    if (!type) {
      return <Navigate replace to="/login-as" />;
    }
  
    return user ? <Navigate replace to={`/${user.role}/dashboard`} /> : <LogIn />;
  }

  return (
    <>
      <Notification />
      <Router>
        <Routes>
        <Route path="/login" element={<LoginElement />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/sign-up-as" element={<SignIn />} /> 
          <Route path="/login-as" element={<LoginAs />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Error404 />} />
          <Route path="/contact-us" element={<Contactus />} />
          <Route path="/entrepreneur" element={<EntrepreneurPage />} />
          <Route path="/investor" element={<InvestorPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path= "/terms-conditions" element={<TermsAndConditions />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/guide-e-books" element={<GuideEBook />} />
          <Route path="/getting-started" element={<GettingStart />} />
          <Route path="/blog" element={<Blog data={data} />} />
          <Route path="/blog/:id" element={<Blogdetails data={data} />} />
          <Route path="/privacy-policy"element={<PrivacyPolicy />} />
          <Route path="/privacy_policy"element={<Privacypolicy />} />
          <Route path="/delete_account"element={<Deleteaccount />} />
          <Route path={`/${user.role}/varification/cancel`} element={user?(<PaymentCancel/>):(<Navigate replace to={`/${user.role}/dashboard`} />)} />
          <Route path={`/${user.role}/varification/sucess`} element={user?(<SucessPayment/>):(<Navigate replace to={`/${user.role}/dashboard`} />)} />

          <Route
            path="/entrepreneur/*"
            element={
              <ProtectedRoute allowedRoles={['entrepreneur']}>
                <Entrepreneurs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/investor/*"
            element={
              <ProtectedRoute allowedRoles={['investor']}>
                <Investors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/*"
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <Agent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage/login"
            element={
              user?.role == 'superadmin' ? (
                <Navigate to="/superadmin/dashboard" />
              ) : user?.role ? (
                // <Navigate to="/superadmin/dashboard" />
                <Navigate replace to={`/${user.role}/dashboard`} />
              ) : (
                <ManageLogin />
              )
            }
          />
          <Route
            path="/legalteam/*"
            element={
              <Protected allowedRoles={['legalteam']}>
                <Legalteam />
              </Protected>
            }
          />
          <Route
            path="/superadmin/*"
            element={
              <Protected allowedRoles={['superadmin']}>
                <Admin />
              </Protected>
            }
          />
        </Routes>
      </Router>
    </>

  )
}

export default App
