/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react"
import queryString from 'query-string';
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import BreadcrumbDisplay from "@/components/shared/BreadcrumbDisplay";
import { useRouter } from "next/router";
import ProductItem from "@/components/Products/ProductItem";
import ProductFilter from "@/components/Products/ProductFilter";


interface Props {
	products: Record<string, any>[];
	metadata: Record<string, any>;
}

const AllProducts: NextPage<Props> = ({ products, metadata }) => {
    const [sortText, setSortText] = useState('Sort by');
    const router = useRouter();

    
    return 	(
        <>
        <Row>
            <Col md={8}>
                <BreadcrumbDisplay
                    childrens={[
                        {
                            active: false,
                            href: '/',
                            text: 'Home',
                        },
                        {
                            active: true,
                            href: '',
                            text: 'Products',
                        },
                    ]}
                />
            </Col>
            <Col md={4}>
                <DropdownButton
                    variant='outline-secondary'
                    title={sortText}
                    id='input-group-dropdown-2'
                    onSelect={(e) => {
                        if (e) {
                            setSortText(
                                e === '-avgRating'
                                    ? 'Rating'
                                    : e === '-createdAt'
                                    ? 'Latest'
                                    : 'Sort By'
                            );
                            delete router.query.offset;
                            router.query.sort = e;
                            router.push(router);
                        } else {
                            delete router.query.sort;
                            router.push(router);
                        }
                    }}
                >
                    <Dropdown.Item eventKey='-avgRating'>          Rating               </Dropdown.Item>
                    <Dropdown.Item eventKey='-createdAt'>            Latest                </Dropdown.Item>
                    <Dropdown.Item eventKey=''>               Reset             </Dropdown.Item>
                </DropdownButton>
            </Col>
        </Row>
        <Row>
        <Col sm={2}>	<ProductFilter />	</Col>
				<Col sm={10}>
					<Row xs={1} md={3} className='g-3'>
						{products && products.length > 0 ? (
							products.map((product: Record<string, any>) => (
								<ProductItem
									key={product._id }
									userType='customer'
									product={product}
								/>
							))
						) : (
							<h1>No Products</h1>
						)}
					</Row>
				</Col>
        </Row>
        <Row>
            <Col>
               
            </Col>
        </Row>
    </>
);

};

export const getServerSideProps: GetServerSideProps<Props> = async (
	context
): Promise<any> => {
	try {
		// get products with axios
		const url = queryString.stringifyUrl({
			url: `${
				process.env.NODE_ENV !== 'production'
                ? process.env.NEXT_PUBLIC_BASE_API_PROD_URL 
                : process.env.NEXT_PUBLIC_BASE_API_URL
			}/products`,
			query: context.query,
		});
		const { data } = await axios.get(url);
		return {
			props: {
				products: data?.result?.products || [],
				metadata: data?.result?.metadata || {},
			},
		};
	} catch (error) {
		console.log(error);
        return { //3:20:00 aprox
            props: {
                products:  {} ,
            },
        }
	}
};

export default AllProducts;