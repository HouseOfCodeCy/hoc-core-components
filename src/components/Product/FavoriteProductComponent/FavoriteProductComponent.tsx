import { IProductFlat } from '@houseofcodecy/hoc-utils'
import { Card, CardContent, CardMedia, CardProps, Typography } from '@mui/material'
import React from 'react'
import { IElementProps } from '../../../interfaces/common'

interface CustomProps {
  product: IProductFlat
}

export interface CustomProductFavoriteProps extends IElementProps, CardProps, CustomProps {}

const FavoriteProductComponent = (props: CustomProductFavoriteProps) => {
  // test
  const { product } = props
  return (
    <Card sx={{ w: 1, display: 'flex', justifyContent: 'flex-start' }}>
      <CardMedia sx={{ flexBasis: ' 5rem' }} image={product?.mediaUrl} title={product?.name} />
      <CardContent sx={{ w: 1 }}>
        <Typography gutterBottom variant='body2' component='div'>
          {product?.name}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {product?.price}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default FavoriteProductComponent
