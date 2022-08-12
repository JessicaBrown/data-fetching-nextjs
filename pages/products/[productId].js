import path from "path";
import fs from "fs/promises";

export default function ProductDetailPage(props){
    const {loadedProduct} = props;

    if(!loadedProduct){
        return <p>Loading...</p>
    }

    return(
    <>
    <h1>{loadedProduct.title}</h1>
    <p>{loadedProduct.description}</p>
    </>
    )
}
//refactor and pull code out to keep dry
async function getData(){
    const filePath = path.join(process.cwd(), "data", "dummyBackend.json");
	const jsonData = await fs.readFile(filePath);
	const data = JSON.parse(jsonData);

    return data;
}

export async function getStaticProps(context){
    const {params} = context;

    const productId = params.productId;

    const data = await getData();

    const product = data.products.find(p => p.id === productId)
    //if manually go to link that doesnt exist this will send you to 404
    if(!product){
        return {
            notFound: true
        }
    }
    return {
        props: {
            loadedProduct: product
        }
    }
}

// when dynamic must use getStaticPaths to render routes
export async function getStaticPaths(){
    const data = await getData();
    const ids = data.products.map(p => p.id);
    const pathsWithParams = ids.map(id => ({params: {productId: id}}))
    return {
        paths: pathsWithParams,
        // paths: [
        //     {params: {productId: 'p1'}},
        //     // {params: {productId: 'p2'}},
        //     // {params: {productId: 'p3'}},
        // ],
        //falback true: can still go to other pages but they
        // are not pre rendered// used for less visited pages

        // if you dont set loading function at top when you go 
        //directly to the url you will get errors when using  fallback: true
        fallback: false
        //If you choose to use fallback: 'blocking' then there is not need for the 
        //loading function at the top  **this method is slower**
        //response will be fully loaded when it does return
    }
}