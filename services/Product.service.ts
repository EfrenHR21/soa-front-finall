/* eslint-disable @typescript-eslint/no-explicit-any */
import requests, { responsePayload } from './api';
import queryString from 'query-string';

// create product service
export const Products = {
	// get products for customer
	getProducts: async (
		filter: Record<string, any>,
		serverSide: boolean = false
	): Promise<responsePayload> => {
		const url = queryString.stringifyUrl({
			url: serverSide ? '' : '/products',
			query: filter,
		});
		const getProductRes = await requests.get(url);
		return getProductRes;
	},
	// get product details
	getProduct: async (id: string): Promise<responsePayload> => {
		const getProductRes = await requests.get('/products/' + id);
		return getProductRes;
	},
	// save product details
	saveProduct: async (
		product: Record<string, any>
	): Promise<responsePayload> => {
		const saveProductRes = await requests.post('/products', product);
		return saveProductRes;
	},
	// update product details
	updateProduct: async (
		id: string,
		product: Record<string, any>
	): Promise<responsePayload> => {
		const updateProductRes = await requests.patch('/products/' + id, product);
		return updateProductRes;
	},

	// delete product details
	deleteProduct: async (id: string): Promise<responsePayload> => {
		const deleteProductRes = await requests.del('/products/' + id);
		return deleteProductRes;
	},

	// upload product image
	uploadProductImage: async (
		id: string,
		image: any
	): Promise<responsePayload> => {
		const uploadProductImageRes = await requests.post(
			'/products/' + id + '/image',
			image
		);
		return uploadProductImageRes;
	},

	// add sku details for an product
	addSku: async (
		productId: string,
		sku: Record<string, any>
	): Promise<responsePayload> => {
		const addSkuRes = await requests.post(
			'/products/' + productId + '/skus',
			sku
		);
		return addSkuRes;
	},

	// update sku details for an product
	updateSku: async (
		productId: string,
		skuId: string,
		sku: Record<string, any>
	): Promise<responsePayload> => {
		const updateSkuRes = await requests.put(
			'/products/' + productId + '/skus/' + skuId,
			sku
		);
		return updateSkuRes;
	},

	// delete sku details for an product
	deleteSku: async (
		productId: string,
		skuId: string
	): Promise<responsePayload> => {
		const deleteSkuRes = await requests.del(
			'/products/' + productId + '/skus/' + skuId
		);
		return deleteSkuRes;
	},

	// get all licenses for a product SKU
	getLicenses: async (
		productId: string,
		skuId: string
	): Promise<responsePayload> => {
		const getLicensesRes = await requests.get(
			'/products/' + productId + '/skus/' + skuId + '/licenses'
		);
		return getLicensesRes;
	},

	// add license for a product SKU
	addLicense: async (
		productId: string,
		skuId: string,
		license: Record<string, any>
	): Promise<responsePayload> => {
		const addLicenseRes = await requests.post(
			'/products/' + productId + '/skus/' + skuId + '/licenses',
			license
		);
		return addLicenseRes;
	},

	// update license for a product SKU
	updateLicense: async (
		productId: string,
		skuId: string,
		licenseId: string,
		license: Record<string, any>
	): Promise<responsePayload> => {
		const updateLicenseRes = await requests.put(
			'/products/' + productId + '/skus/' + skuId + '/licenses/' + licenseId,
			license
		);
		return updateLicenseRes;
	},

	// delete license for a product SKU
	deleteLicense: async (licenseId: string): Promise<responsePayload> => {
		const deleteLicenseRes = await requests.del(
			'/products/licenses/' + licenseId
		);
		return deleteLicenseRes;
	},

	// add review for an product
	addReview: async (
		productId: string,
		review: Record<string, any>
	): Promise<responsePayload> => {
		const addReviewRes = await requests.post(
			'/products/' + productId + '/reviews/',
			review
		);
		return addReviewRes;
	},

	// delete product review
	deleteReview: async (
		productId: string,
		reviewId: string
	): Promise<responsePayload> => {
		const addLicenseRes = await requests.del(
			'/products/' + productId + '/reviews/' + reviewId
		);
		return addLicenseRes;
	},
};