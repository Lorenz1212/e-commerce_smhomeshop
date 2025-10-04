import React, { useState, useEffect  } from "react";
import "./LoginSignUp.css";
import { useLocation,useNavigate  } from 'react-router-dom'

import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";

const LoginSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  // detect initial tab from URL
  const defaultTab =
    params.get("tab") === "register" ? "tabButton2" : "tabButton1";

  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTab = (tab: string) => {
    setActiveTab(tab);

    // update URL query whenever user clicks a tab
    const nextTab = tab === "tabButton2" ? "register" : "login";
    navigate(`?tab=${nextTab}`, { replace: true });
  };

  useEffect(() => {
    // If user changes URL manually (back/forward button), keep UI in sync
    const urlTab =
      new URLSearchParams(location.search).get("tab") === "register"
        ? "tabButton2"
        : "tabButton1";
    setActiveTab(urlTab);
  }, [location.search]);

  return (
    <>
      <div className="loginSignUpSection">
        <div className="loginSignUpContainer">
          <div className="loginSignUpTabs">
            <p
              onClick={() => handleTab("tabButton1")}
              className={activeTab === "tabButton1" ? "active" : ""}
            >
              Login
            </p>
            <p
              onClick={() => handleTab("tabButton2")}
              className={activeTab === "tabButton2" ? "active" : ""}
            >
              Register
            </p>
          </div>
          <div className="loginSignUpTabsContent">
            {/* tab1 */}

            {activeTab === "tabButton1" && (
              <div className="loginSignUpTabsContentLogin">
                 <LoginPage/>
                <div className="loginSignUpTabsContentLoginText">
                  <p>
                    No account yet?{" "}
                    <span onClick={() => handleTab("tabButton2")}>
                      Create Account
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Tab2 */}

            {activeTab === "tabButton2" && (
              <div className="loginSignUpTabsContentRegister">
                  <SignupPage/>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignUp;
