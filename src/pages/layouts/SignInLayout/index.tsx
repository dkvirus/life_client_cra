import React, { ReactNode } from 'react'
import { Box, Text, Spin } from 'druikit'
import styles from './styles.module.scss'

const SignInLayout = ({
    loading = false,
    children,
}: {
    loading?: boolean;
    children?: ReactNode;
}) => {
    return (
        <div className={styles.wrapper}>
            <Spin spinning={loading} className={styles.right}>
                <div className={styles.form}>
                    <Text fontSize32 color666 uppercase>登录</Text>
                    <Text fontSize16 color666>使用谷歌浏览器</Text>
                    <Box height={60} />
                    {children}
                </div>
            </Spin>
        </div>
    )
}

export default SignInLayout
