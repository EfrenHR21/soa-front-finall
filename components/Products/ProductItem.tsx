/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFormatedStringFromDays } from '@/utils';
import { useRouter } from 'next/router';
import React, { FC } from 'react'
import { Badge, Button, Card, Col } from 'react-bootstrap';
import { Eye, Link, Pen, Trash, Upload } from 'react-bootstrap-icons';
import StarRatingComponent from 'react-star-rating-component';
import { useToasts } from 'react-toast-notifications';

interface Props {
    product: Record<string, any>;
    userType: string;
}

const ProductItem: FC<Props> = ({ product, userType }) => {
    
    return (
		// eslint-disable-next-line react/jsx-key
		<Col>
			<Card className='productCard'>
				<Card.Img	variant='top'	src={product?.image	}	/>
				<Card.Body>
					<Card.Title>{product.name}</Card.Title>
					<StarRatingComponent
						name='rate1'
						starCount={5}
						value={product?.avgRating || 0}
					/>
					<Card.Text>
						<span className='priceText'>
							<span className='priceText'>
								{product.skuDetails
									? product.skuDetails.length > 1
										? `S/.${Math.min.apply(
												Math,
												product?.skuDetails.map(
													(o: any) => o.price	)
										  )} - S/.${Math.max.apply(
												Math,
												product?.skuDetails.map(
													(o: any) => o.price	)
										  )}`
										: `S/.${product.skuDetails[0]?.price || 'S/.000'}`
									: 'S/.000'}
							</span>
						</span>
					</Card.Text>
					{product.skuDetails &&
						product.skuDetails.length > 0 &&
						product.skuDetails
							.sort(
								(a: { validity: number }, b: { validity: number }) =>
									a.validity - b.validity
							)
							.map((sku:  any, index: React.Key) => (
								<Badge bg='warning' text='dark' className='skuBtn' key={index}>
									{sku.lifetime
										? 'Lifetime'
										: getFormatedStringFromDays(sku.validity)}
								</Badge>
							))}
					<br />
					<Link href={`/products/${product?._id}`}
							className='btn btn-outline-dark viewProdBtn'>
								<Eye />
								Ver Detalles
							
						</Link>
				</Card.Body>
			</Card>
		</Col>
	);
};

export default ProductItem