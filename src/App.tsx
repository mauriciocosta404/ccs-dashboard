import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import LandigPage from "./pages/home";
import { Fragment } from "react/jsx-runtime";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { useState } from "react";
import SplashScreen from "./components/common/SplashScreen";
import NonBaptizedMembers from "./pages/members/NonBaptizedMembers";
import BaptizedMembers from "./pages/members/BaptizedMembers";
import Members from "./pages/members/Members";
import RegisterEvent from "./pages/events/RegisterEvent";
import ListEvents from "./pages/events/EventList";
import { Bible } from "./pages/Bible";
import DefaultLayout from "./layout/DefaultLayout";
import RegisterServiceDay from "./pages/services-day/register-service-day";
import RegisterSermon from "./pages/sermons/register-sermon";
import SermonsList from "./pages/sermons/sermons-list";
import ServiceDayList from "./pages/services-day/service-day-list";
import EbdStudentsList from "./pages/ebd/students-list";
import RegisterEbdStudents from "./pages/ebd/register-students";
import { Sermons } from "./pages/sermons";
import TermsAndConditions from "./pages/terms-and-conditions";
import MinistryDetails from "./pages/ministry/MinistryDetails";
import SectorDetails from "./pages/sector/SectorDetails";
import PatrimonyList from "./pages/patrimony/PatrimonyList";
import InventoryList from "./pages/patrimony/InventoryList";
import MovementList from "./pages/movements/MovementList";
import SettingsList from "./pages/settings/SettingsList";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <Fragment>
      {showSplash && (
        <SplashScreen 
          duration={2000} 
          onAnimationComplete={() => setShowSplash(false)} 
        />
      )}
      
      {!showSplash && 
      
        (<Router  basename="/">
          <ScrollToTop />
          <Routes>
            <Route index path="/" element={<LandigPage />} />

            <Route element={<DefaultLayout />}>
              <Route path="/bible" element={<Bible />} />
              <Route path="/sermons" element={<Sermons />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            </Route>

            {/* Dashboard Layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<PrivateRoute  children={<Home />}/>} />

              {/* Others Page */}
              <Route path="/profile/:userId" element={<PrivateRoute  children={<UserProfiles />}/>}/>
              <Route path="/calendar" element={<PrivateRoute  children={<Calendar />}/>} />

              <Route path="/non-baptized-members" element={<PrivateRoute  children={ <NonBaptizedMembers />}/>} />
              <Route path="/baptized-members" element={<PrivateRoute  children={ <BaptizedMembers />}/>} />
              <Route path="/members" element={<PrivateRoute  children={ <Members />}/>} />

              <Route path="/register-event" element={<PrivateRoute  children={ <RegisterEvent />}/>} />
              <Route path="/events" element={<PrivateRoute  children={ <ListEvents />}/>} />
              <Route path="/blank" element={<Blank />} />

              <Route path="/register-service-day" element={<PrivateRoute  children={<RegisterServiceDay />}/>} />
              <Route path="/service-days" element={<PrivateRoute  children={<ServiceDayList />}/>} />

              <Route path="/register-sermon" element={<PrivateRoute  children={<RegisterSermon />}/>} />
              <Route path="/sermons-list" element={<PrivateRoute  children={<SermonsList />}/>} />

              <Route path="/students" element={<PrivateRoute  children={<EbdStudentsList />}/>} />
              {/* <Route path="/teachers" element={<PrivateRoute  children={<EbdTeachersList />}/>} /> */}
              <Route path="/register-student" element={<PrivateRoute  children={<RegisterEbdStudents />}/>} />

              {/* Ministry */}
              <Route path="/ministery/:id" element={<PrivateRoute  children={<MinistryDetails />}/>} />

              {/* Sector */}
              <Route path="/sector/:id" element={<PrivateRoute  children={<SectorDetails />}/>} />

              {/* Patrimony */}
              <Route path="/patrimonies" element={<PrivateRoute  children={<PatrimonyList />}/>} />
              <Route path="/inventory" element={<PrivateRoute  children={<InventoryList />}/>} />

              {/* Movements */}
              <Route path="/movements" element={<PrivateRoute  children={<MovementList />}/>} />

              {/* Settings */}
              <Route path="/settings" element={<PrivateRoute  children={<SettingsList />}/>} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />

            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<PublicRoute children={<SignIn />}  />} />
            <Route path="/signup" element={<PublicRoute children={<SignUp />} />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>)
      }
    </Fragment>
  );
}
