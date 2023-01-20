import { IAddress, IUserFlat } from '@houseofcodecy/hoc-utils';
import {
	Add,
	ArrowBackIos,
	ArrowForwardIos,
	ArrowForwardIosOutlined,
} from '@mui/icons-material';
import {
	AppBar,
	Button,
	Chip,
	Dialog,
	Grid,
	IconButton,
	Slide,
	Toolbar,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { TransitionProps } from '@mui/material/transitions';
import React, { useEffect, useState } from 'react';

interface Props {
	user: IUserFlat;
	isCheckout?: boolean;
	shippingAddress: IAddress | null;
	updateShippingAddress: (address: IAddress) => void;
}

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} in={true} {...props} />;
});

const AddressSelection = ({
	user,
	isCheckout,
	shippingAddress,
	updateShippingAddress,
}: Props) => {
	const [addresses, setAddresses] = useState<IAddress[]>();
	const [selectedAddress, setSelectedAddress] = useState<IAddress | undefined>(
		undefined
	);
	const [showAddressDialog, setShowAddressDialog] = useState(false);

	const handleClickOpen = () => {
		setShowAddressDialog(true);
	};

	const handleClose = () => {
		setShowAddressDialog(false);
	};

	useEffect(() => {
		if (user && user.addresses && user.addresses.length > 0) {
			setAddresses(user.addresses);
		}
	}, [user]);

	useEffect(() => {
		if (addresses && addresses.length > 0) {
			const storage = globalThis?.sessionStorage;
			const sessionShippingAddressId = storage.getItem('shippingAddress');
			const shippingAddresFromSession = addresses.find(
				(address) => address.id === +`${sessionShippingAddressId}`
			);
			const defaultAddress = addresses.find((address) => address.isDefault);
			// if context has a shipping address
			if (shippingAddress) {
				setSelectedAddress(shippingAddress);
			}
			// if shipping address exists on session
			else if (shippingAddresFromSession) {
				updateShippingAddress(shippingAddresFromSession);
				setSelectedAddress(shippingAddresFromSession);
			}
			// set shipping address from account default
			else if (defaultAddress) {
				updateShippingAddress(defaultAddress);
				setSelectedAddress(defaultAddress);
			}
		}
	}, [addresses]);

	return (
		<Grid container sx={{ padding: '5px' }}>
			<Grid item xs={12} sx={{ paddingBottom: '10px' }}>
				<Button
					sx={{
						border: '1px solid #CBBEB5',
						borderRadius: '10px',
						padding: '15px',
						width: '100%',
						textAlign: 'left',
					}}
					endIcon={!isCheckout ? <ArrowForwardIos /> : null}
					onClick={() => {
						!isCheckout ? handleClickOpen() : null;
					}}>
					<Grid container>
						<Grid
							item
							xs={12}
							sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
							{selectedAddress?.address1}, {selectedAddress?.address2},{' '}
							{`${selectedAddress?.city?.name}, ${selectedAddress?.postCode}, ${selectedAddress?.telephone}`}
						</Grid>
						<Grid item xs={12}>
							<small>
								{!isCheckout ? `Change Address` : `Shipping Address`}
							</small>
						</Grid>
					</Grid>
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Dialog
					fullWidth
					PaperProps={{
						sx: {
							position: 'fixed',
							width: '100%',
							bottom: 0,
							left: 0,
							right: 0,
							m: 0,
						},
					}}
					open={showAddressDialog}
					onClose={handleClose}
					TransitionComponent={Transition}>
					<AppBar
						sx={{
							position: 'relative',
							backgroundColor: grey[900],
							height: '70px',
							display: 'flex',
							justifyContent: 'center',
						}}>
						<Toolbar sx={{ color: grey[700] }}>
							<IconButton
								edge='start'
								color='inherit'
								onClick={handleClose}
								aria-label='close'>
								<ArrowBackIos />
							</IconButton>
						</Toolbar>
					</AppBar>
					<Grid container>
						<Grid item xs={12} sx={{ textAlign: 'center' }}>
							<h2>Addresses</h2>
						</Grid>
						{addresses?.map((address) => {
							return (
								<Grid item key={address.id} xs={12} sx={{ padding: '10px' }}>
									<Button
										sx={{
											borderTop: '3px solid black',
											padding: '15px',
											width: '100%',
											textAlign: 'left',
										}}
										onClick={() => {
											setSelectedAddress(address);
											handleClose();
											updateShippingAddress(address);
										}}
										endIcon={<ArrowForwardIosOutlined />}>
										<Grid container>
											<Grid
												item
												xs={12}
												sx={{ fontWeight: 'bold', fontSize: '20px' }}>
												{address.address1}
											</Grid>
											<Grid
												item
												xs={12}
												sx={{ fontWeight: 'bold', fontSize: '16px' }}>
												{address.address2}
											</Grid>
											<Grid item xs={12}>
												{`${address.city?.name}, ${address.postCode}`}
											</Grid>
											<Grid item xs={12}>
												{`${address.telephone}`}
											</Grid>
											{address.isDefault ? (
												<Chip
													label='Default'
													color='success'
													sx={{ marginTop: '10px' }}></Chip>
											) : address.id === selectedAddress?.id ? (
												<Chip
													label='Selected'
													color='warning'
													sx={{ marginTop: '10px' }}></Chip>
											) : null}
										</Grid>
									</Button>
								</Grid>
							);
						})}
						<Grid item xs={12}>
							<Button
								variant='contained'
								endIcon={<Add />}
								sx={{ width: '100%', padding: '15px' }}>
								Add New Address
							</Button>
						</Grid>
					</Grid>
				</Dialog>
			</Grid>
		</Grid>
	);
};

export default AddressSelection;