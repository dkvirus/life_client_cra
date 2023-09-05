import React, { ReactNode, useEffect, useState } from 'react'
import { Layout, Menu, theme, Avatar, Button } from 'antd'
import { storage } from 'utils/storage';
import { getMenuItems } from './utils';
import { Flex, Flex1 } from 'druikit';
import { useHistory } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout

const BaseLayout = ({
    children,
}: {
    children?: ReactNode;
}) => {
    const history = useHistory()

    const [ items, setItems ] = useState([ {
        key: 'dashboard',
        label: '控制台',
    } ])

    useEffect(() => {
        const privs = storage.getPrivs()
        const items = getMenuItems(privs)
        setItems([ ...items ])
    }, [])
    
    const onLogout = () => {
        localStorage.clear()
        window.location.href = '/'
    }

    return (
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
          >
            <Flex justifyContent="center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
              <Avatar size={50} shape="square" style={{ backgroundColor: '#f56a00' }}>DK</Avatar>
            </Flex>
            <Menu
              theme="dark"
              mode="inline"
              items={items}
              onClick={({ key }) => {
                history.push(`/${key}`)
              }}
            />
          </Sider>
          <Layout>
            <Header style={{ padding: 0 }}>
              <Flex alignItems="center" isFullHeight>
                <Flex1 />
                <Button 
                  type="link"
                  onClick={onLogout}
                >
                  退出登录
                </Button>
              </Flex>
            </Header>
            <Content style={{ margin: '24px 16px 0' }}>
              <div style={{ padding: 24, minHeight: 'calc(100vh - 156px)' }}>
                {children}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>独立开发者 · 包子好吃 · me@dkvirus.com</Footer>
          </Layout>
        </Layout>
      )
}

export default BaseLayout
