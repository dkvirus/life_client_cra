import React, { useState } from 'react'
import { Box, Flex, Button } from 'druikit'
import { useHistory } from 'react-router-dom'
import { Input } from 'pages/layouts/SignInLayout/components/Input'
import { getToken } from 'apis'
import SignInLayout from 'pages/layouts/SignInLayout'

const SignIn = () => {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const history = useHistory()
    
    const onSignIn = async () => {
        if (!username || !password) {
            return
        }
        setLoading(true)
        try {
            await getToken(username, password)
            setLoading(false)
            history.push('/')
        } catch (e) {
            setLoading(false)
        }
    }

    return (
        <SignInLayout loading={loading}>
            <Input 
                label="用户名"
                placeholder="输入用户名"
                value={username}
                onChange={value => setUsername(value)}
            />

            <Box height={30} />

            <Input 
                label="密码"
                placeholder="输入密码"
                type="password"
                value={password}
                onChange={value => setPassword(value)}
            />

            <Box height={40} />

            <Flex justifyContent="flex-end">
                <Button 
                    danger 
                    onClick={onSignIn}
                    style={{ width: '100%' }}
                >
                    登录
                </Button>
            </Flex>
        </SignInLayout>
    )
}

export default SignIn
