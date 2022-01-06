import { Upload } from "antd";
import { Switch, Route } from "react-router-dom";
import { ProtectedUserRoute } from "./hoc/Authenticated";
import { AdminLogin } from "./pages/Auth/Admin/Login";
import { AdminSignup } from "./pages/Auth/Admin/Register";
import { Login } from "./pages/Auth/User/Login";
import { Register } from "./pages/Auth/User/Register";
import Contact from "./pages/Contact";
import ManageUsers from "./pages/Dashboard/Admin/Users/ManageUsers";
import Contacts from "./pages/Dashboard/User/Contatcs/Contacts";
import Files from "./pages/Dashboard/User/Files/Files";
import { Folder } from "./pages/Dashboard/User/Folder/Folder";
import Folders from "./pages/Dashboard/User/Folders/Folders";
import { Invite } from "./pages/Dashboard/User/Invite/Invite";
import { Overview } from "./pages/Dashboard/User/Overview/Overview";
import Settings from "./pages/Dashboard/User/Settings/Settings";
import { WhatIsFileTracker } from "./pages/FileTracker/WhatIsFileTracker";
import { LandingPage } from "./pages/Landing";
import { Payment } from "./pages/Payment";
import { Products } from "./pages/Products/Products";
import { SelectPlan } from "./pages/SelectPlan";


export const Routers = () => {

  return (
    <Switch>
      <Route exact path="/" component={LandingPage} />

      <Route exact path="/login">
        <Login />
      </Route>

      <Route exact path="/register">
        <Register />
      </Route>
      <Route exact path="/admin/register" component={AdminSignup} />
      <Route exact path="/admin/login" component={AdminLogin} />

      <Route exact path="/admin/dashboard/manage-users" component={ManageUsers} />
      {/* <Route exact path="/admin/dashboard/manage-storage" component={ManageStorage} /> */}
      {/* <Route exact path="/admin/dashboard/manage-plans" component={ManagePlans} /> */}
      {/* <Route exact path="/admin/dashboard/settings" component={ManageSettings} /> */}



      <ProtectedUserRoute exact path="/user/dashboard/overview" component={Overview} />
      <ProtectedUserRoute exact path="/user/dashboard/contacts" component={Contacts} />
      <ProtectedUserRoute exact path="/user/dashboard/files" component={Files} />
      <ProtectedUserRoute exact path="/user/dashboard/folders" component={Folders} />
      <ProtectedUserRoute exact path="/user/dashboard/folders/:folder" component={Folder} />
      <ProtectedUserRoute exact path="/user/dashboard/files/upload" component={Upload} />
      <ProtectedUserRoute exact path="/user/dashboard/invite" component={Invite} />
      <ProtectedUserRoute exact path="/user/dashboard/settings" component={Settings} />
      <Route exact path="/select-plan" component={SelectPlan} />

      <Route exact path="/payment">
        <Payment />
      </Route>

      <Route exact path="/what-is-file-tracker">
        <WhatIsFileTracker />
      </Route>

      <Route exact path="/products">
        <Products />
      </Route>

      <Route exact path="/contact">
        <Contact />
      </Route>
    </Switch>
  );
};
