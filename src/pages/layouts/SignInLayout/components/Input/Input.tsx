import React from 'react'
import { Flex, Text, Box } from 'druikit'
import styles from './styles.module.scss'

export const Input = ({
    value,
    onChange,
    label,
    placeholder,
    type = 'text',
}: {
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    placeholder?: string;
    type?: 'text' | 'password';
}) => {
    return (
        <>
            <Flex justifyContent="space-between">
                <Text fontSize16 color666>{label}</Text>
                <Text>*</Text>
            </Flex>
            <Box height={10} />
            <input
                className={styles.input}
                type={type}
                autoComplete="on"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange?.(e.target.value)}
                onPaste={e => window.location.host.indexOf('host') === -1 && e.preventDefault()}
            />
        </>
    )
}
