import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface FacebookCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const FacebookCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: FacebookCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        d="M11.28 2.024c-.099.009-.387.044-.64.078-3.737.51-6.847 3.065-8.095 6.649-.664 1.908-.71 4.177-.122 6.115a10.022 10.022 0 0 0 7.907 6.992l.15.026V15.007l-.67-.014c-.636-.012-.682-.019-.914-.126a1.698 1.698 0 0 1-.764-.767c-.097-.207-.112-.29-.112-.6 0-.32.014-.389.124-.62.157-.33.406-.579.736-.736.253-.121.277-.124.926-.137l.665-.014.019-1.246c.017-1.102.029-1.283.103-1.556.191-.709.446-1.153.945-1.653.501-.501.962-.764 1.645-.939.405-.103 1.16-.144 1.519-.082.53.093.951.41 1.171.883.088.187.103.276.103.6 0 .324-.015.413-.103.6a1.565 1.565 0 0 1-1.13.877 4.257 4.257 0 0 1-.594.043c-.353 0-.359.002-.493.136l-.136.136v2.201l.67.014c.636.012.682.019.914.126.309.143.617.452.764.767.097.207.112.29.112.6s-.015.393-.112.6a1.698 1.698 0 0 1-.764.767c-.232.107-.278.114-.914.126l-.67.014v3.436c0 1.891.011 3.437.024 3.437.013 0 .206-.037.43-.082a10.022 10.022 0 0 0 6.881-5.161c1.565-2.967 1.508-6.645-.149-9.546-1.547-2.709-4.127-4.488-7.213-4.972-.495-.078-1.782-.133-2.213-.095"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  )
}
