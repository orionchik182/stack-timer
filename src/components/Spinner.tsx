import React from 'react'
import { Flex, Spin } from 'antd'

const Spinner: React.FC = () => {
  return (
    <div>
      <Flex align="center" gap="middle">
        <Spin size="large" />
      </Flex>
    </div>
  )
}

export default Spinner
