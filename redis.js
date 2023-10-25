const { createClient } =require('redis') ;

const testRD = async()=>{
    const client = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
  
  await client.set('key', 'value');
  const value = await client.get('key');
  await client.disconnect();
}
testRD()