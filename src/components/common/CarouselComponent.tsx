import { Grid, Paper } from '@mui/material';
import React from 'react';
import Carousel from 'react-material-ui-carousel';

interface Props {
	media: string[];
	width?: string;
	flexColumnSize?: number;
	autoPlay?: boolean;
}

const CarouselComponent = ({
	media,
	width,
	flexColumnSize = 11,
	autoPlay = false,
}: Props) => {
	return (
		<Grid container display={'flex'} justifyContent={'center'}>
			<Grid item xs={12} lg={flexColumnSize}>
				<Carousel
					fullHeightHover={false}
					autoPlay={autoPlay}
					indicators={true}
					navButtonsAlwaysVisible={false}
					cycleNavigation={true}
					animation={'slide'}
					swipe={true}
					duration={100}
					navButtonsProps={{
						// Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
						style: {
							backgroundColor: 'black',
							borderRadius: 5,
						},
					}}
					navButtonsWrapperProps={{
						// Move the buttons to the bottom. Unsetting top here to override default style.
						style: {
							bottom: '0',
							top: 'unset',
						},
					}}
					sx={{
						textAlign: 'center',
						minHeight: 400,
						maxHeight: 400,
					}}>
					{media.map((image, i) => (
						<Paper key={i}>
							<img
								src={`${image}`}
								alt={image}
								height={360}
								style={{ objectFit: 'cover' }}
								width={width ? width : undefined}
							/>
						</Paper>
					))}
				</Carousel>
			</Grid>
		</Grid>
	);
};

export default CarouselComponent;
