/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Products } from '@/services/Product.service';
import { getFormatedStringFromDays } from '@/utils';
import { useRouter } from 'next/router';
import React, { FC } from 'react'
import { Badge, Button, Card, Col } from 'react-bootstrap';
import { Eye, Link, Pen, Trash, Upload } from 'react-bootstrap-icons';
import StarRatingComponent from 'react-star-rating-component';
import { useToasts } from 'react-toast-notifications';
import { isArray } from 'util';

interface Props {
    product: Record<string, any>;
    userType: string;
}

const ProductItem: FC<Props> = ({ product, userType }) => {
    const { addToast } = useToasts();
	const [isLoading, setIsLoading] = React.useState(false);
	const [uploading, setUploading] = React.useState(false);
	const router = useRouter();
	const deleteProduct = async () => {
		try {
			setIsLoading(true);
			const deleteConfirm = confirm(
				'Want to delete? You will lost all details, skus and licences for this product'
			);
			if (deleteConfirm) {
				const deleteProductRes = await Products.deleteProduct(product._id);
				if (!deleteProductRes.success) {
					throw new Error(deleteProductRes.message);
				}
				router.push('/products/');
				addToast(deleteProductRes.message, {
					appearance: 'success',
					autoDismiss: true,
				});
			}
		} catch (error: any) {
			if (error.response) {
				if (
					isArray(error.response.data?.message) &&
					Array.isArray(error.response?.data?.message)
				) {
					return error.response.data.message.forEach((message: any) => {
						addToast(message, { appearance: 'error', autoDismiss: true });
					});
				} else {
					return addToast(error.response.data.message, {
						appearance: 'error',
						autoDismiss: true,
					});
				}
			}
			addToast(error.message, { appearance: 'error', autoDismiss: true });
		} finally {
			setIsLoading(false);
		}
	};

	const uploadProductImage = async (e: any) => {
		try {
			setUploading(true);
			const file = e.target.files[0];
			const formData = new FormData();
			formData.append('productImage', file);
			const uploadProductImageRes = await Products.uploadProductImage(
				product._id,
				formData
			);
			if (!uploadProductImageRes.success) {
				throw new Error(uploadProductImageRes.message);
			}
			product.image = uploadProductImageRes.result;
			addToast(uploadProductImageRes.message, {
				appearance: 'success',
				autoDismiss: true,
			});
		} catch (error: any) {
			if (error.response) {
				if (
					isArray(error.response.data?.message) &&
					Array.isArray(error.response?.data?.message)
				) {
					return error.response.data.message.forEach((message: any) => {
						addToast(message, { appearance: 'error', autoDismiss: true });
					});
				}
				return addToast(error.response.data.message, {
					appearance: 'error',
					autoDismiss: true,
				});
			}
			addToast(error.message, { appearance: 'error', autoDismiss: true });
		} finally {
			setUploading(false);
		}
	};
	
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
					{userType === 'admin' ? (
						<div className='btnGrpForProduct'>
							<div className='file btn btn-md btn-outline-primary fileInputDiv'>
								<Upload />
								<input
									type='file'
									name='file'
									className='fileInput'
									onChange={uploadProductImage}
								/>
							</div>
							<Link href={`/products/update-product?productId=${product?._id}`}
								className='btn btn-outline-dark viewProdBtn'
								>
									<Pen />								
							</Link>
							<Button
								variant='outline-dark'
								className='btn btn-outline-dark viewProdBtn'
								onClick={() => deleteProduct()}
							>
								{isLoading && (
									<span
										className='spinner-border spinner-border-sm mr-2'
										role='status'
										aria-hidden='true'
									></span>
								)}
								<Trash />
							</Button>
							<Link href={`/products/update-product?productId=${product?._id}`}
								className='btn btn-outline-dark viewProdBtn'>
									<Eye />
							</Link>
						</div>
					):(
					<Link href={``}	className='btn btn-outline-dark viewProdBtn'>
								<Eye />
								Ver Detalles
							
						</Link>
						)}
				</Card.Body>
			</Card>
		</Col>
	);
};

export default ProductItem