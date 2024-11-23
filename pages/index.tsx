/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {  GetServerSideProps, NextPage} from 'next';
import { useRouter } from 'next/router';
import { Button, Col, Row } from 'react-bootstrap';
import styles from '../styles/Home.module.css';
import ProductItem from '../components/Products/ProductItem';
import axios from 'axios';
import context from 'react-bootstrap/esm/AccordionContext';

interface Props{
    products: Record<string, any>;
}

const Home: NextPage<Props> = ({ products, metadata}) => {
    console.log(products);
    const router = useRouter();
    return(
        <>
            <h3 className={styles.productCats}>Ultimos Productos</h3>
            <Row className='g-4' xs={4} md={4}>
                {products.latestProducts &&
                    products.latestProducts.map((product: any, index: React.Key) => (
                        <ProductItem product={product} userType={'customer'} key={index} />
                    ))
                }
            </Row>
            <hr />
            <h3 className={styles.productCats}>Los Mas Pedidos</h3>
            <Row className='g-4' xs={4} md={4}>
                {products.topRatedProducts &&
                    products.topRatedProducts.map((product: any, index: React.Key) => (
                        <ProductItem product={product} userType={'customer'} key={index} />
                    ))
                }
            </Row>
            <Row>
                <Col>
                    <Button 
                    variant='primary' 
                    className={styles.viewMoreBtn} 
                    onClick={() => router.push('/products')}
                    >
                      Ver Mas
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
    context
): Promise<any> => {

    try {
        const { data } = await axios.get(
            `${
                process.env.NODE_ENV === 'production' 
                    ? process.env.NEXT_PUBLIC_BASE_API_PROD_URL 
                    : process.env.NEXT_PUBLIC_BASE_API_URL
            }/products?homepage=true`
        );
        return {
            props: {
                products: data?.result[0] || {},
            },
        };
    } catch (error) {
        console.error(error);
    }
    return { 
        props: {
            products:  {},
        },
    };

};


export default Home;