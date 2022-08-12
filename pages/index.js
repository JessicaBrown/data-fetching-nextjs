import path from "path";
import fs from "fs/promises";
import Link from "next/link";

//fs would fail if used on client side only
//works to pull from server bc not seen on front end
export default function HomePage(props) {
	const { products } = props;
	console.log(products);
	return (
		<ul>
			{products.map((p) => (
				<li key={p.id}>
          			<Link href={`/products/${p.id}`}>{p.title}</Link>
				</li>
			))}
		</ul>
	);
}
// only use getStaticProps OR getServerSideProps never at the same time
export async function getStaticProps(context) {
  console.log('(re-)Generating...')
	//getStaticProps will not show on client side ever!!

	//gives current working directory: will be overall folder not pages 
	const filePath = path.join(process.cwd(), "data", "dummyBackend.json");
	const jsonData = await fs.readFile(filePath);
	const data = JSON.parse(jsonData);
	//no data then redirect 
	if(!data){
		return {
			redirect: {
				destination: '/no-data'
			}
		}
	}
	//when you want to register the 404 page when you fail to fetch data
	if(data.products.length === 0){
		return {notFound: true}
	}
	return {
		props: {
      products: data.products
    },
    //add second key (revalidate) it regenerates by seconds:  10 seconds in this example
    //in development number doesnt matter bc it constantly regenerates
    revalidate: 10,
	//if you add notFound true it sends you to 404 page
	// notFound: true
	//failed to fetch data then redirect
	// redirect: 

	//hardcoded
		// props: {
		// 	products: [
		// 		{ id: "p1", title: "Product 1" },
		// 		{ id: "p2", title: "Product 2" },
		// 	],
		// },
	};
}
