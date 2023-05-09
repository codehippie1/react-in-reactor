import React, { Component, useEffect } from 'react';
import { useMsal, useAccount, MsalProvider, UnauthenticatedTemplate, AuthenticatedTemplate, useMsalAuthentication } from "@azure/msal-react";
import { Route, Routes } from 'react-router-dom';
import './custom.css';
import { InteractionRequiredAuthError, InteractionType } from '@azure/msal-browser';
import AppRoutes from './AppRoutes';
import Layout from './components/Layout';
import { useAtom } from 'jotai';
import { accessTokenAtom } from './atoms';

const App = () => {
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const { instance, accounts, inProgress } = useMsal();
  const { login, result, error } = useMsalAuthentication(InteractionType.Redirect);

  console.log(accounts);
  console.log(inProgress);
  console.log(instance);
  const account = useAccount(accounts[0] || {});

  var talktoADReq = {
    scopes: ["api://62386cdd-72fb-4c00-b483-2d7219d5ce3f/DemoApiScope"],
    account: account
  }

  const acquireAccessToken = () => {
    instance.acquireTokenSilent(talktoADReq as any).then(tokenResponse => {
      // Do something with the tokenResponse
      console.warn(tokenResponse);
      setAccessToken(tokenResponse.accessToken);
    }).catch(async (error) => {
      console.log(error);
      if (error instanceof InteractionRequiredAuthError) {
        console.log("interaction required");
        // fallback to interaction when silent call fails
        return instance.acquireTokenPopup(talktoADReq as any);
      }

      // handle other errors
    })

  }

  useEffect(() => {
    acquireAccessToken();
  }, [account, instance]);

  //if (accounts.length > 0) {
  //  return <span>There are currently {accounts.length} users signed in!</span>
  //} else if (inProgress === "login") {
  //  return <span>Login is currently in progress!</span>
  //} else {
  //  return (
  //    <>
  //      <span>There are currently no users signed in!</span>
  //      <button onClick={() => instance.loginPopup()}>Login</button>
  //    </>
  //  );
  //}

  return (
    <>
      <UnauthenticatedTemplate>You should not be here!</UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Layout>
          <Routes>
            {AppRoutes.map((route, index) => {
              const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
            })}
          </Routes>
        </Layout>
      </AuthenticatedTemplate>
    </>
  );
  
}

export default App;
