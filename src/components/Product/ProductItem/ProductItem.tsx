import {
	AccountUtils,
	CartUtils,
	ICartResponse,
	IProduct,
	IUserFlat,
	ProductInventoryUtils,
	ProductUtils,
} from '@houseofcodecy/hoc-utils';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	IconButton,
	Typography,
} from '@mui/material';
import { grey, orange, red } from '@mui/material/colors';

import React, { useEffect, useRef, useState } from 'react';

interface CustomProps {
	product: IProduct;
	user: IUserFlat | undefined | null;
	addUser: (user: IUserFlat) => void;
	updateCart: (cart: ICartResponse) => void;
	cart?: ICartResponse | null;
	nextRouter: any;
}

const ProductItem = ({
	product,
	user,
	addUser,
	cart,
	updateCart,
	nextRouter,
}: CustomProps) => {
	const [isProductFavorite, setIsProductFavorite] = useState(false);
	const [productStock, setProductStock] = useState(0);

	const dataFetchedRef = useRef(false);

	useEffect(() => {
		if (user && user.favorite_products)
			setIsProductFavorite(
				ProductUtils.isProductFavorite(user.favorite_products, product)
			);
	}, [user]);

	useEffect(() => {
		async function fetchData() {
			const productInventory: number =
				await ProductInventoryUtils.calculateProductInventory(product);
			productInventory ? setProductStock(productInventory) : undefined;
		}
		if (dataFetchedRef.current) return;
		dataFetchedRef.current = true;
		fetchData();
	}, []);

	/**
	 * Add/Remove a product from user favorites from hoc-utils
	 */
	const updateUserFavorites = async () => {
		if (user) {
			await ProductUtils.addProductToFavorites(
				product,
				user,
				addUser,
				!isProductFavorite
			);
		}
	};

	const addProductToCard = () => {
		if (user) {
			if (cart) {
				CartUtils.createCartActionsAndGetCart(cart, 1, updateCart, product);
			} else {
				CartUtils.createCartAndCartAction(
					AccountUtils.tranformUserFlatToUser(user),
					1,
					updateCart,
					product
				);
			}
		} else {
			nextRouter.push('/login');
		}
	};

	return (
		<Card sx={{ w: 1, display: 'flex', justifyContent: 'flex-start' }}>
			{product?.attributes.mediaUrls && (
				<CardMedia
					component='img'
					sx={{
						objectFit: 'contain',
						minHeight: 160,
						maxHeight: 160,
						maxWidth: 140,
						minWidth: 140,
						cursor: 'pointer',
					}}
					image={product?.attributes.mediaUrls[0]}
					title={product?.attributes.name}
					onClick={() => {
						nextRouter.push(`/product/${product.id}`);
					}}
				/>
			)}
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<CardContent
					sx={{ flex: '1 0 auto', cursor: 'pointer' }}
					onClick={() => {
						nextRouter.push(`/product/${product.id}`);
					}}>
					<Typography
						component='div'
						sx={{ fontSize: '16px', fontWeight: 'bold' }}>
						{product?.attributes?.name}
					</Typography>
					<Typography component='div' sx={{ fontSize: '14px' }}>
						€{product?.attributes.price}
					</Typography>
					<Typography variant='subtitle2' color='text.secondary'>
						Availability:{productStock}
					</Typography>
				</CardContent>
				<Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
					<IconButton
						aria-label='addToCart'
						size='large'
						disabled={productStock <= 0}
						onClick={() => {
							addProductToCard();
						}}>
						<AddShoppingCartIcon
							sx={{ color: productStock <= 0 ? grey[400] : orange[900] }}
						/>
					</IconButton>
					<IconButton
						aria-label='favorite'
						size='large'
						onClick={() => {
							if (user) {
								updateUserFavorites();
							} else {
								nextRouter.push('/login');
							}
						}}>
						{isProductFavorite ? (
							<FavoriteIcon sx={{ color: red[600] }} />
						) : (
							<FavoriteBorderIcon sx={{ color: grey[700] }} />
						)}
					</IconButton>
				</Box>
			</Box>
		</Card>
	);
};

export default ProductItem;
