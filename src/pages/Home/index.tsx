import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { storage } from 'utils/storage'
import SignIn from 'pages/SignIn'
import BaseLayout from 'pages/layouts/BaseLayout'
import { menus } from 'configs/menus'
import Dashboard from 'pages/Dashboard'

export const Home = () => {
  if (!storage.getAccessToken()) {
    return <SignIn />
  }

  // if (!ready) {
  //   return (
  //     <Flex style={{ minHeight: '90vh' }} justifyContent="center" alignItems="center">
  //       <LoadingOutlined size={40} />
  //     </Flex>
  //   )
  // }

  return (
    <div>
        <Switch>
          <Route path="/login" component={SignIn} />
          <BaseLayout>
            <Route path="/" exact component={Dashboard} />
            {
              menus.map(menu => {
                return (
                  <Route
                    key={menu.pathname} 
                    path={menu.pathname} 
                    component={menu.component} 
                  />
                )
              })
            }
          </BaseLayout>
          <Route component={() => <div>Not found...</div>} />
        </Switch>
    </div>
  )
}
