import { useEffect, useState } from 'react';
import useSWR from 'swr';

//when using getStaticProps: can remove props and props.sales
export default function LastSalesPage(props) {
   const [sales, setSales] = useState(props.sales);
 //  const [isLoading, setIsLoading] = useState(false);

 //NEXT JS WAY OF PULLING DATA ON CLIENT SIDE
 const { data, error } = useSWR('https://next-js-4946c-default-rtdb.firebaseio.com/sales.json', (url) => fetch(url).then(res => res.json()))
  {/* 
  This only works when using getStaticProps
  const { data, error } = useSWR(
    'https://next-js-4946c-default-rtdb.firebaseio.com/sales.json'
  ); 
*/}
// useEffect to transform data from json to array of objects
  useEffect(() => {
    if (data) {
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }

      setSales(transformedSales);
    }
  }, [data]);

  // REACT WAY OF HANDLING PULLING DATA ON CLIENT SIDE
  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch('https://next-js-4946c-default-rtdb.firebaseio.com/sales.json')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const transformedSales = [];

  //       for (const key in data) {
  //         transformedSales.push({
  //           id: key,
  //           username: data[key].username,
  //           volume: data[key].volume,
  //         });
  //       }

  //       setSales(transformedSales);
  //       setIsLoading(false);
  //     });
  // }, []);

  // if(isLoading){
  //   return <p>Loading...</p>
  // }

  // if(!sales){
  //   return <p>No data yet...</p>
  // }

  if (error) {
    return <p>Failed to load.</p>;
  }
  // must be or when not using getStaticProps
  if (!data && !sales) {
    return <p>Loading...</p>;
  }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - ${sale.volume}
        </li>
      ))}
    </ul>
  );
}
//fetching data on server side
//to use as initial state on the server
export async function getStaticProps() {
  const response = await fetch(
    'https://next-js-4946c-default-rtdb.firebaseio.com/sales.json'
  );
  const data = await response.json();

  const transformedSales = [];

  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      volume: data[key].volume,
    });
  }

  return { props: { sales: transformedSales } };
}


